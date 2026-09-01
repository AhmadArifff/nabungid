import { Request, Response, NextFunction } from 'express';
import { ProgramService } from '../services/program.service';

export class ProgramController {
  static async getActive(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProgramService.getActiveCycleAndPrograms();
      if (!result.isSuccess) {
        res.status(result.statusCode || 404).json({ success: false, message: result.error });
        return;
      }
      res.status(200).json({ success: true, data: result.data });
    } catch (error) {
      next(error);
    }
  }

  static async getCatalogPackages(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProgramService.getCatalogBundles();
      if (!result.isSuccess) {
        res.status(result.statusCode || 400).json({ success: false, message: result.error });
        return;
      }
      res.status(200).json({ success: true, data: result.data });
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProgramService.getProductCategories();
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
