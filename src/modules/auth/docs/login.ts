const loginApiResponseSchema = {
  example: {
    data: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        id: 1,
        email: 'user@example.com',
        name: 'John Doe',
      },
    },
  },
};

export const LoginDocs = {
  apiOperation: { summary: 'Login a user' },
  apiResponseStatus200: {
    status: 200,
    description: 'User successfully logged in.',
    schema: loginApiResponseSchema,
  },
  apiResponseStatus401: {
    status: 401,
    description: 'Invalid credentials.',
  },
  apiBody: {
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
  },
};
