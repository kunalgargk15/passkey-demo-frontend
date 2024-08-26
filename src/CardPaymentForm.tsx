import React, { useState } from 'react';
import './CardPaymentForm.css';

const CardPaymentForm: React.FC = ({createPasskey, verifyPasskey}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  return (
    <div className="container">
    <div className="payment-container">
      <div className="header">
        <div className="logo">A</div>
        <div className="company-info">
          <h2>Acme Corp</h2>
          <span className="trusted">Razorpay Trusted Business</span>
        </div>
      </div>

      <div className="card-form">
        <h3>Add New Card</h3>

        <div className="input-row">
          <div className="input-group">
            <label>Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="4111 1111 1111 1111"
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label>Expiry</label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="MM / YY"
              className="input-field"
            />
          </div>
        </div>

        <div className="input-row">
          <div className="input-group">
            <label>Card Holder's name</label>
            <input
              type="text"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
              placeholder="Kunal Garg"
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label>CVV</label>
            <input
              type="password"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="•••"
              className="input-field"
            />
          </div>
        </div>

        <div className="checkbox-container">
          <input
            type="checkbox"
            checked={saveCard}
            onChange={(e) => setSaveCard(e.target.checked)}
          />
          <label>Save card securely for future payments</label>
        </div>
      <div className='button-container'></div>
        <button className="pay-button" onClick={createPasskey}>
          Register
        </button>
        <button className="pay-button" onClick={verifyPasskey}>
          Verify
        </button>
      </div>

      {/* <div className="footer">
        <p>₹ 6,000</p>
        <span>View Details</span>
      </div> */}
    </div>
    </div>
  );
};

export default CardPaymentForm;
