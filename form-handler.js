// Form submission handler for EZer website
// This will be called from feedback.html and report.html

async function handleFormSubmit(event, formType) {
  event.preventDefault();

  const form = event.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.innerHTML;

  // Show loading state
  submitButton.disabled = true;
  submitButton.innerHTML = '<span class="loading">Submitting...</span>';

  // Get form data
  const formData = {
    form_type: formType, // 'bug' or 'feedback'
    name: form.querySelector('#name').value,
    email: form.querySelector('#email').value,
    category: form.querySelector('#category')?.value || 'General',
    message: form.querySelector('#message')?.value || form.querySelector('#description')?.value
  };

  try {
    // Send to Cloudflare Worker endpoint
    const response = await fetch('https://ezer-forms.YOUR-SUBDOMAIN.workers.dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    if (response.ok || response.status === 204) {
      // Success! Show confirmation
      showSuccessMessage(form, formType);
      form.reset();
    } else {
      throw new Error('Submission failed');
    }
  } catch (error) {
    console.error('Error:', error);
    showErrorMessage(form);
  } finally {
    // Reset button
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  }
}

function showSuccessMessage(form, formType) {
  const message = formType === 'bug'
    ? 'Thank you! Your bug report has been submitted. You will receive an email confirmation shortly with a tracking number.'
    : 'Thank you! Your feedback has been submitted. You will receive an email confirmation shortly.';

  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.style.cssText = 'background: #10b981; color: white; padding: 1rem; border-radius: 8px; margin-top: 1rem; text-align: center;';
  successDiv.textContent = message;

  form.parentElement.insertBefore(successDiv, form.nextSibling);

  setTimeout(() => {
    successDiv.remove();
  }, 5000);
}

function showErrorMessage(form) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.style.cssText = 'background: #ef4444; color: white; padding: 1rem; border-radius: 8px; margin-top: 1rem; text-align: center;';
  errorDiv.textContent = 'Sorry, something went wrong. Please try again or email us directly at support@ezerapp.com';

  form.parentElement.insertBefore(errorDiv, form.nextSibling);

  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}
