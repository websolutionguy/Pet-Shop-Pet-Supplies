import { NextRequest, NextResponse } from 'next/server';
import { reorderService } from '../../../../services/reorderService';

export async function GET(req: NextRequest) {
  try {
    const customerId = req.nextUrl.searchParams.get('customerId') || 'cust-eleanor-vance';
    const [products, frequentItems, config] = await Promise.all([
      reorderService.getReorderableProducts(),
      reorderService.getFrequentlyPurchasedItems(customerId),
      reorderService.getReorderConfig(),
    ]);

    return NextResponse.json({
      success: true,
      customerId,
      frequentlyPurchased: frequentItems,
      reorderableProducts: products,
      config,
      isDemoData: true,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve reorderable products' },
      { status: 500 }
    );
  }
}
