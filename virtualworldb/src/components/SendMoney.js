// import React, { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import './SendMoney.css';

// function SendMoney() {
//   const location = useLocation();
//   const query = new URLSearchParams(location.search);
//   const recipient = query.get('recipient');
//   const [amount, setAmount] = useState('');
//   const [error, setError] = useState(null);

//   const handleSendMoney = async () => {
//     try {
//       // Replace this URL with the actual endpoint for sending money
//       const response = await fetch('http://127.0.0.1:8000/sendmoney', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ recipient, amount })
//       });
//       const data = await response.json();
//       if (response.ok) {
//         alert('Money sent successfully!');
//       } else {
//         setError(data.detail);
//       }
//     } catch (error) {
//       setError('An error occurred.');
//     }
//   };

//   return (
//     <div className="send-money">
//       <h2>Send Money to {recipient}</h2>
//       <input
//         type="number"
//         placeholder="Amount"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//       />
//       <button onClick={handleSendMoney}>Send</button>
//       {error && <p className="error">{error}</p>}
//     </div>
//   );
// }

// export default SendMoney;



import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './SendMoney.css';

function SendMoney() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const recipient = query.get('recipient');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);

  const handleSendMoney = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/sendmoney', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient, amount })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Money sent successfully!');
      } else {
        setError(data.detail);
      }
    } catch (error) {
      setError('An error occurred.');
    }
  };

  return (
    <div className="send-money">
      <h2>Send Money to {recipient}</h2>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleSendMoney}>Send</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default SendMoney;
