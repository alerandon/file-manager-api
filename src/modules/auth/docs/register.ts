import { RegisterDto } from '../auth.dto';

export const RegisterDocs = {
  apiOperation: { summary: 'Register a new user' },
  apiBody: { type: RegisterDto },
  apiResponseStatus200: {
    status: 200,
    description: 'Redirect to Google login page.',
  },
  apiResponseStatus400: {
    status: 400,
    description: 'Invalid registration data.',
  },
};
