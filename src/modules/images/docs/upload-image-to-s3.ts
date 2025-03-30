export const UploadImageToS3Docs = {
  apiOperation: { summary: 'Upload an image to S3' },
  apiParam: { name: 'id', description: 'ID of the image to upload' },
  apiResponseStatus201: {
    status: 201,
    description: 'Image uploaded successfully.',
  },
  apiResponseStatus400: {
    status: 400,
    description: 'Invalid upload request.',
  },
};
