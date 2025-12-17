import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { sendSuccess, sendError, sendCreated } from '../utils/response';
import { AuthRequest } from '../types';
import { OAuth2Client } from 'google-auth-library';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, firstName, lastName, role } = req.body;

      const result = await authService.register(
        email,
        password,
        firstName,
        lastName,
        role
      );

      sendCreated(res, result, 'User registered successfully');
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      sendSuccess(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as AuthRequest).user?.id;

      if (!userId) {
        sendError(res, 'User not authenticated', 401);
        return;
      }

      const user = await authService.getUserById(userId);

      if (!user) {
        sendError(res, 'User not found', 404);
        return;
      }

      sendSuccess(res, user, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async oauthLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        sendError(res, 'Missing idToken', 400);
        return;
      }

      const clientId = process.env.GOOGLE_CLIENT_ID;
      if (!clientId) {
        sendError(res, 'Google OAuth not configured', 500);
        return;
      }

      const oauthClient = new OAuth2Client(clientId);
      const ticket = await oauthClient.verifyIdToken({
        idToken,
        audience: clientId,
      });
      const payload = ticket.getPayload();

      if (!payload?.email || !payload?.given_name || !payload?.family_name) {
        sendError(res, 'Unable to verify Google token', 400);
        return;
      }

      if (payload.email_verified === false) {
        sendError(res, 'Google email not verified', 400);
        return;
      }

      const result = await authService.oauthLogin(
        payload.email,
        payload.given_name,
        payload.family_name
      );
      sendSuccess(res, result, 'OAuth login successful');
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
