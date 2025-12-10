// public/patient.js

// Handle injury button selection
const injuryButtons = document.querySelectorAll('.injury-btn');
const injuryInput = document.getElementById('injury_type');

injuryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    injuryButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    injuryInput.value = btn.dataset.injury;
  });
});

// Create pain buttons 1–10
const painRow = document.getElementById('pain-row');
const painInput = document.getElementById('pain_level');

for (let i = 1; i <= 10; i++) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = i;
  btn.className = 'btn btn-secondary';
  btn.addEventListener('click', () => {
    const all = painRow.querySelectorAll('button');
    all.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    painInput.value = i;
  });
  painRow.appendChild(btn);
}

// Selected state style
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('selected')) {
    e.target.style.backgroundColor = '#83C5BE';
  }
});

// Submit form via fetch
const form = document.getElementById('patient-form');
const messageEl = document.getElementById('patient-message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!injuryInput.value || !painInput.value) {
    messageEl.textContent = 'Please select injury type and pain level.';
    return;
  }

  const data = {
    full_name: document.getElementById('full_name').value,
    card_number: document.getElementById('card_number').value,
    gender: document.getElementById('gender').value,
    date_of_birth: document.getElementById('dob').value || null,
    injury_type: injuryInput.value,
    pain_level: parseInt(painInput.value, 10)
  };

  try {
    const res = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      throw new Error('Failed to submit');
    }

    const patient = await res.json();
    messageEl.textContent =
      `Thanks, ${patient.full_name}. Your triage entry has been added. ` +
      `Please wait for the triage staff to update your status.`;
    form.reset();
    injuryInput.value = '';
    painInput.value = '';
    injuryButtons.forEach(b => b.classList.remove('selected'));
    painRow.querySelectorAll('button').forEach(b => {
      b.classList.remove('selected');
      b.style.backgroundColor = '#E9ECEF';
    });
  } catch (err) {
    console.error(err);
    messageEl.textContent = 'Something went wrong. Please tell the triage staff.';
  }
});
