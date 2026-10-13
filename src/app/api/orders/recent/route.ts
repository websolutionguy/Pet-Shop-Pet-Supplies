import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '../../../../services/orderService';

export async function GET(req: NextRequest) {
  try {
    const customerId = req.nextUrl.searchParams.get('customerId') || 'cust-eleanor-vance';
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '5', 10);
    const recentOrders = await orderService.getRecentOrders(customerId, limit);

    return NextResponse.json({
      success: true,
      customerId,
      count: recentOrders.length,
      orders: recentOrders,
      isDemoData: true,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve recent orders' },
      { status: 500 }
    );
  }
}
