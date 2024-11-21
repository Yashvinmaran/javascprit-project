const serverUrl = "http://localhost:4000";

function loginUser() {
  const email = document.getElementById("loginEmail").value;
  if (!email) return alert("Email is required!");

  fetch(`${serverUrl}/users?email=${email}`)
    .then((response) => response.json())
    .then((users) => {
      if (users.length > 0) {
        window.location.href = "dashboard.html";
      } else {
        alert("User not found.");
      }
    });
}
