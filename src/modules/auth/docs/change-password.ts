import { ChangePasswordDto } from '../auth.dto';

export const ChangePasswordDocs = {
  apiOperation: { summary: 'Change user password' },
  apiBody: { type: ChangePasswordDto },
  apiResponseStatus200: {
    status: 200,
    description: 'Password successfully changed.',
  },
  apiResponseStatus401: {
    status: 401,
    description: 'Invalid or expired token.',
  },
};
