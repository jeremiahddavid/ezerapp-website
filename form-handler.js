/**
 * Form Handler for EZer Feedback and Bug Report Forms
 * Handles client-side form submission to Cloudflare Worker
 */

// Cloudflare Worker URL for form submissions
const CLOUDFLARE_WORKER_URL = 'https://ezer-forms.jeremiahddavid.workers.dev';

/**
 * Handles form submission
 * @param {Event} event - The form submit event
 * @param {string} formType - Type of form: 'feedback' or 'bug'
 */
async function handleFormSubmit(event, formType) {
  event.preventDefault();

  const submitButton = event.target.querySelector('button[type="submit"]');
  const successMessage = document.getElementById('successMessage');
  const originalButtonText = submitButton.textContent;

  try {
    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    submitButton.classList.add('opacity-75', 'cursor-not-allowed');

    // Gather form data based on form type
    let formData;
    if (formType === 'feedback') {
      formData = {
        form_type: 'feedback',
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim(),
        category: 'General',
        timestamp: new Date().toISOString()
      };
    } else if (formType === 'bug') {
      const issueType = document.getElementById('issueType').value;
      const subject = document.getElementById('subject').value.trim();
      const description = document.getElementById('description').value.trim();
      const device = document.getElementById('device')?.value.trim() || 'Not specified';

      formData = {
        form_type: 'bug',
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        category: issueType,
        message: `**Subject:** ${subject}\n\n**Issue Type:** ${issueType}\n\n**Device:** ${device}\n\n**Description:**\n${description}`,
        timestamp: new Date().toISOString()
      };
    }

    // Validate data
    if (!formData.name || !formData.email || !formData.message) {
      throw new Error('Please fill in all required fields');
    }

    // Send to Cloudflare Worker
    const response = await fetch(CLOUDFLARE_WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      // Show success message
      successMessage.classList.remove('hidden');

      // Reset form
      event.target.reset();

      // Scroll to success message
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Hide success message after 10 seconds
      setTimeout(() => {
        successMessage.classList.add('hidden');
      }, 10000);

    } else {
      throw new Error(result.error || 'Submission failed');
    }

  } catch (error) {
    console.error('Form submission error:', error);

    // Show error message
    alert(`Failed to submit ${formType === 'bug' ? 'bug report' : 'feedback'}. Please try again or email us directly at support@ezerapp.com`);

  } finally {
    // Re-enable button
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
    submitButton.classList.remove('opacity-75', 'cursor-not-allowed');
  }
}

// Auto-fill device information if available (for bug reports)
window.addEventListener('DOMContentLoaded', () => {
  const deviceField = document.getElementById('device');
  if (deviceField && !deviceField.value) {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;

    // Try to extract device info from user agent
    let deviceInfo = platform;

    if (/Android/i.test(userAgent)) {
      const match = userAgent.match(/Android\s+([\d.]+)/);
      deviceInfo = match ? `Android ${match[1]}` : 'Android';
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      const match = userAgent.match(/OS\s+([\d_]+)/);
      const version = match ? match[1].replace(/_/g, '.') : '';
      deviceInfo = /iPad/i.test(userAgent) ? `iPad iOS ${version}` : `iPhone iOS ${version}`;
    }

    deviceField.placeholder = deviceInfo || 'e.g., Samsung Galaxy S21, Android 12';
  }
});
