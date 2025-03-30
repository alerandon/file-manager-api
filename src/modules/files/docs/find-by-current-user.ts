export const FindByCurrentUserDocs = {
  apiOperation: { summary: 'Get files of the current user' },
  apiResponseStatus200: {
    status: 200,
    description: 'List of files retrieved successfully.',
    schema: {
      example: {
        data: [
          {
            id: '3a71bedf-cf03-439e-a2f7-cc3ed2a811ad',
            name: 'picnic-day.jpeg',
            uploadLink:
              'https://my-upload-link.com/test@example.com--picnic-day.jpeg',
            createdAt: '2025-03-29T20:10:27.227Z',
            updatedAt: '2025-03-29T20:10:27.227Z',
          },
          {
            id: '6a193225-43ed-4a4b-bfef-3c49cf13ef24',
            name: 'my-essay.pdf',
            uploadLink:
              'https://my-upload-link.com/test@example.com--my-essay.pdf',
            createdAt: '2025-03-29T20:25:11.132Z',
            updatedAt: '2025-03-29T20:25:11.132Z',
          },
        ],
      },
    },
  },
  apiResponseStatus401: {
    status: 401,
    description: 'Unauthorized access.',
    schema: {
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    },
  },
};
