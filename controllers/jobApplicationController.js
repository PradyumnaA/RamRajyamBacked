const JobApplication = require('../models/jobApplicationModel');
const Job = require('../models/jobsModel');
const { getIo } = require('../socket');

const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params; // Ensure jobId is retrieved from params
    const userId = req.user._id; // Ensure req.user is properly populated

    // Check if the user has already applied for this job
    const existingApplication = await JobApplication.findOne({ job: jobId, applicant: userId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Find the job by ID and populate the createdBy field
    const job = await Job.findById(jobId).populate('createdBy');
    if (!job) {
      console.log('Job not found');
      return res.status(404).json({ message: 'Job not found' });
    }

    // Log the job and createdBy information
    console.log('Job:', job);
    console.log('Job createdBy:', job.createdBy);

    // Create a new job application
    const application = new JobApplication({
      job: jobId,
      applicant: userId,
    });

    await application.save();

    // Check if createdBy is defined
    if (!job.createdBy) {
      console.log('Job creator information is missing');
      return res.status(400).json({ message: 'Job creator information is missing' });
    }

    const io = getIo();
    console.log('Socket.IO instance:', io);

    // Notify the job creator via Socket.IO
    io.to(job.createdBy._id.toString()).emit('jobApplied', {
      message: 'A user has applied for your job',
      job: jobId,
      applicant: userId,
    });

    res.status(201).json({ message: 'Applied successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

const getAllAppliedJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('User ID:', userId);

    // Find all job applications by the user and populate the job, category, and applicant fields
    const applications = await JobApplication.find({ applicant: userId })
      .populate({
        path: 'job',
        populate: [
          { path: 'createdBy', select: 'name' },
          { path: 'category' }  // Populate the category field
        ]
      })
      .populate('applicant', 'name');
    console.log('Applications:', applications);

    // Check if applications array is empty
    if (applications.length === 0) {
      return res.status(200).json({ message: 'No data' });
    }

    const jobs = applications.map(application => {
      const job = application.job;

      // Ensure `job`, `createdBy`, and `applicant` are not null
      if (!job || !job.toObject()) {
        return null;
      }

      const createdByName = job.createdBy ? job.createdBy.name : 'Unknown';
      const applicantName = application.applicant ? application.applicant.name : 'Unknown';

      console.log('Job:', job);

      return {
        ...job.toObject(),
        applicationId: application._id,
        createdByName,  // Add createdBy name (or 'Unknown')
        applicantName,  // Add applicant name (or 'Unknown')
        category: job.category  // Include category details
      };
    }).filter(job => job !== null);  // Remove any null jobs

    // Check if the jobs array is empty after filtering
    if (jobs.length === 0) {
      return res.status(200).json({ message: 'No data' });
    }

    res.status(200).json({ jobs });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: error.message });
  }
};




//user applied for my created jobs
const getAllApplicantsForMyJobs = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all jobs created by the user
    const jobs = await Job.find({ createdBy: userId }).select('_id');
    if (!jobs.length) {
      return res.status(404).json({ message: 'No jobs found for this user' });
    }

    // Find all applications for these jobs, populating relevant fields
    const applications = await JobApplication.find({ job: { $in: jobs.map(job => job._id) } })
      .populate({
        path: 'job',
        select: 'title category createdBy',
        populate: [
          { path: 'category', select: 'name image' },  // Populate category details
          { path: 'createdBy', select: 'fullName' }   // Populate creator's name
        ]
      })
      .populate({
        path: 'applicant',
        select: 'fullName contactNo'  // Populate applicant's full name and contact number
      });

    const applicants = applications.map(application => {
      const job = application.job;
      return {
        applicationId: application._id,
        jobId: job._id,
        jobTitle: job.title,
        applicantId: application.applicant._id,
        applicantName: application.applicant.fullName,
        applicantContact: application.applicant.contactNo,
        jobCategory: {
          id: job.category._id,  // Include category id
          name: job.category.name,  // Include category name
          image: job.category.image  // Include category image
        },
        createdByName: job.createdBy.fullName  // Creator's name
      };
    });

    res.status(200).json({ applicants });
  } catch (error) {
    console.error('Error fetching applicants for my jobs:', error);
    res.status(400).json({ error: error.message });
  }
};





module.exports = { applyForJob, getAllAppliedJobs,getAllApplicantsForMyJobs };
