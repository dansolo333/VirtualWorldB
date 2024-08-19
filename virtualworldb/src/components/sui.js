// import { JsonRpcProvider, Connection, Ed25519Keypair, RawSigner } from '@mysten/sui.js';

// // Initialize provider and connection
// const connection = new Connection({
//   fullnode: "https://fullnode.devnet.sui.io:443",
//   faucet: "https://faucet.devnet.sui.io/gas"
// });

// const provider = new JsonRpcProvider(connection);

// export const connectWallet = async () => {
//   if (window.suiWallet) {
//     try {
//       const accounts = await window.suiWallet.requestAccounts();
//       return accounts[0];
//     } catch (error) {
//       console.error('Failed to connect wallet:', error);
//       return null;
//     }
//   } else {
//     alert("Sui Wallet not installed!");
//     return null;
//   }
// };

// export const sendSuiTransaction = async (recipient, amount) => {
//   try {
//     const keypair = Ed25519Keypair.generate();  // Replace with actual wallet integration
//     const signer = new RawSigner(keypair, provider);

//     const tx = {
//       kind: "transfer",
//       sender: keypair.getPublicKey(),
//       recipient: recipient,
//       amount: amount,
//     };

//     const response = await signer.signAndExecuteTransaction(tx);
//     console.log('Transaction successful:', response);
//   } catch (error) {
//     console.error('Transaction failed:', error);
//   }
// };
