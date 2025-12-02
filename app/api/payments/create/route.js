// Test API keys (replace with actual keys in production)
const KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_TEST_KEY_ID';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'YOUR_TEST_SECRET';

export async function POST(request) {
  try {
    const { amount, orderId } = await request.json();
    
    // In a real implementation, we would use the actual Razorpay SDK
    // For test mode, we'll simulate the API response
    const paymentOrder = {
      id: `order_${Date.now()}`,
      entity: "order",
      amount: amount * 100, // in paise
      amount_paid: 0,
      amount_due: amount * 100,
      currency: "INR",
      receipt: orderId,
      status: "created",
      created_at: Date.now()
    };
    
    return Response.json(paymentOrder);
  } catch (error) {
    console.error("Payment creation failed:", error);
    return Response.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}