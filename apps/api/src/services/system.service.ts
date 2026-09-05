import { prisma } from '../config/prisma.config';
import { Result } from '../utils/result.util';
import { logger } from '../utils/logger.util';
import { MaintenanceConfig } from '@nabungid/shared';

const SETTING_KEY_MAINTENANCE = 'MAINTENANCE_MODE';

let cachedMaintenance: {
  config: MaintenanceConfig;
  expiry: number;
} | null = null;

const DEFAULT_MAINTENANCE_CONFIG: MaintenanceConfig = {
  isMaintenance: false,
  message: 'Aplikasi sedang dalam pemeliharaan sistem berkala untuk peningkatan performa server menyambut Idul Fitri.',
  estimatedEndTime: 'Segera kembali dalam beberapa saat',
  contactWhatsapp: '089988776655',
  updatedAt: new Date().toISOString(),
};

export class SystemService {
  /**
   * Get public or internal maintenance configuration (with short in-memory caching)
   */
  static async getMaintenanceConfig(): Promise<MaintenanceConfig> {
    const now = Date.now();
    if (cachedMaintenance && cachedMaintenance.expiry > now) {
      return cachedMaintenance.config;
    }

    try {
      const setting = await prisma.systemSetting.findUnique({
        where: { key: SETTING_KEY_MAINTENANCE },
      });

      if (!setting) {
        cachedMaintenance = {
          config: DEFAULT_MAINTENANCE_CONFIG,
          expiry: now + 5000, // 5s TTL
        };
        return DEFAULT_MAINTENANCE_CONFIG;
      }

      const parsed: MaintenanceConfig = JSON.parse(setting.value);
      cachedMaintenance = {
        config: parsed,
        expiry: now + 5000, // 5s TTL
      };
      return parsed;
    } catch (error: any) {
      logger.warn(`Failed to fetch system setting ${SETTING_KEY_MAINTENANCE}, using fallback: ${error?.message}`);
      return DEFAULT_MAINTENANCE_CONFIG;
    }
  }

  /**
   * Update maintenance configuration (Admin only)
   */
  static async updateMaintenanceConfig(adminId: string, input: MaintenanceConfig) {
    try {
      const nowIso = new Date().toISOString();
      const updatedConfig: MaintenanceConfig = {
        isMaintenance: input.isMaintenance,
        message: input.message.trim(),
        estimatedEndTime: input.estimatedEndTime ? input.estimatedEndTime.trim() : null,
        contactWhatsapp: input.contactWhatsapp ? input.contactWhatsapp.trim() : '089988776655',
        updatedAt: nowIso,
        updatedBy: adminId,
      };

      const valueJson = JSON.stringify(updatedConfig);

      await prisma.systemSetting.upsert({
        where: { key: SETTING_KEY_MAINTENANCE },
        create: {
          key: SETTING_KEY_MAINTENANCE,
          value: valueJson,
          description: 'Pengaturan mode pemeliharaan aplikasi (Maintenance Mode)',
          updatedById: adminId,
        },
        update: {
          value: valueJson,
          updatedById: adminId,
        },
      });

      // Record audit log
      try {
        await prisma.adminAuditLog.create({
          data: {
            adminId,
            action: input.isMaintenance ? 'ENABLE_MAINTENANCE_MODE' : 'DISABLE_MAINTENANCE_MODE',
            entityName: 'SystemSetting',
            entityId: SETTING_KEY_MAINTENANCE,
            newValues: updatedConfig as any,
          },
        });
      } catch (auditErr) {
        logger.warn('Failed to create audit log for maintenance update:', auditErr);
      }

      // Reset cache immediately
      cachedMaintenance = {
        config: updatedConfig,
        expiry: Date.now() + 5000,
      };

      return Result.ok(updatedConfig);
    } catch (error: any) {
      logger.error('Error updating maintenance mode:', error);
      return Result.fail('Gagal memperbarui mode pemeliharaan sistem.', 500);
    }
  }
}
