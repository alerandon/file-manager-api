export const FindByIdDocs = {
  apiOperation: { summary: 'Get file by ID' },
  apiParam: { name: 'id', description: 'ID of the file to retrieve' },
  apiResponseStatus200: {
    status: 200,
    description: 'File retrieved successfully.',
    schema: {
      example: {
        data: {
          id: '6a193225-43ed-4a4b-bfef-3c49cf13ef24',
          name: 'picnic-day.jpeg',
          uploadLink:
            'https://my-upload-link.com/test@example.com--picnic-day.jpeg',
          createdAt: '2025-03-29T20:25:11.132Z',
          updatedAt: '2025-03-29T20:25:11.132Z',
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
