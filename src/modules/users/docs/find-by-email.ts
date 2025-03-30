export const FindByEmailDocs = {
  apiOperation: { summary: 'Find a user by email' },
  apiParam: { name: 'email', description: 'Email of the user to retrieve' },
  apiResponseStatus200: {
    status: 200,
    description: 'User retrieved successfully.',
  },
  apiResponseStatus404: {
    status: 404,
    description: 'User not found.',
  },
};
