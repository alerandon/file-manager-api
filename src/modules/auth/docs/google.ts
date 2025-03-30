export const GoogleDocs = {
  apiOperation: {
    summary: 'Initiate Google OAuth login (Input this route on browser)',
  },
  apiResponseStatus200: {
    status: 200,
    description: 'Redirect to Google login page.',
  },
};

export const GoogleRedirectDocs = {
  apiOperation: {
    summary:
      'Handle Google OAuth redirect. This handles from root google route',
  },
  apiResponseStatus200: {
    status: 200,
    description: 'User successfully authenticated via Google.',
  },
  apiResponseStatus401: {
    status: 401,
    description: 'Google authentication failed.',
  },
};
