import React, { useState } from 'react';
import { connectWallet, sendSuiTransaction } from './sui';  // Import utility functions

const SuiWallet = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleConnectWallet = async () => {
    const account = await connectWallet();  // Reusing the utility function
    if (account) setWalletAddress(account);
  };

  const handleSendSui = async () => {
    if (!recipient || !amount) {
      alert('Please enter a valid recipient and amount');
      return;
    }

    await sendSuiTransaction(recipient, amount);
  };

  return (
    <div>
      <button onClick={handleConnectWallet}>Connect Sui Wallet</button>
      {walletAddress && <p>Connected Wallet: {walletAddress}</p>}
      
      <input 
        type="text" 
        placeholder="Recipient Address" 
        value={recipient} 
        onChange={(e) => setRecipient(e.target.value)}
      />
      
      <input 
        type="number" 
        placeholder="Amount" 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)}
      />
      
      <button onClick={handleSendSui}>Send SUI</button>
    </div>
  );
};

export default SuiWallet;
