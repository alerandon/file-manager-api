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
    schema: {
      example: {
        data: {
          id: 'c3e8e9e9-278c-489c-b806-c7bc42f54572',
          name: 'texto-ejemplo-2.txt',
          uploadLink:
            'https://my-upload-link.com/test@example.com-texto-ejemplo-2.txt',
          createdAt: '2025-03-30T08:07:29.008Z',
          updatedAt: '2025-03-30T08:07:29.008Z',
        },
      },
    },
  },
  apiResponseStatus400: {
    status: 400,
    description: 'Invalid file upload request.',
  },
};
