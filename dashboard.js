// Sidebar toggle functionality
document.getElementById('toggleSidebar').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');
});

document.getElementById('hamburgerMenu').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');
});

// Fetch all data (patients, doctors, and appointments)
async function fetchData() {
    const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
        fetch('http://localhost:4000/patients'),
        fetch('http://localhost:4000/doctors'),
        fetch('http://localhost:4000/appointments')
    ]);
    const patients = await patientsRes.json();
    const doctors = await doctorsRes.json();
    const appointments = await appointmentsRes.json();

    return { patients, doctors, appointments };
}

// Load and display recent appointments in the table
async function loadAppointments() {
    const { patients, doctors, appointments } = await fetchData();

    const tableBody = document.getElementById('appointmentsTable').querySelector('tbody');
    tableBody.innerHTML = '';

    appointments.forEach(appointment => {
        const patient = patients.find(p => p.id === appointment.patientId);
        const doctor = doctors.find(d => d.id === appointment.doctorId);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient ? patient.patientName : 'Unknown'}</td>
            <td>${doctor ? doctor.doctorName : 'Unknown'}</td>
            <td>${appointment.appointmentDate}</td>
            <td>${appointment.status}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Generate pie chart with appointment data
async function generateChart() {
    const { appointments } = await fetchData();

    // Dynamically count the number of appointments for each status
    const statusCounts = appointments.reduce(
        (acc, appointment) => {
            acc[appointment.status] = (acc[appointment.status] || 0) + 1;
            return acc;
        },
        {}
    );

    // Extract labels and data for the pie chart
    const chartLabels = Object.keys(statusCounts);
    const chartData = Object.values(statusCounts);

    const ctx = document.getElementById('appointmentsChart').getContext('2d');

    // Destroy any existing chart instance to avoid overlap
    if (window.appointmentsChartInstance) {
        window.appointmentsChartInstance.destroy();
    }

    // Create a new pie chart
    window.appointmentsChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: chartLabels,
            datasets: [
                {
                    label: 'Appointments',
                    data: chartData,
                    backgroundColor: ['#42a5f5', '#66bb6a', '#ef5350', '#ffa726'], // Add more colors if needed
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            const label = chartLabels[tooltipItem.dataIndex];
                            const count = chartData[tooltipItem.dataIndex];
                            return `${label}: ${count}`;
                        },
                    },
                },
            },
        },
    });
}

// Initialize the page and load the data
document.addEventListener('DOMContentLoaded', async function () {
    await loadAppointments();
    await generateChart();
});
