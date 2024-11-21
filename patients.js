let currentPatientId = null;

document.addEventListener('DOMContentLoaded', function () {
    loadPatients();

    // Add Patient Button
    document.getElementById('addPatientBtn').addEventListener('click', function () {
        currentPatientId = null;
        document.getElementById('patientForm').reset();
        document.getElementById('modalTitle').textContent = "Add Patient";
        document.getElementById('patientModal').style.display = 'flex';
    });

    // Cancel Button
    document.getElementById('cancelBtn').addEventListener('click', function () {
        document.getElementById('patientModal').style.display = 'none';
    });

    // Patient Form Submit
    document.getElementById('patientForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const patientName = document.getElementById('patientName').value.trim();
        const age = parseInt(document.getElementById('age').value.trim());
        const gender = document.getElementById('gender').value.trim();
        const patientEmail = document.getElementById('patientEmail').value.trim();
        const phone = document.getElementById('phone').value.trim();

        // Validation
        if (!patientName || isNaN(age) || !gender || !patientEmail || !phone) {
            alert('Please fill in all fields correctly.');
            return;
        }

        const patientData = { patientName, age, gender, patientEmail, phone };

        try {
            if (currentPatientId) {
                // Update Patient
                const response = await fetch(`http://localhost:4000/patients/${currentPatientId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(patientData),
                });

                if (!response.ok) throw new Error('Failed to update patient.');
                console.log(`Patient ID ${currentPatientId} updated successfully.`);
            } else {
                // Add New Patient
                const response = await fetch('http://localhost:4000/patients', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(patientData),
                });

                if (!response.ok) throw new Error('Failed to add patient.');
                console.log('New patient added successfully.');
            }

            document.getElementById('patientModal').style.display = 'none';
            loadPatients();
        } catch (error) {
            console.error('Error saving patient:', error);
            alert('Failed to save patient. Please try again.');
        }
    });

    // Load Patients List
    async function loadPatients() {
        try {
            const response = await fetch('http://localhost:4000/patients');
            if (!response.ok) throw new Error('Failed to fetch patients.');

            const patients = await response.json();
            const patientsList = document.getElementById('patientsList');
            patientsList.innerHTML = ''; // Clear previous entries

            patients.forEach((patient) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${patient.patientName}</td>
                    <td>${patient.age}</td>
                    <td>${patient.gender}</td>
                    <td>${patient.patientEmail}</td>
                    <td>${patient.phone}</td>
                    <td>
                        <button class="edit-btn" data-id="${patient.id}">Edit</button>
                        <button class="delete-btn" data-id="${patient.id}">Delete</button>
                    </td>
                `;
                patientsList.appendChild(row);
            });

            // Attach event listeners to buttons
            attachEventListeners();
        } catch (error) {
            console.error('Error loading patients:', error);
            alert('Failed to load patients. Please try again.');
        }
    }

    // Attach event listeners to dynamically created buttons
    function attachEventListeners() {
        document.querySelectorAll('.edit-btn').forEach((button) => {
            button.addEventListener('click', function () {
                const patientId = this.getAttribute('data-id');
                editPatient(patientId);
            });
        });

        document.querySelectorAll('.delete-btn').forEach((button) => {
            button.addEventListener('click', function () {
                const patientId = this.getAttribute('data-id');
                deletePatient(patientId);
            });
        });
    }

    // Edit Patient
    async function editPatient(id) {
        currentPatientId = id;

        try {
            const response = await fetch(`http://localhost:4000/patients/${id}`);
            if (!response.ok) throw new Error('Failed to fetch patient details.');

            const patient = await response.json();
            document.getElementById('patientName').value = patient.patientName;
            document.getElementById('age').value = patient.age;
            document.getElementById('gender').value = patient.gender;
            document.getElementById('patientEmail').value = patient.patientEmail;
            document.getElementById('phone').value = patient.phone;
            document.getElementById('modalTitle').textContent = 'Edit Patient';
            document.getElementById('patientModal').style.display = 'flex';
        } catch (error) {
            console.error('Error fetching patient details:', error);
            alert('Failed to load patient details. Please try again.');
        }
    }

    // Delete Patient
    async function deletePatient(id) {
        if (confirm('Are you sure you want to delete this patient?')) {
            try {
                const response = await fetch(`http://localhost:4000/patients/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete patient.');

                console.log(`Patient ID ${id} deleted successfully.`);
                loadPatients();
            } catch (error) {
                console.error('Error deleting patient:', error);
                alert('Failed to delete patient. Please try again.');
            }
        }
    }
});
