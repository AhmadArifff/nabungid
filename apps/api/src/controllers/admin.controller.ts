import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';

export class AdminController {
  static async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getDashboardSummary();
      if (!result.isSuccess) {
        res.status(result.statusCode || 400).json({ success: false, message: result.error });
        return;
      }
      res.status(200).json({ success: true, data: result.data });
    } catch (error) {
      next(error);
    }
  }

  static async getPendingLedgers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getPendingLedgers();
      if (!result.isSuccess) {
        res.status(result.statusCode || 400).json({ success: false, message: result.error });
        return;
      }
      res.status(200).json({ success: true, data: result.data });
    } catch (error) {
      next(error);
    }
  }

  static async verifyLedger(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.user!.id;
      const ledgerId = req.params.id as string;
      const { approve, rejectionReason } = req.body;
      const result = await AdminService.verifyLedger(adminId, ledgerId, approve, rejectionReason);
      if (!result.isSuccess) {
        res.status(result.statusCode || 400).json({ success: false, message: result.error });
        return;
      }
      res.status(200).json({ success: true, data: result.data });
    } catch (error) {
      next(error);
    }
  }

  static async getPendingWithdrawals(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getPendingWithdrawals();
      if (!result.isSuccess) {
        res.status(result.statusCode || 400).json({ success: false, message: result.error });
        return;
      }
      res.status(200).json({ success: true, data: result.data });
    } catch (error) {
      next(error);
    }
  }

  static async decideWithdrawal(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.user!.id;
      const withdrawalId = req.params.id as string;
      const { approve, proofImageUrl, rejectionReason } = req.body;
      const result = await AdminService.decideWithdrawal(
        adminId,
        withdrawalId,
        approve,
        proofImageUrl,
        rejectionReason
      );
      if (!result.isSuccess) {
        res.status(result.statusCode || 400).json({ success: false, message: result.error });
        return;
      }
      res.status(200).json({ success: true, data: result.data });
    } catch (error) {
      next(error);
    }
  }

  static async getDistributionBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.calculateDistributionBatch();
      if (!result.isSuccess) {
        res.status(result.statusCode || 400).json({ success: false, message: result.error });
        return;
      }
      res.status(200).json({ success: true, data: result.data });
    } catch (error) {
      next(error);
    }
  }

  static async getAttendanceMatrix(req: Request, res: Response, next: NextFunction) {
    try {
      const cycleId = req.query.cycleId as string | undefined;
      const result = await AdminService.getAttendanceMatrix(cycleId);
      if (!result.isSuccess) {
        res.status(result.statusCode || 400).json({ success: false, message: result.error });
        return;
      }
      res.status(200).json({ success: true, data: result.data });
    } catch (error) {
      next(error);
    }
  }

  static async quickCashCheckin(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.user!.id;
      const { memberSavingId, weekNumber } = req.body;
      if (!memberSavingId || !weekNumber) {
        res.status(400).json({ success: false, message: 'memberSavingId dan weekNumber wajib diisi.' });
        return;
      }
      const result = await AdminService.quickCashCheckin(adminId, memberSavingId, Number(weekNumber));
      if (!result.isSuccess) {
        res.status(result.statusCode || 400).json({ success: false, message: result.error });
        return;
      }
      res.status(200).json({ success: true, data: result.data });
    } catch (error) {
      next(error);
    }
  }

  static async triggerWhatsAppReminder(req: Request, res: Response, next: NextFunction) {
    try {
      const { memberSavingId, weekNumber } = req.body;
      if (!memberSavingId || !weekNumber) {
        res.status(400).json({ success: false, message: 'memberSavingId dan weekNumber wajib diisi.' });
        return;
      }
      const result = await AdminService.triggerWhatsAppReminder(memberSavingId, Number(weekNumber));
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
