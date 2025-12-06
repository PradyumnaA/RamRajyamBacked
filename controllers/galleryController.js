// const Gallery = require('../models/galleryModel');
// const Counter = require('../models/galleryCounter');
// const Category = require('../models/galleryCategoryModel');
// const { v4: uuidv4 } = require('uuid');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const path = require('path');

// const getNextSequence = async (name) => {
//   const counter = await Counter.findOneAndUpdate(
//     { name },
//     { $inc: { seq: 1 } },
//     { new: true, upsert: true, useFindAndModify: false }
//   );
//   return counter.seq;
// };
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });
// // Create a new category
// exports.createCategory = async (req, res) => {
//   try {
    
//     const { name, category } = req.body;
//     const files = req.files;

//     if (!files || files.length === 0) {
//       return res.status(400).json({ error: 'Images are required' });
//     }
//         // Upload images to S3
//         const imageKeys = await Promise.all(
//           files.map(async (file) => {
//             const imageKey = `${uuidv4()}_${file.originalname}`;
//             const params = {
//               Bucket: process.env.UPLOADSIMAGEBUCKET,
//               Key: imageKey,
//               Body: file.buffer,
//               ContentType: file.mimetype,
//             };
//             await s3.send(new PutObjectCommand(params));
//             return imageKey;
//           })
//         );
//     const id = await getNextSequence('categoryId');
//     const newCategory = new Gallery({ id, name, images: imageKeys, category });
//     await newCategory.save();
//     const categoryDetails = await Category.findOne({ id: newCategory.category });
//     const response = {
//       ...newCategory.toObject(),
//       category: {
//         id: categoryDetails.id,
//         name: categoryDetails.name,
//         image: categoryDetails.image,
//       },
//     };
//     res.status(201).json(response);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// exports.getAllCategories = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search = '' } = req.query;
//     const query = { name: { $regex: search, $options: 'i' } };
//     const categories = await Gallery.find(query)
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));
//     const total = await Category.countDocuments(query);

//     // Get category details for each category
//     const categoriesWithDetails = await Promise.all(categories.map(async (category) => {
//       const categoryDetails = await Category.findOne({ id: category.category });
//       return {
//         ...category.toObject(),
//         category: {
//           id: categoryDetails.id,
//           name: categoryDetails.name,
//           image: categoryDetails.image,
//         },
//       };
//     }));

//     res.json({ total, page, limit, categories: categoriesWithDetails });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// exports.getCategoryById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const category = await Gallery.findOne({ id });
//     if (!category) {
//       return res.status(404).json({ message: 'Category not found' });
//     }
//     const categoryDetails = await Category.findOne({ id: category.category });
//     const response = {
//       ...category.toObject(),
//       category: {
//         id: categoryDetails.id,
//         name: categoryDetails.name,
//         image: categoryDetails.image,
//       },
//     };
//     res.json(response);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// exports.updateCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, category } = req.body;

//     // Find the existing category to get the current images
//     const existingCategory = await Gallery.findOne({ id });
//     if (!existingCategory) {
//       return res.status(404).json({ message: 'Category not found' });
//     }

//     const files = req.files;
//     let images;

//     // Handle image uploads
//     if (files && files.length > 0) {
//       const imageKeys = await Promise.all(
//         files.map(async (file) => {
//           const imageKey = `${uuidv4()}_${file.originalname}`;
//           const params = {
//             Bucket: process.env.UPLOADSIMAGEBUCKET,
//             Key: imageKey,
//             Body: file.buffer,
//             ContentType: file.mimetype,
//           };
//           await s3.send(new PutObjectCommand(params));
//           return imageKey;
//         })
//       );
//       images = imageKeys;
//     } else if (req.body.images) {
//       images = req.body.images;
//     }

//     // Create the update object and include the category field only if it's provided
//     const updateData = { name, images };
//     if (category) {
//       updateData.category = category;
//     }

