document.getElementById('registerForm').addEventListener('submit', async function (e) {
      e.preventDefault();
  
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      try {
          const response = await fetch('http://localhost:4000/users');
          const users = await response.json();
  
          const userExists = users.some(u => u.email === email);
  
          if (userExists) {
              alert('Email already registered. Please use a different email.');
          } else {
              await fetch('http://localhost:4000/users', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name, email, password }),
              });
  
              alert('Registration successful! Redirecting to login...');
              window.location.href = 'login.html';
          }
      } catch (error) {
          console.error('Error during registration:', error);
      }
  });
  