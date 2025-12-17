import { Request, Response, NextFunction } from 'express';
import { paymentService } from '../services/paymentService';
import { AuthRequest } from '../types';
import { sendSuccess } from '../utils/response';

export class PaymentController {
  async createIntent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as AuthRequest).user;
      if (!user) {
        res.status(401).json({ success: false, error: 'Not authenticated' });
        return;
      }

      if (user.role === 'organizer') {
        res.status(403).json({ success: false, error: 'Organizers cannot book tickets' });
        return;
      }

      const { eventId, numberOfTickets } = req.body;
      const intent = await paymentService.createPaymentIntent(user.id, eventId, Number(numberOfTickets));
      sendSuccess(res, intent, 'Payment intent created');
    } catch (error) {
      next(error);
    }
  }
}

export const paymentController = new PaymentController();