//     const updatedCategory = await Gallery.findOneAndUpdate(
//       { id },
//       updateData,
//       { new: true, useFindAndModify: false }
//     );

//     if (!updatedCategory) {
//       return res.status(404).json({ message: 'Category not found' });
//     }

//     const categoryDetails = await Category.findOne({ id: updatedCategory.category });
//     const response = {
//       ...updatedCategory.toObject(),
//       category: categoryDetails ? {
//         id: categoryDetails.id,
//         name: categoryDetails.name,
//         image: categoryDetails.image,
//       } : null,
//     };

//     res.json(response);
//   } catch (error) {
//     console.error('Error updating category:', error);
//     res.status(400).json({ error: error.message });
//   }
// };

// exports.deleteCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedCategory = await Gallery.findOneAndDelete({ id });
//     if (!deletedCategory) {
//       return res.status(404).json({ message: 'Category not found' });
//     }
//     res.json({ message: 'Category deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
  
// // Controller method to get all gallery items
// exports.getAllGalleryWeb = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search = '' } = req.query;
//     const query = { name: { $regex: search, $options: 'i' } };
//     const galleries = await Gallery.find(query)
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));
//     const total = await Gallery.countDocuments(query);

//     // Get category details for each gallery item
//     const galleriesWithDetails = await Promise.all(galleries.map(async (gallery) => {
//       const categoryDetails = await Category.findOne({ id: gallery.category });
//       return {
//         ...gallery.toObject(),
//         category: {
//           id: categoryDetails.id,
//           name: categoryDetails.name,
//           image: categoryDetails.image,
//         },
//       };
//     }));

//     res.json({ total, page, limit, galleries: galleriesWithDetails });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// controllers/galleryController.js


// controllers/galleryController.js

const Gallery = require('../models/galleryModel');
const Counter = require('../models/galleryCounter');
const Category = require('../models/galleryCategoryModel');
const { v4: uuidv4 } = require('uuid');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

// SAHI S3 CLIENT KO IMPORT KAREIN
// Yeh path check karein. Agar aapka s3.js file controllers folder ke bahar hai, to '../s3' aayega.
const { s3 } = require('../s3'); 

const getNextSequence = async (name) => {
    const counter = await Counter.findOneAndUpdate(
        { name },
        { $inc: { seq: 1 } },
        { new: true, upsert: true, useFindAndModify: false }
    );
    return counter.seq;
};

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { name, category } = req.body;
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'Images are required' });
        }
        
        const BUCKET_NAME = process.env.UPLOADSIMAGEBUCKET;

        const imageKeys = await Promise.all(
            files.map(async (file) => {
                const imageKey = `gallery/${uuidv4()}_${file.originalname}`;
                const params = {
                    Bucket: BUCKET_NAME,
                    Key: imageKey,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                    ACL: 'public-read'
                };
                await s3.send(new PutObjectCommand(params));
                return imageKey;
            })
        );

        const id = await getNextSequence('categoryId');
        const newCategory = new Gallery({ id, name, images: imageKeys, category });
        await newCategory.save();

        const categoryDetails = await Category.findOne({ id: newCategory.category });
        
        const responseCategory = newCategory.toObject();
        responseCategory.images = responseCategory.images.map(imageKey => {
            return `${process.env.DO_SPACES_URL}/${imageKey}`;
        });

        const response = {
            ...responseCategory,
            category: categoryDetails ? {
                id: categoryDetails.id,
                name: categoryDetails.name,
                image: categoryDetails.image,
            } : null,
        };
        
        res.status(201).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all categories (Now returns full URLs)
