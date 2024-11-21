// Utility function to fetch data from the server
async function fetchData(url) {
      try {
          const response = await fetch(url);
          return await response.json();
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  }
  
  // Utility function to post data to the server
  async function postData(url, data) {
      try {
          const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
          });
          return await response.json();
      } catch (error) {
          console.error('Error posting data:', error);
      }
  }
  
  // Utility function to update data on the server
  async function updateData(url, data) {
      try {
          const response = await fetch(url, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
          });
          return await response.json();
      } catch (error) {
          console.error('Error updating data:', error);
      }
  }
  
  // Utility function to delete data from the server
  async function deleteData(url) {
      try {
          const response = await fetch(url, {
              method: 'DELETE',
          });
          return response.ok;
      } catch (error) {
          console.error('Error deleting data:', error);
      }
  }
  
  // Event listener for closing modals
  function closeModal(modalId) {
      document.getElementById(modalId).style.display = 'none';
  }
  
  // Event listener for showing modals
  function openModal(modalId) {
      document.getElementById(modalId).style.display = 'flex';
  }
  
  // Example function to handle form submissions for any page
  function handleFormSubmit(event, formId, dataUrl, method) {
      event.preventDefault();
      const formData = new FormData(document.getElementById(formId));
      const data = Object.fromEntries(formData.entries());
  
      let requestMethod;
      if (method === 'POST') {
          requestMethod = postData;
      } else if (method === 'PUT') {
          requestMethod = updateData;
      }
  
      requestMethod(dataUrl, data)
          .then(() => {
              closeModal('doctorModal');
              alert('Data saved successfully');
          })
          .catch(err => {
              console.error('Error saving data:', err);
          });
  }
  