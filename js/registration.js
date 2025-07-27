document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
    
    // Form elements
    const registrationForm = document.getElementById('registrationForm');
    const successMessage = document.getElementById('successMessage');
    const loadingScreen = document.getElementById('loading-screen');
    
    // Hide loading screen
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1000);

    // Form validation rules
    const validationRules = {
        firstName: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/
        },
        lastName: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        phone: {
            required: true,
            pattern: /^[\+]?[1-9][\d]{0,15}$/
        },
        age: {
            required: true
        },
        gender: {
            required: true
        },
        currentLevel: {
            required: true
        },
        learningGoals: {
            required: true
        },
        preferredTime: {
            required: true
        },
        timezone: {
            required: true
        },
        sessionFrequency: {
            required: true
        },
        terms: {
            required: true
        }
    };

    // Validation functions
    function validateField(field, value) {
        const rules = validationRules[field];
        if (!rules) return { isValid: true };

        // Required validation
        if (rules.required && (!value || value.trim() === '')) {
            return {
                isValid: false,
                message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
            };
        }

        // Skip other validations if field is empty and not required
        if (!value || value.trim() === '') {
            return { isValid: true };
        }

        // Min length validation
        if (rules.minLength && value.length < rules.minLength) {
            return {
                isValid: false,
                message: `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rules.minLength} characters`
            };
        }

        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
            let message = '';
            switch (field) {
                case 'firstName':
                case 'lastName':
                    message = 'Name should contain only letters and spaces';
                    break;
                case 'email':
                    message = 'Please enter a valid email address';
                    break;
                case 'phone':
                    message = 'Please enter a valid phone number';
                    break;
                default:
                    message = `Invalid ${field} format`;
            }
            return { isValid: false, message };
        }

        return { isValid: true };
    }

    function showError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const errorElement = field.parentNode.querySelector('.error-message');
        
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    function clearError(fieldName) {
        const field = document.getElementById(fieldName);
        const errorElement = field.parentNode.querySelector('.error-message');
        
        field.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    function validateForm() {
        let isValid = true;
        const formData = new FormData(registrationForm);

        // Clear all previous errors
        Object.keys(validationRules).forEach(field => clearError(field));

        // Validate regular fields
        for (let [field, value] of formData.entries()) {
            if (field !== 'sessionFrequency' && field !== 'terms' && field !== 'newsletter') {
                const validation = validateField(field, value);
                if (!validation.isValid) {
                    showError(field, validation.message);
                    isValid = false;
                }
            }
        }

        // Validate radio buttons (sessionFrequency)
        const sessionFrequency = document.querySelector('input[name="sessionFrequency"]:checked');
        if (!sessionFrequency) {
            const radioGroup = document.querySelector('.radio-group');
            const errorElement = radioGroup.parentNode.querySelector('.error-message');
            if (errorElement) {
                errorElement.textContent = 'Please select your preferred session frequency';
                errorElement.style.display = 'block';
            }
            isValid = false;
        }

        // Validate terms checkbox
        const terms = document.getElementById('terms');
        if (!terms.checked) {
            const errorElement = terms.parentNode.parentNode.querySelector('.error-message');
            if (errorElement) {
                errorElement.textContent = 'You must agree to the terms and conditions';
                errorElement.style.display = 'block';
            }
            isValid = false;
        }

        return isValid;
    }

    // Real-time validation for text inputs
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field && field.type !== 'radio' && field.type !== 'checkbox') {
            field.addEventListener('blur', function() {
                const validation = validateField(fieldName, this.value);
                if (!validation.isValid) {
                    showError(fieldName, validation.message);
                } else {
                    clearError(fieldName);
                }
            });

            field.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    const validation = validateField(fieldName, this.value);
                    if (validation.isValid) {
                        clearError(fieldName);
                    }
                }
            });
        }
    });

    // Radio button validation
    const radioButtons = document.querySelectorAll('input[name="sessionFrequency"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            const radioGroup = document.querySelector('.radio-group');
            const errorElement = radioGroup.parentNode.querySelector('.error-message');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        });
    });

    // Terms checkbox validation
    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox) {
        termsCheckbox.addEventListener('change', function() {
            const errorElement = this.parentNode.parentNode.querySelector('.error-message');
            if (errorElement && this.checked) {
                errorElement.style.display = 'none';
            }
        });
    }

    // Form submission
    if (registrationForm) {
        registrationForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Validate form
            if (!validateForm()) {
                // Scroll to first error
                const firstError = document.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            // Show loading state
            const submitBtn = registrationForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Registration...';
            submitBtn.disabled = true;

            try {
                // Prepare form data
                const formData = new FormData(registrationForm);
                const sessionFrequency = document.querySelector('input[name="sessionFrequency"]:checked');
                
                const templateParams = {
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    age: formData.get('age'),
                    gender: formData.get('gender'),
                    currentLevel: formData.get('currentLevel'),
                    learningGoals: formData.get('learningGoals'),
                    preferredTime: formData.get('preferredTime'),
                    timezone: formData.get('timezone'),
                    sessionFrequency: sessionFrequency ? sessionFrequency.value : '',
                    previousExperience: formData.get('previousExperience') || 'Not specified',
                    specialRequests: formData.get('specialRequests') || 'None',
                    newsletter: formData.get('newsletter') ? 'Yes' : 'No',
                    to_email: 'your-email@example.com', // Replace with your email
                    reply_to: formData.get('email'),
                    registration_date: new Date().toLocaleDateString(),
                    message: formatRegistrationMessage(formData, sessionFrequency)
                };

                // Send email using EmailJS
                const response = await emailjs.send(
                    'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
                    'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
                    templateParams
                );

                if (response.status === 200) {
                    // Hide form and show success message
                    registrationForm.style.display = 'none';
                    successMessage.style.display = 'block';
                    successMessage.scrollIntoView({ behavior: 'smooth' });

                    // Add success animation
                    setTimeout(() => {
                        successMessage.classList.add('show');
                    }, 100);

                    // Send confirmation email to user
                    await sendConfirmationEmail(templateParams);

                } else {
                    throw new Error('Failed to send registration');
                }

            } catch (error) {
                console.error('Error sending registration:', error);
                showNotification('Failed to submit registration. Please try again later.', 'error');
            } finally {
                // Reset button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Format registration message for email
    function formatRegistrationMessage(formData, sessionFrequency) {
        return `
New Student Registration - QuranLessons

PERSONAL INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Name: ${formData.get('firstName')} ${formData.get('lastName')}
• Email: ${formData.get('email')}
• Phone: ${formData.get('phone')}
• Age Group: ${formData.get('age')}
• Gender: ${formData.get('gender')}

LEARNING PREFERENCES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Current Level: ${formData.get('currentLevel')}
• Learning Goals: ${formData.get('learningGoals')}
• Preferred Time: ${formData.get('preferredTime')}
• Timezone: ${formData.get('timezone')}
• Session Frequency: ${sessionFrequency ? sessionFrequency.value : 'Not specified'}

ADDITIONAL INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Previous Experience: ${formData.get('previousExperience') || 'Not specified'}
• Special Requests: ${formData.get('specialRequests') || 'None'}
• Newsletter Subscription: ${formData.get('newsletter') ? 'Yes' : 'No'}

REGISTRATION DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Registration Date: ${new Date().toLocaleDateString()}
• Registration Time: ${new Date().toLocaleTimeString()}

Please contact this student within 24 hours to schedule their first lesson.

جزاك الله خيرا
QuranLessons Team
        `.trim();
    }

    // Send confirmation email to the student
    async function sendConfirmationEmail(data) {
        const confirmationParams = {
            to_email: data.email,
            student_name: data.firstName,
            registration_date: data.registration_date,
            preferred_time: data.preferredTime,
            current_level: data.currentLevel,
            learning_goals: data.learningGoals
        };

        try {
            await emailjs.send(
                'YOUR_SERVICE_ID', // Same service ID
                'YOUR_CONFIRMATION_TEMPLATE_ID', // Different template for confirmation
                confirmationParams
            );
        } catch (error) {
            console.error('Error sending confirmation email:', error);
        }
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto hide after 5 seconds
        const autoHide = setTimeout(() => {
            hideNotification(notification);
        }, 5000);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoHide);
            hideNotification(notification);
        });
    }

    function hideNotification(notification) {
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Form progress indicator
    function updateFormProgress() {
        const requiredFields = registrationForm.querySelectorAll('[required]');
        const filledFields = Array.from(requiredFields).filter(field => {
            if (field.type === 'radio') {
                return document.querySelector(`input[name="${field.name}"]:checked`);
            } else if (field.type === 'checkbox') {
                return field.checked;
            } else {
                return field.value.trim() !== '';
            }
        });

        const progress = (filledFields.length / requiredFields.length) * 100;
        
        // Update progress bar if it exists
        const progressBar = document.querySelector('.progress-bar-fill');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }

        const progressText = document.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = `${Math.round(progress)}% Complete`;
        }
    }

    // Add event listeners for progress tracking
    const allInputs = registrationForm.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => {
        input.addEventListener('input', updateFormProgress);
        input.addEventListener('change', updateFormProgress);
    });

    // Initialize progress
    updateFormProgress();

    // Form section animations
    function animateFormSections() {
        const sections = document.querySelectorAll('.form-section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, index * 200);
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(section => observer.observe(section));
    }

    animateFormSections();
});

// CSS for notifications and animations
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 1000;
        max-width: 400px;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification.hide {
        transform: translateX(400px);
    }

    .notification.error {
        background: #dc3545;
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }

    .form-section.animate {
        transform: translateY(0);
        opacity: 1;
    }

    .form-section {
        transform: translateY(30px);
        opacity: 0;
        transition: all 0.6s ease;
    }

    .progress-bar {
        width: 100%;
        height: 4px;
        background: rgba(255,255,255,0.1);
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 2rem;
    }

    .progress-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary-color), var(--gold));
        transition: width 0.3s ease;
        width: 0%;
    }

    .progress-text {
        text-align: center;
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }
`;

document.head.appendChild(style);