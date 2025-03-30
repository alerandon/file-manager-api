export const LoginDocs = {
  apiOperation: { summary: 'Login a user' },
  apiBody: {
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
  },
  apiResponseStatus201: {
    status: 201,
    description: 'User successfully logged in.',
    schema: {
      example: {
        data: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: 1,
            email: 'user@example.com',
            password:
              '$argon2id$v=19$m=65536,t=3,p=4$hXuQfzruMD+KCa1HNjaVzw$731V/qizQMxlZ+KQReTYOtrTXjpDn2+nysnesCrVOfI',
            resetCode: null,
            resetCodeExpiration: null,
            provider: null,
            createdAt: '2025-03-28T03:21:18.502Z',
            updatedAt: '2025-03-29T17:02:02.422Z',
          },
        },
      },
    },
  },
  apiResponseStatus401: {
    status: 401,
    description: 'Invalid credentials.',
    schema: {
      example: {
        message: 'Las credenciales son invalidas',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  },
};
