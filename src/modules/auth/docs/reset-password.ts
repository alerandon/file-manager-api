import { ResetPasswordDto } from '../auth.dto';

export const ResetPasswordDocs = {
  apiOperation: { summary: 'Request a password reset' },
  apiBody: { type: ResetPasswordDto },
  apiResponseStatus200: {
    status: 200,
    description: 'Password reset email sent.',
  },
  apiResponseStatus400: {
    status: 400,
    description: 'Invalid email address.',
  },
};
