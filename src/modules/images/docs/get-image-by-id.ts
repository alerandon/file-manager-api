export const GetImageByIdDocs = {
  apiOperation: { summary: 'Get image by ID' },
  apiParam: { name: 'id', description: 'ID of the image to retrieve' },
  apiResponseStatus200: {
    status: 200,
    description: 'Image retrieved successfully.',
  },
  apiResponseStatus404: {
    status: 404,
    description: 'Image not found.',
  },
};
