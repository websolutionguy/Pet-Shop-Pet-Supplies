import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '../../../../services/orderService';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await orderService.getById(id);

    if (!order) {
      // Also attempt lookup by orderNumber (e.g. RH-10948)
      const customerOrders = await orderService.getByCustomerId('cust-eleanor-vance');
      const foundByNumber = customerOrders.find(
        (o) => o.orderNumber.toLowerCase() === id.toLowerCase() || o.id === id
      );

      if (foundByNumber) {
        return NextResponse.json({
          success: true,
          order: foundByNumber,
          isDemoData: true,
        });
      }

      return NextResponse.json(
        { success: false, error: `Order with reference "${id}" not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
      isDemoData: true,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal error retrieving order record.' },
      { status: 500 }
    );
  }
}
