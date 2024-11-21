document.addEventListener('DOMContentLoaded', function () {
    const apiBaseURL = 'http://localhost:4000/doctors'; // Base API URL
    let currentDoctorId = null;
    
    loadDoctors();

    // Add Doctor Button
    document.getElementById('addDoctorBtn').addEventListener('click', function () {
        currentDoctorId = null;
        document.getElementById('doctorForm').reset();
        document.getElementById('modalTitle').textContent = "Add Doctor";
        document.getElementById('doctorModal').style.display = 'flex';
    });

    // Cancel Button
    document.getElementById('cancelBtn').addEventListener('click', function () {
        document.getElementById('doctorModal').style.display = 'none';
    });

    // Doctor Form Submit
    document.getElementById('doctorForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const doctorName = document.getElementById('doctorName').value.trim();
        const specialization = document.getElementById('specialization').value.trim();
        const doctorEmail = document.getElementById('doctorEmail').value.trim();

        if (!doctorName || !specialization || !doctorEmail) {
            alert('Please fill in all fields.');
            return;
        }

        const doctorData = { doctorName, specialization, doctorEmail };

        try {
            if (currentDoctorId) {
                // Update Doctor
                const response = await fetch(`http://localhost:4000/doctors/${currentDoctorId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(doctorData),
                });

                if (!response.ok) throw new Error('Failed to update doctor.');
                console.log(`Doctor ID ${currentDoctorId} updated successfully.`);
            } else {
                // Add New Doctor
                const response = await fetch("http://localhost:4000/doctors", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(doctorData),
                });

                if (!response.ok) throw new Error('Failed to add doctor.');
                console.log('New doctor added successfully.');
            }

            document.getElementById('doctorModal').style.display = 'none';
            loadDoctors();
        } catch (error) {
            console.error('Error saving doctor:', error);
            alert('Failed to save doctor. Please try again.');
        }
    });

    // Load Doctors List
    async function loadDoctors() {
        try {
            const response = await fetch("http://localhost:4000/doctors");
            if (!response.ok) throw new Error('Failed to fetch doctors.');
            const doctors = await response.json();

            const doctorsList = document.getElementById('doctorsList');
            doctorsList.innerHTML = ''; // Clear existing list

            doctors.forEach((doctor) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${doctor.doctorName}</td>
                    <td>${doctor.specialization}</td>
                    <td>${doctor.doctorEmail}</td>
                    <td>
                        <button class="edit-btn" data-id="${doctor.id}">Edit</button>
                        <button class="delete-btn" data-id="${doctor.id}">Delete</button>
                    </td>
                `;
                doctorsList.appendChild(row);
            });

            // Attach event listeners for edit and delete buttons
            attachEventListeners();
        } catch (error) {
            console.error('Error loading doctors:', error);
            alert('Failed to load doctors. Please try again.');
        }
    }

    // Attach event listeners to dynamically created buttons
    function attachEventListeners() {
        document.querySelectorAll('.edit-btn').forEach((button) => {
            button.addEventListener('click', function () {
                const doctorId = this.getAttribute('data-id');
                editDoctor(doctorId);
            });
        });

        document.querySelectorAll('.delete-btn').forEach((button) => {
            button.addEventListener('click', function () {
                const doctorId = this.getAttribute('data-id');
                deleteDoctor(doctorId);
            });
        });
    }

    // Edit Doctor
    async function editDoctor(id) {
        currentDoctorId = id;

        try {
            const response = await fetch(`http://localhost:4000/doctors/${id}`);
            if (!response.ok) throw new Error('Failed to fetch doctor details.');

            const doctor = await response.json();
            document.getElementById('doctorName').value = doctor.doctorName;
            document.getElementById('specialization').value = doctor.specialization;
            document.getElementById('doctorEmail').value = doctor.doctorEmail;
            document.getElementById('modalTitle').textContent = 'Edit Doctor';
            document.getElementById('doctorModal').style.display = 'flex';
        } catch (error) {
            console.error('Error fetching doctor details:', error);
            alert('Failed to load doctor details. Please try again.');
        }
    }

    // Delete Doctor
    async function deleteDoctor(id) {
        if (confirm('Are you sure you want to delete this doctor?')) {
            try {
                const response = await fetch(`http://localhost:4000/doctors/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete doctor.');

                console.log(`Doctor ID ${id} deleted successfully.`);
                loadDoctors();
            } catch (error) {
                console.error('Error deleting doctor:', error);
                alert('Failed to delete doctor. Please try again.');
            }
        }
    }
});
