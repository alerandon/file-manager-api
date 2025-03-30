export const RenameFileDocs = {
  apiOperation: { summary: 'Rename a file' },
  apiParam: { name: 'id', description: 'ID of the file to rename' },
  apiBody: {
    schema: { type: 'object', properties: { newName: { type: 'string' } } },
  },
  apiResponseStatus200: {
    status: 200,
    description: 'File renamed successfully.',
    schema: {
      example: {
        data: {
          id: '6a193225-43ed-4a4b-bfef-3c49cf13ef24',
          name: 'my-essay.pdf',
          uploadLink:
            'https://my-upload-link.com/test@example.com--my-essay.pdf',
          createdAt: '2025-03-29T20:25:11.132Z',
          updatedAt: '2025-03-29T20:25:11.132Z',
        },
      },
    },
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
