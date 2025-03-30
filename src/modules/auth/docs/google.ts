export const GoogleDocs = {
  apiOperation: { summary: 'Initiate Google OAuth login' },
  apiResponseStatus200: {
    status: 200,
    description: 'Redirect to Google login page.',
  },
};

export const GoogleRedirectDocs = {
  apiOperation: { summary: 'Handle Google OAuth redirect' },
  apiResponseStatus200: {
    status: 200,
    description: 'User successfully authenticated via Google.',
  },
  apiResponseStatus401: {
    status: 401,
    description: 'Google authentication failed.',
  },
};
