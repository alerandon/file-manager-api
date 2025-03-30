export const DownloadFileDocs = {
  apiOperation: { summary: 'Download a file' },
  apiParam: { name: 'name', description: 'Name of the file to download' },
  apiResponseStatus200: {
    status: 200,
    description: 'File downloaded successfully.',
  },
  apiResponseStatus404: {
    status: 404,
    description: 'File not found.',
    schema: {
      example: {
        message: 'File not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  },
};
