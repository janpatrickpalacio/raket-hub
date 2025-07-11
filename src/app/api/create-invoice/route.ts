import { createClient } from '@/lib/supabase/server';
import { generateUUID } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { origin } = new URL(request.url);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { amount, description, service_id, customer_email } = await request.json();

    // 1. Check if service exists, return not found if not
    const { data: service } = await supabase
      .from('services')
      .select('*, raketero:users(id, first_name, last_name, avatar_url)')
      .eq('id', service_id)
      .single();

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // 2. Check if order already exists, return conflict if so
    const { data: existingOrder } = await supabase.from('orders').select().eq('service_id', service_id).single();

    if (existingOrder) {
      return NextResponse.json({ error: 'Order already exists' }, { status: 409 });
    }

    // 3. Create Xendit invoice
    const xenditSecretKey = process.env.XENDIT_SECRET_KEY;
    const newOrderId = generateUUID();

    const response = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(xenditSecretKey + ':').toString('base64'),
      },
      body: JSON.stringify({
        external_id: `rakethub-order-${service_id}-${Date.now()}`,
        amount: amount,
        description: description,
        currency: 'PHP',
        customer: {
          email: customer_email,
        },
        success_redirect_url: `${origin}/orders/submit-requirements/${newOrderId}?email=${encodeURIComponent(customer_email)}`,
        failure_redirect_url: `${origin}/order/failure?service_id=${service_id}`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create Xendit invoice.');
    }

    // 4. Insert a new order with the "Pending" status
    const { error } = await supabase
      .from('orders')
      .insert({
        id: newOrderId,
        kliyente_id: user.id,
        raketero_id: service.raketero.id,
        service_id: service.id,
        status: 'Pending',
        total_price: service.price,
        payment_gateway_invoice_id: data.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 5. Return the invoice URL to the frontend.
    return NextResponse.json({ invoiceUrl: data.invoice_url });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to create Xendit invoice.' },
      { status: 500 }
    );
  }
}
