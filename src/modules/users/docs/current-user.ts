export const CurrentUserDocs = {
  apiOperation: { summary: 'Get the current authenticated user' },
  apiResponseStatus200: {
    status: 200,
    description: 'Current user retrieved successfully.',
    schema: {
      example: {
        data: {
          id: '2ce50209-5dd2-4e19-bd9d-0c910c50cc16',
          email: 'test2@example.com',
          password:
            '$argon2id$v=19$m=65536,t=3,p=4$e9xICJuLqE+829nblrUR3g$PfPdagYrTHrY6+kQkiN81ebN4soKsraBx6H2PxpLPZQ',
          resetCode: null,
          resetCodeExpiration: null,
          provider: null,
          createdAt: '2025-03-30T06:05:08.344Z',
          updatedAt: '2025-03-30T06:05:08.344Z',
        },
      },
    },
  },
};
