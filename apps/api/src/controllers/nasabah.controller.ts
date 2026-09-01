import { Request, Response, NextFunction } from 'express';
import { NasabahService } from '../services/nasabah.service';

export class NasabahController {
  static async enroll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { programId, bundleId } = req.body;
      const result = await NasabahService.enrollProgram(userId, programId, bundleId);
      if (!result.isSuccess) {
        res.status(result.statusCode || 400).json({ success: false, message: result.error });
        return;
      }
      res.status(201).json({ success: true, data: result.data });
    } catch (error) {
      next(error);
    }
  }

  static async getMySavings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await NasabahService.getMySavings(userId);
      if (!result.isSuccess) {
        res.status(result.statusCode || 404).json({ success: false, message: result.error });
        return;
      }
      res.status(200).json({ success: true, data: result.data });
    } catch (error) {
      next(error);
    }
  }

  static async payWeek(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const savingId = req.params.id as string;
      const { weekNumber, proofImageUrl } = req.body;
      const result = await NasabahService.submitPaymentProof(
        userId,
        savingId,
        weekNumber,
        proofImageUrl
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

  static async selectBundle(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const savingId = req.params.id as string;
      const { bundleId } = req.body;
      const result = await NasabahService.selectBundle(userId, savingId, bundleId);
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
