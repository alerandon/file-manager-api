export const FindByIdDocs = {
  apiOperation: { summary: 'Get file by ID' },
  apiParam: { name: 'id', description: 'ID of the file to retrieve' },
  apiResponseStatus200: {
    status: 200,
    description: 'File retrieved successfully.',
  },
  apiResponseStatus404: {
    status: 404,
    description: 'File not found.',
  },
};
