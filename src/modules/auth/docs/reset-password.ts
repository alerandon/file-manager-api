export const ResetPasswordDocs = {
  apiOperation: { summary: 'Request a password reset' },
  apiResponseStatus201: {
    status: 201,
    description: 'Password reset email sent.',
    schema: {
      example: {
        data: {
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgxMzhiZjNiLTFmNGUtNGRhNy04NDFjLTZiNTU1NGJiZmRlOCIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInR5cGUiOiJyZXNldC1wYXNzd29yZCIsImlhdCI6MTc0MzMxNTkzMSwiZXhwIjoxNzQzMzI2NzMxfQ.AlRTEYd7R46YgL3Za_wYUTbCjny4cM3kokOepN4JONg',
          pinCode: '205525',
          timeExpiration: '2025-03-30T06:35:31.875Z',
        },
      },
    },
  },
  apiResponseStatus404: {
    status: 404,
    description: 'Invalid email address.',
    schema: {
      example: {
        statusCode: 404,
        message: 'The user with this email does not exist',
      },
    },
  },
};
