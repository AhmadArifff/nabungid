import { Request, Response, NextFunction } from 'express';
import { MasterDataService } from '../services/master.service';

export class MasterController {
  static async createItem(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await MasterDataService.createProductItem(req.body);
      if (!result.isSuccess) {
        res.status(result.statusCode || 400).json({ success: false, message: result.error });
        return;
      }
      res.status(201).json({ success: true, data: result.data });
    } catch (error) {
      next(error);
    }
  }

  static async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const result = await MasterDataService.updateProductItem(id, req.body);
      if (!result.isSuccess) {
        res.status(result.statusCode || 400).json({ success: false, message: result.error });
        return;
      }
      res.status(200).json({ success: true, data: result.data });
    } catch (error) {
      next(error);
    }
  }

  static async deleteItem(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const result = await MasterDataService.deleteProductItem(id);
      if (!result.isSuccess) {
        res.status(result.statusCode || 400).json({ success: false, message: result.error });
        return;
      }
      res.status(200).json({ success: true, data: result.data });
    } catch (error) {
      next(error);
    }
  }

  static async createBundle(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await MasterDataService.createBundle(req.body);
      if (!result.isSuccess) {
        res.status(result.statusCode || 400).json({ success: false, message: result.error });
        return;
      }
      res.status(201).json({ success: true, data: result.data });
    } catch (error) {
      next(error);
    }
  }

  static async deleteBundle(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const result = await MasterDataService.deleteBundle(id);
      if (!result.isSuccess) {
        res.status(result.statusCode || 400).json({ success: false, message: result.error });
        return;
      }
      res.status(200).json({ success: true, data: result.data });
    } catch (error) {
      next(error);
    }
  }

  static async createProgram(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await MasterDataService.createProgram(req.body);
      if (!result.isSuccess) {
        res.status(result.statusCode || 400).json({ success: false, message: result.error });
        return;
      }
      res.status(201).json({ success: true, data: result.data });
    } catch (error) {
      next(error);
    }
  }
}
