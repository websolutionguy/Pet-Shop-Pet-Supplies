import { NextRequest, NextResponse } from 'next/server';
import { reorderService } from '../../../../services/reorderService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerId = 'cust-eleanor-vance', items, shippingAddress } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one item must be provided for reordering' },
        { status: 400 }
      );
    }

    const order = await reorderService.createReorderRequest({
      customerId,
      items,
      shippingAddress,
    });

    return NextResponse.json({
      success: true,
      order,
      message: 'Reorder successfully placed for prompt regional dispatch',
      isDemoData: true,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process reorder request' },
      { status: 500 }
    );
  }
}
