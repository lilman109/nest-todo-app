import { AuthenticatedUser } from '../auth/types/jwt-payload.type';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};