import React, { useState } from 'react';
import { CreditCard, ShieldCheck, X, CheckCircle, Smartphone, Lock } from 'lucide-react';

const PaymentModal = ({
  isOpen,
  onClose,
  totalAmount,
  seatsCount,
  onConfirmPayment,
  loading = false,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('John Doe');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('123');
  const [upiId, setUpiId] = useState('demo.customer@okbank');

  if (!isOpen) return null;

  const handlePay = (e) => {
    e.preventDefault();
    onConfirmPayment({
      method: paymentMethod === 'card' ? 'Demo Visa Card' : 'UPI Demo Pay',
      cardLast4: paymentMethod === 'card' ? '4242' : '9901',
    });
  };

  const autofillTestCard = () => {
    setCardNumber('4242 •••• •••• 4242');
    setCardHolder('Demo Movie Goer');
    setExpiry('08/29');
    setCvv('789');
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1060 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-secondary modal-cinema" style={{ backgroundColor: '#141724' }}>
          <div className="modal-header border-secondary border-opacity-25 py-3">
            <div className="d-flex align-items-center gap-2">
              <Lock size={18} className="text-danger" />
              <h5 className="modal-title fw-bold text-light mb-0">Complete Payment</h5>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary text-light rounded-circle p-1"
              onClick={onClose}
              disabled={loading}
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handlePay}>
            <div className="modal-body p-4">
              {/* Order total header */}
              <div className="bg-dark rounded-3 p-3 mb-4 d-flex justify-content-between align-items-center border border-secondary border-opacity-25">
                <div>
                  <span className="text-secondary small d-block">Amount Due</span>
                  <span className="text-light small">{seatsCount} Ticket(s) Reserved</span>
                </div>
                <div className="fs-3 fw-bold text-danger">
                  ${totalAmount.toFixed(2)}
                </div>
              </div>

              {/* Demo Mode Notice Banner */}
              <div className="alert alert-info py-2 px-3 mb-4 small border-info border-opacity-50 bg-opacity-10 d-flex align-items-start gap-2">
                <ShieldCheck size={18} className="text-info flex-shrink-0 mt-1" />
                <div>
                  <strong>Simulated Demo Gateway:</strong> No real money will be charged. Click below to test instantaneous payment completion.
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="btn-group w-100 mb-4" role="group">
                <button
                  type="button"
                  className={`btn btn-sm ${paymentMethod === 'card' ? 'btn-danger' : 'btn-outline-secondary text-light'}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard size={15} className="me-1 inline" /> Credit / Debit Card
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${paymentMethod === 'upi' ? 'btn-danger' : 'btn-outline-secondary text-light'}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <Smartphone size={15} className="me-1 inline" /> UPI / QR Pay
                </button>
              </div>

              {paymentMethod === 'card' ? (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="text-secondary small">Card Information</label>
                    <button
                      type="button"
                      className="btn btn-link btn-sm text-info p-0 text-decoration-none small"
                      onClick={autofillTestCard}
                    >
                      Fill Test Card
                    </button>
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control form-control-dark"
                      placeholder="Card Number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <input
                        type="text"
                        className="form-control form-control-dark"
                        placeholder="MM / YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="password"
                        className="form-control form-control-dark"
                        placeholder="CVV"
                        value={cvv}
                        maxLength={4}
                        onChange={(e) => setCvv(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control form-control-dark"
                      placeholder="Cardholder Name"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="mb-3 text-center">
                  <p className="text-secondary small mb-3">
                    Enter virtual payment address for instant demo authorization:
                  </p>
                  <input
                    type="text"
                    className="form-control form-control-dark text-center mb-3"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                  />
                  <div className="p-3 bg-dark rounded border border-secondary border-opacity-25 d-inline-block">
                    <div className="small text-muted mb-1">Simulated QR Code</div>
                    <div className="bg-light p-2 rounded d-inline-block text-dark fw-bold font-monospace" style={{ fontSize: '0.8rem' }}>
                      [ SCAN TO PAY: ${totalAmount.toFixed(2)} ]
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer border-secondary border-opacity-25 py-3">
              <button
                type="button"
                className="btn btn-outline-secondary text-light btn-sm px-3"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-cinema btn-sm px-4 d-flex align-items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner-border spinner-border-sm" role="status"></div>
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    <span>Authorize & Pay ${totalAmount.toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
