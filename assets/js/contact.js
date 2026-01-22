const form = document.getElementById('contactForm');
const name = document.getElementById('name');
const email = document.getElementById('email');
const message = document.getElementById('message');

// Prevent numbers and special characters in Name
name.addEventListener('input', function() {
  this.value = this.value.replace(/[^A-Za-z\s]/g, '');
});

form.addEventListener('submit', function(event) {
  event.preventDefault(); // prevent default submission
  let isValid = true;

  // Name validation
  const nameRegex = /^[A-Za-z\s]{2,}$/;
  if (!nameRegex.test(name.value.trim())) {
    name.classList.add('is-invalid');
    isValid = false;
  } else {
    name.classList.remove('is-invalid');
    name.classList.add('is-valid');
  }

  // Email validation (must be Gmail)
  const emailValue = email.value.trim().toLowerCase();
  const emailRegex = /^[a-z0-9._%+-]+@gmail\.com$/;
  if (!emailRegex.test(emailValue)) {
    email.classList.add('is-invalid'); // shows the invalid-feedback text
    isValid = false;
  } else {
    email.classList.remove('is-invalid');
    email.classList.add('is-valid');
  }

  // Message is optional
  message.classList.remove('is-invalid');
  message.classList.add('is-valid');

  // Submit if all valid
  if (isValid) {
    alert("Form submitted successfully!");
    form.reset();
    name.classList.remove('is-valid');
    email.classList.remove('is-valid');
    message.classList.remove('is-valid');
  }
});
