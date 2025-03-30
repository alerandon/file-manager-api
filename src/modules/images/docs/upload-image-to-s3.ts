export const UploadImageToS3Docs = {
  apiOperation: { summary: 'Upload an image to S3' },
  apiParam: { name: 'id', description: 'ID of the image to upload' },
  apiResponseStatus201: {
    status: 201,
    description: 'Image uploaded successfully.',
    schema: {
      example: {
        data: {
          uploadLink:
            'https://my-upload-link.com/test@example.com--pexels-photo-5212667.jpeg',
          file: {
            id: '7ae748d3-382f-4c96-bb41-7c0e419b6a80',
            name: 'pexels-photo-5212667.jpeg',
            uploadLink:
              'https://my-upload-link.com/test@example.com--pexels-photo-5212667.jpeg',
            createdAt: '2025-03-30T09:14:28.043Z',
            updatedAt: '2025-03-30T09:14:28.043Z',
            user: {
              id: '8138bf3b-1f4e-4da7-841c-6b5554bbfde8',
              email: 'test@example.com',
              password:
                '$argon2id$v=19$m=65536,t=3,p=4$80fB76aaPQqUEsLtMx46uA$xhiS85QuhBWFqhPbaOKwzHY1mZntFuexsUZ/D/dqoBA',
              resetCode: null,
              resetCodeExpiration: null,
              provider: null,
              createdAt: '2025-03-28T03:21:18.502Z',
              updatedAt: '2025-03-30T07:04:51.869Z',
            },
          },
        },
      },
    },
  },
  apiResponseStatus404: {
    status: 404,
    description: 'Image not found.',
    schema: {
      example: {
        message: 'Image not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  },
};
