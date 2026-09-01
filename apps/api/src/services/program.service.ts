import { prisma } from '../config/prisma.config';
import { Result } from '../utils/result.util';
import { SavingsProgram, PackageBundle, ProductCategory, ProductItem } from '@nabungid/shared';

export class ProgramService {
  static async getActiveCycleAndPrograms() {
    const activeCycle = await prisma.savingsCycle.findFirst({
      where: { isActive: true, isClosed: false },
      include: {
        programs: {
          where: { isActive: true },
        },
      },
    });

    if (!activeCycle) {
      return Result.fail('Tidak ada siklus tabungan aktif saat ini.', 404);
    }

    const mappedPrograms: SavingsProgram[] = activeCycle.programs.map((p) => ({
      id: p.id,
      cycleId: p.cycleId,
      name: p.name,
      weeklyNominal: Number(p.weeklyNominal),
      targetWeeks: p.targetWeeks,
      adminFee: Number(p.adminFee),
      description: p.description || undefined,
      isActive: p.isActive,
    }));

    return Result.ok({
      cycle: {
        id: activeCycle.id,
        name: activeCycle.name,
        hijriYear: activeCycle.hijriYear,
        startDate: activeCycle.startDate.toISOString(),
        endDate: activeCycle.endDate.toISOString(),
        totalWeeks: activeCycle.totalWeeks,
        isActive: activeCycle.isActive,
      },
      programs: mappedPrograms,
    });
  }

  static async getCatalogBundles() {
    const bundles = await prisma.packageBundle.findMany({
      where: { isActive: true },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    const mappedBundles: PackageBundle[] = bundles.map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      description: b.description || undefined,
      bundlePrice: Number(b.bundlePrice),
      imageUrl: b.imageUrl || undefined,
      isActive: b.isActive,
      items: b.items.map((bi) => ({
        id: bi.id,
        bundleId: bi.bundleId,
        itemId: bi.itemId,
        quantity: bi.quantity,
        item: {
          id: bi.item.id,
          categoryId: bi.item.categoryId,
          name: bi.item.name,
          unit: bi.item.unit,
          estimatedPrice: Number(bi.item.estimatedPrice),
          imageUrl: bi.item.imageUrl || undefined,
          isAvailable: bi.item.isAvailable,
        },
      })),
    }));

    return Result.ok(mappedBundles);
  }

  static async getProductCategories() {
    const categories = await prisma.productCategory.findMany({
      include: {
        items: {
          where: { isAvailable: true },
        },
      },
    });

    return Result.ok(categories);
  }
}
