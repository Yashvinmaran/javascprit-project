let currentAppointmentId = null;

document.addEventListener('DOMContentLoaded', function () {
    loadAppointments();
    loadPatients();
    loadDoctors();

    // Add Appointment Button
    document.getElementById('addAppointmentBtn').addEventListener('click', function () {
        currentAppointmentId = null;
        document.getElementById('appointmentForm').reset();
        document.getElementById('modalTitle').textContent = "Add Appointment";
        document.getElementById('appointmentModal').style.display = 'flex';
    });

    // Cancel Button
    document.getElementById('cancelAppointmentBtn').addEventListener('click', function () {
        document.getElementById('appointmentModal').style.display = 'none';
    });

    // Appointment Form Submit
    document.getElementById('appointmentForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const patientId = document.getElementById('patientId').value.trim();
        const doctorId = document.getElementById('doctorId').value.trim();
        const appointmentDate = document.getElementById('appointmentDate').value.trim();
        const appointmentTime = document.getElementById('appointmentTime').value.trim();
        const status = document.getElementById('status').value.trim();

        // Validation
        if (!patientId || !doctorId || !appointmentDate || !appointmentTime || !status) {
            alert('All fields are required. Please fill out the form completely.');
            return;
        }

        const appointmentData = { patientId, doctorId, appointmentDate, appointmentTime, status };

        try {
            if (currentAppointmentId) {
                // Update Appointment
                const response = await fetch(`http://localhost:4000/appointments/${currentAppointmentId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(appointmentData),
                });
                if (!response.ok) throw new Error('Failed to update the appointment.');
                console.log(`Appointment ID ${currentAppointmentId} updated successfully.`);
            } else {
                // Add New Appointment
                const response = await fetch('http://localhost:4000/appointments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(appointmentData),
                });
                if (!response.ok) throw new Error('Failed to add a new appointment.');
                console.log('New appointment added successfully.');
            }

            document.getElementById('appointmentModal').style.display = 'none';
            loadAppointments();
        } catch (error) {
            console.error('Error saving appointment:', error);
            alert('An error occurred while saving the appointment. Please try again.');
        }
    });

    // Load Appointments List
    async function loadAppointments() {
        try {
            const response = await fetch('http://localhost:4000/appointments');
            if (!response.ok) throw new Error('Failed to fetch appointments.');

            const appointments = await response.json();
            const appointmentsList = document.getElementById('appointmentsList');
            appointmentsList.innerHTML = ''; // Clear previous entries

            appointments.forEach((appointment) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${appointment.patientId}</td>
                    <td>${appointment.doctorId}</td>
                    <td>${appointment.appointmentDate}</td>
                    <td>${appointment.appointmentTime}</td>
                    <td>${appointment.status}</td>
                    <td>
                        <button class="edit-btn" data-id="${appointment.id}">Edit</button>
                        <button class="delete-btn" data-id="${appointment.id}">Delete</button>
                    </td>
                `;
                appointmentsList.appendChild(row);
            });

            // Attach event listeners to buttons
            attachEventListeners();
        } catch (error) {
            console.error('Error loading appointments:', error);
            alert('Failed to load appointments. Please try again.');
        }
    }

    // Load Patients
    async function loadPatients() {
        try {
            const response = await fetch('http://localhost:4000/patients');
            if (!response.ok) throw new Error('Failed to fetch patients.');

            const patients = await response.json();
            const patientSelect = document.getElementById('patientId');
            patientSelect.innerHTML = '<option value="">Select Patient</option>'; // Clear previous options

            patients.forEach((patient) => {
                const option = document.createElement('option');
                option.value = patient.id;
                option.textContent = patient.patientName;
                patientSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading patients:', error);
            alert('Failed to load patients. Please try again.');
        }
    }

    // Load Doctors
    async function loadDoctors() {
        try {
            const response = await fetch('http://localhost:4000/doctors');
            if (!response.ok) throw new Error('Failed to fetch doctors.');

            const doctors = await response.json();
            const doctorSelect = document.getElementById('doctorId');
            doctorSelect.innerHTML = '<option value="">Select Doctor</option>'; // Clear previous options

            doctors.forEach((doctor) => {
                const option = document.createElement('option');
                option.value = doctor.id;
                option.textContent = doctor.doctorName;
                doctorSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading doctors:', error);
            alert('Failed to load doctors. Please try again.');
        }
    }

    // Attach event listeners to dynamically created buttons
    function attachEventListeners() {
        document.querySelectorAll('.edit-btn').forEach((button) => {
            button.addEventListener('click', function () {
                const appointmentId = this.getAttribute('data-id');
                editAppointment(appointmentId);
            });
        });

        document.querySelectorAll('.delete-btn').forEach((button) => {
            button.addEventListener('click', function () {
                const appointmentId = this.getAttribute('data-id');
                deleteAppointment(appointmentId);
            });
        });
    }

    // Edit Appointment
    async function editAppointment(id) {
        currentAppointmentId = id;

        try {
            const response = await fetch(`http://localhost:4000/appointments/${id}`);
            if (!response.ok) throw new Error('Failed to fetch appointment details.');

            const appointment = await response.json();
            document.getElementById('patientId').value = appointment.patientId;
            document.getElementById('doctorId').value = appointment.doctorId;
            document.getElementById('appointmentDate').value = appointment.appointmentDate;
            document.getElementById('appointmentTime').value = appointment.appointmentTime;
            document.getElementById('status').value = appointment.status;

            document.getElementById('modalTitle').textContent = "Edit Appointment";
            document.getElementById('appointmentModal').style.display = 'flex';
        } catch (error) {
            console.error('Error fetching appointment details:', error);
            alert('Failed to load appointment details. Please try again.');
        }
    }

    // Delete Appointment
    async function deleteAppointment(id) {
        if (confirm('Are you sure you want to delete this appointment?')) {
            try {
                const response = await fetch(`http://localhost:4000/appointments/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete appointment.');

                console.log(`Appointment ID ${id} deleted successfully.`);
                loadAppointments();
            } catch (error) {
                console.error('Error deleting appointment:', error);
                alert('Failed to delete appointment. Please try again.');
            }
        }
    }
});
