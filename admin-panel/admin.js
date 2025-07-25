
function handleLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "enre.atul" && password === "Honda988701@") {
    // Redirect to main admin dashboard
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("errorMsg").style.display = "block";
  }
}
