import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShieldCheck, Lock, CreditCard, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../../api/client';
import { formatINR } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

export default function DonationModal({ campaign, isOpen, onClose, onDonationComplete }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState('SELECT'); // 'SELECT' | 'RAZORPAY_SANDBOX' | 'SUCCESS'
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !campaign) return null;

  const currentAmount = customAmount ? Number(customAmount) : amount;

  const handlePreset = (val) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleStartCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (currentAmount < 50) {
      setErrorMsg('Minimum donation amount is ₹50.');
      return;
    }

    setErrorMsg('');
    setIsProcessing(true);

    try {
      // 1. Create Razorpay Order
      const res = await api.post('/donations/create', {
        campaignId: campaign._id,
        amount: currentAmount,
      });

      // Advance to Razorpay Sandbox modal
      setStep('RAZORPAY_SANDBOX');
      setIsProcessing(false);
    } catch (err) {
      setIsProcessing(false);
      setErrorMsg(err.response?.data?.message || 'Failed to initialize payment gateway.');
    }
  };

  const handleSimulatePaymentSuccess = async () => {
    setIsProcessing(true);
    setErrorMsg('');

    try {
      const mockOrderId = 'order_rzp_mock_' + Math.floor(100000 + Math.random() * 900000);
      const mockPaymentId = 'pay_rzp_mock_' + Math.floor(100000 + Math.random() * 900000);
      const mockSig = 'mock_sig_sandbox_valid';

      const verifyRes = await api.post('/donations/verify', {
        orderId: mockOrderId,
        paymentId: mockPaymentId,
        signature: mockSig,
        campaignId: campaign._id,
        amount: currentAmount,
        isAnonymous,
      });

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // fallback if canvas not available
      }

      setSuccessData(verifyRes.data.donation);
      setStep('SUCCESS');
      if (onDonationComplete) {
        onDonationComplete(verifyRes.data);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Payment simulation failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-900 to-indigo-900 text-white p-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Milestone-Protected Donation</span>
            </div>
            <h3 className="text-lg font-bold text-white line-clamp-1">
              {campaign.title}
            </h3>
            <p className="text-xs text-indigo-200 mt-0.5">
              Organized by {campaign.ngoId?.orgName || 'Verified NGO'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-indigo-200 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
              {errorMsg}
            </div>
          )}

          {step === 'SELECT' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select Donation Amount (INR)
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[500, 1000, 2000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handlePreset(amt)}
                      className={`py-3 px-2 rounded-xl text-sm font-bold border transition text-center ${
                        amount === amt && !customAmount
                          ? 'border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                          : 'border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      {formatINR(amt)}
                    </button>
                  ))}
                </div>

                <div className="mt-3">
                  <div className="relative rounded-xl shadow-xs">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-semibold text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="Or enter custom amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setAmount(0);
                      }}
                      className="block w-full pl-8 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Escrow Guarantee Callout */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>How ClearImpact Safeguards Your {formatINR(currentAmount)}</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Funds are held in escrow. The NGO cannot withdraw your donation until physical photos, invoices, and completion evidence are verified and approved by administrators.
                </p>
                <div className="text-[10px] text-emerald-700 font-medium pt-1">
                  ✓ Eligible for 80G Tax Exemption Certificate
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonCheck"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <label htmlFor="anonCheck" className="text-xs text-slate-600">
                  Make my donation anonymous on public impact reports
                </label>
              </div>

              <button
                type="button"
                onClick={handleStartCheckout}
                disabled={isProcessing || currentAmount <= 0}
                className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition"
              >
                {isProcessing ? 'Connecting...' : `Proceed to Donate ${formatINR(currentAmount)}`}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'RAZORPAY_SANDBOX' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Razorpay Test / Sandbox Gateway</span>
                  </div>
                  <span className="text-[10px] bg-blue-200 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                    TEST MODE
                  </span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Safe test simulation environment for college lab demonstration. No real bank accounts or credit cards are charged.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Merchant:</span>
                  <span className="font-semibold text-slate-900">ClearImpact Foundation</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Campaign Earmark:</span>
                  <span className="font-semibold text-slate-900 line-clamp-1 max-w-[200px]">{campaign.title}</span>
                </div>
                <div className="flex justify-between text-slate-600 border-t pt-2">
                  <span className="font-bold text-slate-800">Amount Payable:</span>
                  <span className="font-bold text-slate-900 text-sm">{formatINR(currentAmount)}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-[11px] text-slate-600 border border-slate-200">
                <span className="font-semibold text-slate-800">Simulated Card:</span> 4111 2222 3333 4444 (Test VISA)
              </div>

              <button
                type="button"
                onClick={handleSimulatePaymentSuccess}
                disabled={isProcessing}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
              >
                {isProcessing ? 'Verifying Sandbox Payment...' : `Complete Test Payment (${formatINR(currentAmount)})`}
              </button>

              <button
                type="button"
                onClick={() => setStep('SELECT')}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800 py-1"
              >
                Cancel and return to options
              </button>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  Donation Successful!
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Your contribution of <strong className="text-emerald-700">{formatINR(currentAmount)}</strong> has been locked into milestone escrow.
                </p>
                <div className="text-[11px] font-mono text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg border">
                  Receipt: {successData?.taxReceiptNumber || '80G-VERIFIED'} • Earmark: Milestone 1
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-left text-xs space-y-1">
                <div className="font-semibold text-emerald-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  What happens next?
                </div>
                <p className="text-emerald-800 text-[11px] leading-relaxed">
                  As the NGO executes each milestone, you will receive timestamped evidence, automated risk score audits, and verified impact releases directly in your dashboard.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(`/donor/impact/${successData?._id}`);
                  }}
                  className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition"
                >
                  <span>Track Your Impact</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full text-center text-xs text-slate-500 hover:text-slate-800 py-1"
                >
                  Close & continue browsing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
