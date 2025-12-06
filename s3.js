const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const { v4: uuidv4 } = require('uuid');

// Check if the endpoint variable is loaded. If not, the app should fail fast.
if (!process.env.DO_SPACES_ENDPOINT) {
    console.error("FATAL ERROR: DO_SPACES_ENDPOINT is not defined in the .env file.");
    process.exit(1); // Exit the application if the config is missing.
}

// THE CORRECT S3 CLIENT INITIALIZATION FOR DIGITALOCEAN
const s3 = new S3Client({
    // This is the most important line. It points directly to DigitalOcean's server.
    endpoint: `https://${process.env.DO_SPACES_ENDPOINT}`,

    // The region must match the beginning of your endpoint.
    region: process.env.AWS_REGION, // This should be "blr1" from your .env file

    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const BUCKET = process.env.UPLOADSIMAGEBUCKET; // This should be "uma-classees"

const uploadToS3 = async ({ file, folder = 'uploads' }) => {
    if (!file) {
        throw new Error("File is required for upload.");
    }

    const key = `${folder}/${uuidv4()}-${file.originalname.replace(/\s+/g, '-')}`;

    const uploadParams = {
        Bucket: BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read' // Makes the file publicly accessible via its URL
    };

    try {
        const upload = new Upload({
            client: s3,
            params: uploadParams
        });

        await upload.done();

        const location = `https://${BUCKET}.${process.env.DO_SPACES_ENDPOINT}/${key}`;
        console.log('File uploaded successfully to DigitalOcean:', location);

        return { key, location };
    } catch (error) {
        // Log the detailed error
        console.error('Error uploading to DigitalOcean Spaces:', error);
        // Provide a clearer error message to the caller
        if (error.name === 'CredentialsProviderError') {
             throw new Error('Failed to upload file: Could not load credentials. Check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in the .env file.');
        }
        throw new Error('Failed to upload file to DigitalOcean Spaces.');
    }
};

module.exports = { uploadToS3, s3 };