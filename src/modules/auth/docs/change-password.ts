export const ChangePasswordDocs = {
  apiOperation: {
    summary:
      'Change user password. Requires a reset-password token from resetPassword route on Authorization',
  },
  apiResponseStatus201: {
    status: 201,
    description: 'Password successfully changed.',
    schema: {
      example: {
        data: { success: true },
      },
    },
  },
  apiResponseStatus404: {
    status: 404,
    description: 'User is not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
      },
    },
  },
};
