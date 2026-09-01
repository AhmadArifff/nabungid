import { Request, Response, NextFunction } from 'express';
import { WithdrawalService } from '../services/withdrawal.service';

export class WithdrawalController {
  static async requestWithdrawal(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { memberSavingId, amount, reason } = req.body;
      const result = await WithdrawalService.requestWithdrawal(
        userId,
        memberSavingId,
        amount,
        reason
      );
      if (!result.isSuccess) {
        res.status(result.statusCode || 400).json({ success: false, message: result.error });
        return;
      }
      res.status(201).json({ success: true, data: result.data });
    } catch (error) {
      next(error);
    }
  }

  static async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await WithdrawalService.getWithdrawalStatus(userId);
      if (!result.isSuccess) {
        res.status(result.statusCode || 400).json({ success: false, message: result.error });
        return;
      }
      res.status(200).json({ success: true, data: result.data });
    } catch (error) {
      next(error);
    }
  }
}
