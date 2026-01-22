(() => {
  const form = document.getElementById('bookingForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const dateInput = document.getElementById('date');
  const peopleInput = document.getElementById('people'); // Added this

  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);

  // Name input: letters and spaces only
  nameInput.addEventListener('input', () => {
    nameInput.value = nameInput.value.replace(/[^A-Za-z\s]/g, '');
  });

  // Phone input: digits only, max 10 digits
  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
  });

  // Form submit
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    // Name validation
    if (!/^[A-Za-z\s]+$/.test(nameInput.value.trim())) {
      valid = false;
      nameInput.classList.add('is-invalid');
    } else {
      nameInput.classList.remove('is-invalid');
      nameInput.classList.add('is-valid');
    }

    // Email validation: only @gmail.com emails
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(emailInput.value.trim())) {
      valid = false;
      emailInput.classList.add('is-invalid');
    } else {
      emailInput.classList.remove('is-invalid');
      emailInput.classList.add('is-valid');
    }

    // Phone validation: exactly 10 digits
    if (!/^\d{10}$/.test(phoneInput.value.trim())) {
      valid = false;
      phoneInput.classList.add('is-invalid');
    } else {
      phoneInput.classList.remove('is-invalid');
      phoneInput.classList.add('is-valid');
    }

    // Date validation: must be today or future
    const selectedDate = new Date(dateInput.value);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    if (selectedDate < todayDate || !dateInput.value) {
      valid = false;
      dateInput.classList.add('is-invalid');
    } else {
      dateInput.classList.remove('is-invalid');
      dateInput.classList.add('is-valid');
    }

    // ✅ People validation
    if (!peopleInput.value || peopleInput.value === '0' || peopleInput.value === '') {
      valid = false;
      peopleInput.classList.add('is-invalid');
    } else {
      peopleInput.classList.remove('is-invalid');
      peopleInput.classList.add('is-valid');
    }

    // If invalid
    if (!valid) {
      form.classList.add('was-validated');
      return;
    }

    // Success message
    alert('🎉 Reservation Confirmed! Thank you for booking with Vintage Restaurant & Bar.');

    // Reset form and validation
    form.reset();
    form.classList.remove('was-validated');
    [nameInput, emailInput, phoneInput, dateInput, peopleInput].forEach(input =>
      input.classList.remove('is-valid')
    );
  });
})();
