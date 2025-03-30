export const UploadFileDocs = {
  apiOperation: { summary: 'Upload a file' },
  apiBody: {
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  },
  apiResponseStatus201: {
    status: 201,
    description: 'File uploaded successfully.',
  },
  apiResponseStatus400: {
    status: 400,
    description: 'Invalid file upload request.',
  },
};
