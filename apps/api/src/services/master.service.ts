import { prisma } from '../config/prisma.config';
import { Result } from '../utils/result.util';

export class MasterDataService {
  // Product Items CRUD
  static async createProductItem(data: {
    name: string;
    categoryId: string;
    unit: string;
    estimatedPrice: number;
    imageUrl?: string;
    description?: string;
  }) {
    const item = await prisma.productItem.create({
      data: {
        name: data.name,
        categoryId: data.categoryId,
        unit: data.unit,
        estimatedPrice: data.estimatedPrice,
        imageUrl: data.imageUrl,
        description: data.description,
      },
    });
    return Result.ok(item);
  }

  static async updateProductItem(id: string, data: Partial<{
    name: string;
    unit: string;
    estimatedPrice: number;
    imageUrl?: string;
    description?: string;
    isAvailable: boolean;
  }>) {
    const item = await prisma.productItem.update({
      where: { id },
      data,
    });
    return Result.ok(item);
  }

  static async deleteProductItem(id: string) {
    await prisma.productItem.delete({
      where: { id },
    });
    return Result.ok({ success: true, message: 'Item berhasil dihapus.' });
  }

  // Package Bundles CRUD
  static async createBundle(data: {
    name: string;
    slug: string;
    bundlePrice: number;
    description?: string;
    imageUrl?: string;
    itemIds?: { itemId: string; quantity: number }[];
  }) {
    const bundle = await prisma.packageBundle.create({
      data: {
        name: data.name,
        slug: data.slug,
        bundlePrice: data.bundlePrice,
        description: data.description,
        imageUrl: data.imageUrl,
        items: data.itemIds
          ? {
              create: data.itemIds.map((i) => ({
                itemId: i.itemId,
                quantity: i.quantity,
              })),
            }
          : undefined,
      },
    });
    return Result.ok(bundle);
  }

  static async deleteBundle(id: string) {
    await prisma.packageBundle.delete({
      where: { id },
    });
    return Result.ok({ success: true, message: 'Paket bundling berhasil dihapus.' });
  }

  // Savings Program CRUD
  static async createProgram(data: {
    cycleId: string;
    name: string;
    weeklyNominal: number;
    targetWeeks?: number;
    adminFee?: number;
    description?: string;
  }) {
    const program = await prisma.savingsProgram.create({
      data: {
        cycleId: data.cycleId,
        name: data.name,
        weeklyNominal: data.weeklyNominal,
        targetWeeks: data.targetWeeks || 50,
        adminFee: data.adminFee || 25000,
        description: data.description,
      },
    });
    return Result.ok(program);
  }
}
