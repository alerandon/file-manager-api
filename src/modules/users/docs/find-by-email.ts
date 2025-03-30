export const FindByEmailDocs = {
  apiOperation: { summary: 'Find a user by email' },
  apiParam: { name: 'email', description: 'Email of the user to retrieve' },
  apiResponseStatus200: {
    status: 200,
    description: 'User retrieved successfully.',
    schema: {
      example: {
        data: {
          id: '816e688e-294d-4806-af37-edca1c5a20b0',
          email: 'test1@example.com',
          password:
            '$argon2id$v=19$m=65536,t=3,p=4$N9bzXtYdTQTSFk9f9lcJ3Q$ygAZQ1Xj+gynFg9uOtYhTBVxRqK61lz89b/kKkDACx8',
          resetCode: '908435',
          resetCodeExpiration: '2025-03-30T06:49:15.412Z',
          provider: null,
          createdAt: '2025-03-28T03:33:59.260Z',
          updatedAt: '2025-03-30T06:39:15.423Z',
        },
      },
    },
  },
  apiResponseStatus404: {
    status: 404,
    description: 'User not found.',
    schema: {
      example: {
        message: 'User with email test22@example.com not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  },
};
