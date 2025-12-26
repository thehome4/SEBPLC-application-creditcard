 document.addEventListener('DOMContentLoaded', function () {
            const form = document.getElementById('application-form');
            const successCard = document.getElementById('success-card');
            const errorMessage = document.getElementById('error-message');
            const errorText = document.getElementById('error-text');
            const loading = document.getElementById('loading');
            const submitButton = document.getElementById('submit-button');
            const phoneInput = document.getElementById('cellPhone');
            const phoneValidation = document.getElementById('phone-validation');
            const newApplicationBtn = document.getElementById('new-application-btn');

            // Phone number validation
            phoneInput.addEventListener('input', function () {
                const phonePattern = /^01[3-9]\d{8}$/;
                if (phonePattern.test(this.value)) {
                    phoneValidation.textContent = "Valid phone number";
                    phoneValidation.className = "phone-validation valid";
                } else {
                    phoneValidation.textContent = "Must be a valid 11-digit Bangladeshi mobile number starting with 01";
                    phoneValidation.className = "phone-validation invalid";
                }
            });

            // Form submission
            form.addEventListener('submit', async function (e) {
                e.preventDefault();

                // Validate all required fields
                const requiredFields = ['fullName', 'cellPhone', 'profession', 'organizationName', 'income', 'organizationAddress', 'division'];
                let isValid = true;

                requiredFields.forEach(field => {
                    const element = document.getElementById(field);
                    if (!element.value.trim()) {
                        isValid = false;
                        element.style.borderColor = 'var(--primary-color)';
                    } else {
                        element.style.borderColor = '';
                    }
                });

                // Validate phone number format
                const phonePattern = /^01[3-9]\d{8}$/;
                if (!phonePattern.test(phoneInput.value)) {
                    isValid = false;
                    phoneInput.style.borderColor = 'var(--primary-color)';
                    phoneValidation.textContent = "Please enter a valid 11-digit Bangladeshi mobile number";
                    phoneValidation.className = "phone-validation invalid";
                }

                if (!isValid) {
                    errorText.textContent = "Please fill in all required fields correctly.";
                    errorMessage.style.display = 'block';
                    successCard.style.display = 'none';
                    setTimeout(() => {
                        errorMessage.style.display = 'none';
                    }, 5000);
                    return;
                }

                // Disable submit button and show loading
                submitButton.disabled = true;
                submitButton.innerHTML = 'Submitting...';
                loading.style.display = 'block';
                errorMessage.style.display = 'none';

                try {
                    // Prepare form data
                    const formData = {
                        fullName: document.getElementById('fullName').value,
                        cellPhone: document.getElementById('cellPhone').value,
                        profession: document.getElementById('profession').value,
                        organizationName: document.getElementById('organizationName').value,
                        income: document.getElementById('income').value,
                        organizationAddress: document.getElementById('organizationAddress').value,
                        division: document.getElementById('division').value,
                        timestamp: new Date().toISOString()
                    };

                    // Submit to Google Apps Script
                    const scriptURL = "https://script.google.com/macros/s/AKfycbwuYqbiQKpDYxvY7_pIMQ2r5sqra6U25nGzqBiEh6a13XuU2sCTegl2rCDZWDBm_tx5VQ/exec"; // Replace with your web app URL

                    const response = await fetch(scriptURL, {
                        method: 'POST',
                        mode: 'no-cors', // Important for cross-origin requests
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData)
                    });

                    // Simulate a delay for better UX
                    await new Promise(resolve => setTimeout(resolve, 1500));

                    // Hide loading and show success card
                    loading.style.display = 'none';
                    form.style.display = 'none';
                    successCard.style.display = 'block';

                    // Scroll to success card
                    successCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

                } catch (error) {
                    console.error('Error submitting form:', error);
                    loading.style.display = 'none';
                    errorText.textContent = "An error occurred while submitting your application. Please try again.";
                    errorMessage.style.display = 'block';

                    // Re-enable submit button
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Submit Application';

                    // Hide error message after 5 seconds
                    setTimeout(() => {
                        errorMessage.style.display = 'none';
                    }, 5000);
                }
            });

            // New application button
            newApplicationBtn.addEventListener('click', function () {
                form.reset();
                form.style.display = 'block';
                successCard.style.display = 'none';

                // Reset phone validation
                phoneValidation.textContent = "Must be a valid 11-digit Bangladeshi mobile number starting with 01";
                phoneValidation.className = "phone-validation";

                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.innerHTML = 'Submit Application';

                // Scroll to top of form
                form.scrollIntoView({ behavior: 'smooth' });
            });
        });