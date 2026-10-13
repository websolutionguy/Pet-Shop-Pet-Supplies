import { NextRequest, NextResponse } from 'next/server';
import { subscriptionService } from '../../../../services/subscriptionService';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const subscription = await subscriptionService.getById(id);

    if (!subscription) {
      // Check customer list
      const customerSubs = await subscriptionService.getByCustomerId('cust-eleanor-vance');
      const found = customerSubs.find((s) => s.id === id);

      if (found) {
        return NextResponse.json({
          success: true,
          subscription: found,
          isDemoData: true,
        });
      }

      return NextResponse.json(
        { success: false, error: `Subscription schedule "${id}" not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      subscription,
      isDemoData: true,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal error retrieving subscription schedule.' },
      { status: 500 }
    );
  }
}
