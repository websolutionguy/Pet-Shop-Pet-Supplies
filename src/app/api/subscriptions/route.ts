import { NextRequest, NextResponse } from 'next/server';
import { subscriptionService } from '../../../services/subscriptionService';

export async function GET(req: NextRequest) {
  try {
    const customerId = req.nextUrl.searchParams.get('customerId') || 'cust-eleanor-vance';
    const schedules = await subscriptionService.getByCustomerId(customerId);

    return NextResponse.json({
      success: true,
      customerId,
      subscriptions: schedules,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve recurring schedules' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerId = 'cust-eleanor-vance',
      subscriptionItems,
      shippingAddress,
      paymentMethodToken,
    } = body;

    if (!subscriptionItems || !Array.isArray(subscriptionItems) || subscriptionItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No subscription items provided for schedule registration.' },
        { status: 400 }
      );
    }

    const createdSchedules = subscriptionItems.map((item: any, index: number) => {
      const cadence = item.subscriptionCadence || item.cadence || '4-weeks';
      return {
        id: `sub-${Date.now()}-${index}`,
        customerId,
        productId: item.productId,
        productName: item.product?.name || item.productName || 'Auto-Ship Provision',
        cadence,
        status: 'active',
        nextOrderDate: item.nextExpectedDelivery || '2026-10-27',
        targetPetName: item.targetPetName,
        discountPercentage: 10,
        createdAt: new Date().toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      createdCount: createdSchedules.length,
      subscriptions: createdSchedules,
      message: 'Recurring auto-ship routine schedules registered successfully in demo state.',
      endpointArchitecture: 'POST /api/subscriptions ready for production subscription engine / cron runner.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to register subscription routines.' },
      { status: 500 }
    );
  }
}
