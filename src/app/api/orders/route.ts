import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '../../../services/orderService';
import { Order, OrderLineItem } from '../../../types/order';

export async function GET(req: NextRequest) {
  try {
    const customerId = req.nextUrl.searchParams.get('customerId') || 'cust-eleanor-vance';
    const orders = await orderService.getByCustomerId(customerId);

    return NextResponse.json({
      success: true,
      customerId,
      totalOrders: orders.length,
      orders,
      isDemoData: true,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve customer orders' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerId = 'cust-eleanor-vance',
      customer,
      shippingAddress,
      deliveryMethod = 'standard',
      items,
      summary,
      paymentMethod,
    } = body;

    // Validate required fields
    if (!shippingAddress || !shippingAddress.streetLine1 || !shippingAddress.city || !shippingAddress.postalCode) {
      return NextResponse.json(
        { success: false, error: 'Valid shipping address required for overland dispatch.' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot create order with an empty provisions basket.' },
        { status: 400 }
      );
    }

    const orderNumber = `RH-${Math.floor(10000 + Math.random() * 90000)}`;
    const orderId = `ord-${Date.now()}`;

    const lineItems: OrderLineItem[] = items.map((i: any, idx: number) => ({
      id: `li-${idx}-${Date.now()}`,
      productId: i.productId || i.product?.id,
      productName: i.product?.name || i.productName || 'Pacific Northwest Provision',
      variantName: i.variant?.name || i.variantName,
      quantity: i.quantity || 1,
      unitPrice: i.discountedUnitPrice || i.unitPrice || 0,
      totalPrice: i.lineTotal || (i.unitPrice * i.quantity),
      isSubscription: i.purchaseType === 'subscription',
      cadence: i.subscriptionCadence,
      targetPetName: i.targetPetName,
    }));

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customerId,
      placedAt: new Date().toISOString(),
      status: 'pending',
      items: lineItems,
      subtotal: summary?.subtotal ?? summary?.productSubtotal ?? 0,
      discount: summary?.subscriptionSavings ? (summary.subscriptionSavings + (summary.promotionDiscount || 0)) : 0,
      shipping: summary?.estimatedShipping ?? 0,
      tax: summary?.estimatedTax ?? 0,
      total: summary?.total ?? 0,
      shippingAddress: {
        fullName: shippingAddress.fullName || `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim(),
        streetLine1: shippingAddress.streetLine1,
        streetLine2: shippingAddress.streetLine2 || '',
        city: shippingAddress.city,
        state: shippingAddress.state || 'OR',
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || 'United States',
        phone: shippingAddress.phone || customer?.phone || '',
      },
      carrier: deliveryMethod === 'express' ? 'FedEx Regional Priority' : 'USPS Overland Courier',
      isSubscriptionRenewal: false,
    };

    return NextResponse.json({
      success: true,
      status: 'received',
      orderId,
      orderNumber,
      order: newOrder,
      message: 'Order received and scheduled for small-batch pack & dispatch.',
      endpointArchitecture: 'POST /api/orders ready for production ERP / WMS fulfillment connection.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal order preparation error.' },
      { status: 500 }
    );
  }
}
