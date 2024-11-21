document.getElementById('loginForm').addEventListener('submit', async function (e) {
      e.preventDefault();
  
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      try {
          const response = await fetch('http://localhost:4000/users');
          const users = await response.json();
  
          const user = users.find(u => u.email === email && u.password === password);
  
          if (user) {
              alert('Login successful!');
              window.location.href = 'dashboard.html';
          } else {
              alert('Invalid email or password. Please try again.');
          }
      } catch (error) {
          console.error('Error during login:', error);
      }
  });
  