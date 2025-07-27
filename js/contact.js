document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
    
    // Form elements
    const contactForm = document.getElementById('contactForm');
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
        name: {
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
        subject: {
            required: true,
            minLength: 5
        },
        message: {
            required: true,
            minLength: 10
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
                case 'name':
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
        const formData = new FormData(contactForm);

        // Clear all previous errors
        Object.keys(validationRules).forEach(field => clearError(field));

        // Validate each field
        for (let [field, value] of formData.entries()) {
            const validation = validateField(field, value);
            if (!validation.isValid) {
                showError(field, validation.message);
                isValid = false;
            }
        }

        return isValid;
    }

    // Real-time validation
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
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

    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
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
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Message...';
            submitBtn.disabled = true;

            try {
                // Prepare form data
                const formData = new FormData(contactForm);
                const templateParams = {
                    from_name: formData.get('name'),
                    from_email: formData.get('email'),
                    phone: formData.get('phone'),
                    subject: formData.get('subject'),
                    message: formData.get('message'),
                    to_email: 'your-email@example.com', // Replace with your email
                    reply_to: formData.get('email')
                };

                // Send email using EmailJS
                const response = await emailjs.send(
                    'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
                    'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
                    templateParams
                );

                if (response.status === 200) {
                    // Hide form and show success message
                    contactForm.style.display = 'none';
                    successMessage.style.display = 'block';
                    successMessage.scrollIntoView({ behavior: 'smooth' });

                    // Add success animation
                    setTimeout(() => {
                        successMessage.classList.add('show');
                    }, 100);

                    // Reset form after delay
                    setTimeout(() => {
                        contactForm.reset();
                        contactForm.style.display = 'block';
                        successMessage.style.display = 'none';
                        successMessage.classList.remove('show');
                    }, 5000);
                } else {
                    throw new Error('Failed to send message');
                }

            } catch (error) {
                console.error('Error sending message:', error);
                
                // Show error message
                showNotification('Failed to send message. Please try again later.', 'error');
            } finally {
                // Reset button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Contact info animations
    function animateContactCards() {
        const contactCards = document.querySelectorAll('.contact-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, index * 200);
                }
            });
        }, { threshold: 0.2 });

        contactCards.forEach(card => observer.observe(card));
    }

    // FAQ accordion functionality
    function initializeFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        otherAnswer.style.maxHeight = null;
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    answer.style.maxHeight = null;
                } else {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
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

    // Office hours display
    function updateOfficeHours() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
        
        const officeStatus = document.querySelector('.office-status');
        if (officeStatus) {
            // Office hours: Monday-Friday 9AM-6PM, Saturday 10AM-4PM
            let isOpen = false;
            
            if (currentDay >= 1 && currentDay <= 5) { // Monday-Friday
                isOpen = currentHour >= 9 && currentHour < 18;
            } else if (currentDay === 6) { // Saturday
                isOpen = currentHour >= 10 && currentHour < 16;
            }
            
            if (isOpen) {
                officeStatus.innerHTML = '<i class="fas fa-circle text-green"></i> We\'re Open';
                officeStatus.className = 'office-status open';
            } else {
                officeStatus.innerHTML = '<i class="fas fa-circle text-red"></i> We\'re Closed';
                officeStatus.className = 'office-status closed';
            }
        }
    }

    // Social media hover effects
    function initializeSocialMedia() {
        const socialLinks = document.querySelectorAll('.social-link');
        
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.1)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Map integration (placeholder for future implementation)
    function initializeMap() {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            // Placeholder for Google Maps or other map service integration
            mapContainer.innerHTML = `
                <div class="map-placeholder">
                    <i class="fas fa-map-marker-alt"></i>
                    <p>Interactive Map Coming Soon</p>
                    <small>Contact us for directions</small>
                </div>
            `;
        }
    }

    // Initialize all functions
    animateContactCards();
    initializeFAQ();
    updateOfficeHours();
    initializeSocialMedia();
    initializeMap();

    // Update office hours every minute
    setInterval(updateOfficeHours, 60000);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add floating animation to contact icons
    function addFloatingAnimation() {
        const contactIcons = document.querySelectorAll('.contact-card .card-icon i');
        
        contactIcons.forEach((icon, index) => {
            icon.style.animation = `float 3s ease-in-out infinite`;
            icon.style.animationDelay = `${index * 0.5}s`;
        });
    }

    addFloatingAnimation();
});

// CSS animations (add to your CSS file)
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }

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

    .contact-card.animate {
        transform: translateY(0);
        opacity: 1;
    }

    .contact-card {
        transform: translateY(30px);
        opacity: 0;
        transition: all 0.6s ease;
    }

    .map-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 300px;
        background: var(--surface-color);
        border-radius: 12px;
        text-align: center;
        color: var(--text-secondary);
    }

    .map-placeholder i {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: var(--primary-color);
    }

    .office-status.open {
        color: #28a745;
    }

    .office-status.closed {
        color: #dc3545;
    }

    .text-green {
        color: #28a745;
    }

    .text-red {
        color: #dc3545;
    }
`;

document.head.appendChild(style);