exports.getAllCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = { name: { $regex: search, $options: 'i' } };
    const categories = await Gallery.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Gallery.countDocuments(query);

    const categoriesWithDetails = await Promise.all(categories.map(async (cat) => {
      const categoryDetails = await Category.findOne({ id: cat.category });
      
      const catObject = cat.toObject();
      // --- CHANGE IS HERE ---
      // Image keys ko poore URL mein badlein
      catObject.images = catObject.images.map(imageKey => {
        return `${process.env.DO_SPACES_URL}/${imageKey}`;
      });
      
      return {
        ...catObject,
        category: categoryDetails ? {
          id: categoryDetails.id,
          name: categoryDetails.name,
          image: categoryDetails.image,
        } : null,
      };
    }));

    res.json({ total, page, limit, categories: categoriesWithDetails });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get category by ID (Now returns full URLs)
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Gallery.findOne({ id });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const categoryDetails = await Category.findOne({ id: category.category });
    
    const categoryObject = category.toObject();
    // --- CHANGE IS HERE ---
    // Image keys ko poore URL mein badlein
    categoryObject.images = categoryObject.images.map(imageKey => {
        return `${process.env.DO_SPACES_URL}/${imageKey}`;
    });

    const response = {
      ...categoryObject,
      category: categoryDetails ? {
        id: categoryDetails.id,
        name: categoryDetails.name,
        image: categoryDetails.image,
      } : null,
    };
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a category (Now returns full URLs)
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;
    const BUCKET_NAME = process.env.UPLOADSIMAGEBUCKET;

    const existingCategory = await Gallery.findOne({ id });
    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const files = req.files;
    let images;

    if (files && files.length > 0) {
      const imageKeys = await Promise.all(
        files.map(async (file) => {
          const imageKey = `gallery/${uuidv4()}_${file.originalname}`;
          const params = {
            Bucket: BUCKET_NAME,
            Key: imageKey,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
          };
          await s3.send(new PutObjectCommand(params));
          return imageKey;
        })
      );
      images = imageKeys;
    } else if (req.body.images) {
      // Yeh logic tab kaam karega jab aap frontend se sirf key bhej rahe hain
      // Agar aap poora URL bhej rahe hain, to use aahi karna padega
      images = req.body.images.map(img => img.split('/').pop()); // Sirf key extract karein
    }

    const updateData = { name };
    if (images) {
        updateData.images = images;
    }
    if (category) {
      updateData.category = category;
    }

    const updatedCategory = await Gallery.findOneAndUpdate(
      { id },
      updateData,
      { new: true, useFindAndModify: false }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const categoryDetails = await Category.findOne({ id: updatedCategory.category });
    
    const updatedCategoryObject = updatedCategory.toObject();
    // --- CHANGE IS HERE ---
    // Image keys ko poore URL mein badlein
    updatedCategoryObject.images = updatedCategoryObject.images.map(imageKey => {
        return `${process.env.DO_SPACES_URL}/${imageKey}`;
    });

    const response = {
      ...updatedCategoryObject,
      category: categoryDetails ? {
        id: categoryDetails.id,
        name: categoryDetails.name,
        image: categoryDetails.image,
      } : null,
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a category (Functionality is unchanged)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Gallery.findOneAndDelete({ id });
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all gallery items for web (Now returns full URLs)
exports.getAllGalleryWeb = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = { name: { $regex: search, $options: 'i' } };
    const galleries = await Gallery.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Gallery.countDocuments(query);

    const galleriesWithDetails = await Promise.all(galleries.map(async (gallery) => {
      const categoryDetails = await Category.findOne({ id: gallery.category });
      
      const galleryObject = gallery.toObject();
      // --- CHANGE IS HERE ---
      // Image keys ko poore URL mein badlein
      galleryObject.images = galleryObject.images.map(imageKey => {
        return `${process.env.DO_SPACES_URL}/${imageKey}`;
      });

      return {
        ...galleryObject,
        category: categoryDetails ? {
          id: categoryDetails.id,
          name: categoryDetails.name,
          image: categoryDetails.image,
        } : null,
      };
    }));

    res.json({ total, page, limit, galleries: galleriesWithDetails });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};