const crypto = require('crypto');

class RazorpaySandboxService {
  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_clearimpact_sandbox';
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || 'clearimpact_sandbox_secret_key_demo';
    this.isSandbox = true;
  }

  getPublicKey() {
    return this.keyId;
  }

  async createOrder({ amount, currency = 'INR', receipt, notes = {} }) {
    // Amount in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(amount * 100);
    const mockOrderId = `order_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}`;

    return {
      id: mockOrderId,
      entity: 'order',
      amount: amountInPaise,
      amount_paid: 0,
      amount_due: amountInPaise,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      status: 'created',
      attempts: 0,
      notes: {
        ...notes,
        environment: 'RAZORPAY_TEST_SANDBOX',
      },
      created_at: Math.floor(Date.now() / 1000),
    };
  }

  verifyPaymentSignature({ orderId, paymentId, signature }) {
    if (!orderId || !paymentId) return false;

    // In sandbox test mode, if test signature format is passed, accept test simulation
    if (signature && signature.startsWith('mock_sig_')) {
      return true;
    }

    try {
      const generatedSignature = crypto
        .createHmac('sha256', this.keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');
      return generatedSignature === signature || this.isSandbox;
    } catch (e) {
      return this.isSandbox;
    }
  }
}

module.exports = new RazorpaySandboxService();
