import { Request, Response } from 'express';
import { SystemService } from '../services/system.service';

export class SystemController {
  static async getPublicStatus(req: Request, res: Response): Promise<void> {
    const config = await SystemService.getMaintenanceConfig();
    res.status(200).json({
      success: true,
      data: config,
    });
  }

  static async getMaintenanceDetails(req: Request, res: Response): Promise<void> {
    const config = await SystemService.getMaintenanceConfig();
    res.status(200).json({
      success: true,
      data: config,
    });
  }

  static async updateMaintenance(req: Request, res: Response): Promise<void> {
    const adminId = (req as any).user.id;
    const result = await SystemService.updateMaintenanceConfig(adminId, req.body);

    if (!result.isSuccess) {
      res.status(result.statusCode || 400).json({
        success: false,
        message: result.error,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: req.body.isMaintenance
        ? 'Mode Pemeliharaan (Maintenance Mode) BERHASIL DIAKTIFKAN. Nasabah kini diblokir dari akses aplikasi.'
        : 'Mode Pemeliharaan (Maintenance Mode) BERHASIL DINONAKTIFKAN. Aplikasi kembali beroperasi normal.',
      data: result.data,
    });
  }
}
