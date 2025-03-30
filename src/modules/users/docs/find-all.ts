export const FindAllDocs = {
  apiOperation: { summary: 'Get all users' },
  apiResponseStatus200: {
    status: 200,
    description: 'List of users retrieved successfully.',
    schema: {
      example: {
        data: [
          {
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
          {
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
        ],
      },
    },
  },
};
