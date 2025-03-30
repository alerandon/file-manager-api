export const RegisterDocs = {
  apiOperation: { summary: 'Register a new user' },
  apiResponseStatus200: {
    status: 200,
    description: 'Redirect to Google login page.',
    schema: {
      example: {
        data: {
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJjZTUwMjA5LTVkZDItNGUxOS1iZDlkLTBjOTEwYzUwY2MxNiIsImVtYWlsIjoidGVzdDJAZXhhbXBsZS5jb20iLCJ0eXBlIjoiYXV0aCIsImlhdCI6MTc0MzMxNDcwOCwiZXhwIjoxNzQzMzI1NTA4fQ.zm97cLp1NUW45Cd-TOsS-KIlVmOPFn0AsKRg8Ffc_5s',
          user: {
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
  },
  apiResponseStatus409: {
    status: 409,
    description: 'Invalid Register.',
    schema: {
      example: {
        statusCode: 409,
        message:
          'The registration could not be completed. Please verify your data.',
      },
    },
  },
};
