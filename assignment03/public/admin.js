// public/admin.js

let patients = [];
let selectedPatientId = null;

// DOM elements
const loadBtn = document.getElementById('load-btn');
const tableBody = document.querySelector('#patients-table tbody');
const selectedInfo = document.getElementById('selected-info');
const prioritySelect = document.getElementById('priority-select');
const roomSelect = document.getElementById('room-select');
const updateBtn = document.getElementById('update-btn');
const removeBtn = document.getElementById('remove-btn');

// Load priorities + rooms for dropdowns
async function loadMeta() {
  const [prioRes, roomRes] = await Promise.all([
    fetch('/api/priorities'),
    fetch('/api/rooms')
  ]);

  const priorities = await prioRes.json();
  const rooms = await roomRes.json();

  prioritySelect.innerHTML = '<option value="">Set Priority</option>';
  priorities.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.priority_id;
    opt.textContent = `${p.label} (${p.approximate_time || '?'} min)`;
    opt.dataset.colour = p.ui_colour;
    prioritySelect.appendChild(opt);
  });

  roomSelect.innerHTML = '<option value="">Assign Room</option>';
  rooms.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r.room_id;
    opt.textContent = `${r.room_name} – ${r.doctor_assigned || 'No doctor'}`;
    roomSelect.appendChild(opt);
  });
}

// Render table
function renderTable() {
  tableBody.innerHTML = '';

  patients.forEach(p => {
    const tr = document.createElement('tr');

    const arrival = new Date(p.arrival_time);

    tr.innerHTML = `
      <td>${p.patient_id}</td>
      <td>${p.full_name}</td>
      <td>${p.injury_type}</td>
      <td>${p.pain_level}</td>
      <td>
        ${
          p.priority_label
            ? `<span class="priority-badge" style="background-color:${p.ui_colour || '#ADB5BD'}">
                 ${p.priority_label}
               </span>`
            : '<span class="helper">Unassigned</span>'
        }
      </td>
      <td>${p.room_name || '-'}</td>
      <td>${arrival.toLocaleString()}</td>
      <td><button class="btn btn-secondary btn-select" data-id="${p.patient_id}">Select</button></td>
    `;

    tableBody.appendChild(tr);
  });
}

// Load patients from API
async function loadPatients() {
  const res = await fetch('/api/patients');
  patients = await res.json();
  renderTable();
  selectedPatientId = null;
  selectedInfo.textContent = 'No patient selected.';
}

// Handle select buttons (event delegation)
tableBody.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-select')) {
    selectedPatientId = e.target.dataset.id;
    const patient = patients.find(p => p.patient_id == selectedPatientId);
    if (patient) {
      selectedInfo.textContent =
        `Selected: #${patient.patient_id} – ${patient.full_name} (${patient.injury_type}, pain ${patient.pain_level})`;
    }
  }
});

// Update selected patient
updateBtn.addEventListener('click', async () => {
  if (!selectedPatientId) {
    alert('Please select a patient first.');
    return;
  }

  const priority_id = prioritySelect.value || null;
  const room_id = roomSelect.value || null;

  if (!priority_id && !room_id) {
    alert('Choose a priority and/or a room to update.');
    return;
  }

  const res = await fetch(`/api/patients/${selectedPatientId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priority_id, room_id })
  });

  if (!res.ok) {
    alert('Update failed.');
    return;
  }

  await loadPatients();
});

// Remove selected patient
removeBtn.addEventListener('click', async () => {
  if (!selectedPatientId) {
    alert('Please select a patient first.');
    return;
  }

  if (!confirm('Remove this patient from the queue?')) return;

  const res = await fetch(`/api/patients/${selectedPatientId}`, {
    method: 'DELETE'
  });

  if (!res.ok) {
    alert('Failed to remove patient.');
    return;
  }

  await loadPatients();
});

// Initial setup
loadBtn.addEventListener('click', loadPatients);
loadMeta();
