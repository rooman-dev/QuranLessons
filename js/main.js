// Main JavaScript for QuranLessons

document.addEventListener('DOMContentLoaded', function() {
    // Loading Screen Handler
    const loadingScreen = document.getElementById('loading-screen');
    
    // Hide loading screen after page loads
    window.addEventListener('load', function() {
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 1500); // Show loading for 1.5 seconds minimum
    });

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth scroll for navigation links
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

    // Fade in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with fade-in-up class
    document.querySelectorAll('.fade-in-up').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease';
        observer.observe(el);
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(249, 246, 242, 0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(47, 47, 47, 0.1)';
            } else {
                navbar.style.background = 'rgba(249, 246, 242, 0.95)';
                navbar.style.boxShadow = '0 4px 20px rgba(47, 47, 47, 0.08)';
            }
        });
    }

    // Form validation (if registration form exists)
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const requiredFields = registrationForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                const errorMsg = field.parentNode.querySelector('.error-message');
                
                if (!field.value.trim()) {
                    field.classList.add('error');
                    if (errorMsg) errorMsg.style.display = 'block';
                    isValid = false;
                } else {
                    field.classList.remove('error');
                    if (errorMsg) errorMsg.style.display = 'none';
                }
            });
            
            // Email validation
            const emailField = registrationForm.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    emailField.classList.add('error');
                    const errorMsg = emailField.parentNode.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.textContent = 'Please enter a valid email address';
                        errorMsg.style.display = 'block';
                    }
                    isValid = false;
                }
            }
            
            if (isValid) {
                // Show success message
                showSuccessMessage();
            }
        });
    }

    // Contact form validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const requiredFields = contactForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('error');
                    isValid = false;
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (isValid) {
                showSuccessMessage();
            }
        });
    }

    // Success message function
    function showSuccessMessage() {
        // Create success overlay
        const successOverlay = document.createElement('div');
        successOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(249, 246, 242, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;
        
        successOverlay.innerHTML = `
            <div style="
                background: white;
                padding: 3rem;
                border-radius: 20px;
                text-align: center;
                box-shadow: 0 8px 30px rgba(47, 47, 47, 0.12);
                border: 1px solid #d8cbb3;
                max-width: 500px;
                margin: 0 20px;
            ">
                <div style="font-size: 4rem; color: #6c8c5d; margin-bottom: 1.5rem;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3 style="color: #2f2f2f; margin-bottom: 1rem; font-family: 'Amiri', serif;">
                    بارك الله فيك
                </h3>
                <h4 style="color: #2f2f2f; margin-bottom: 1rem;">
                    Thank You!
                </h4>
                <p style="color: #7b7b7b; margin-bottom: 1.5rem;">
                    Your submission has been received successfully. We will contact you soon.
                </p>
                <div style="
                    background: rgba(108, 140, 93, 0.1);
                    padding: 1rem;
                    border-radius: 10px;
                    margin-bottom: 1.5rem;
                    border: 1px solid rgba(108, 140, 93, 0.2);
                ">
                    <p style="
                        color: #6c8c5d;
                        font-family: 'Amiri', serif;
                        font-size: 1.3rem;
                        margin-bottom: 0.5rem;
                    ">وَفِي ذَٰلِكَ فَلْيَتَنَافَسِ الْمُتَنَافِسُونَ</p>
                    <span style="
                        color: #7b7b7b;
                        font-size: 0.9rem;
                    ">"And for this let the competitors compete" - Quran 83:26</span>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: linear-gradient(135deg, #6c8c5d, #5a7850);
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 50px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.3s ease;
                ">
                    Continue
                </button>
            </div>
        `;
        
        document.body.appendChild(successOverlay);
        
        // Fade in
        setTimeout(() => {
            successOverlay.style.opacity = '1';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (successOverlay.parentNode) {
                successOverlay.style.opacity = '0';
                setTimeout(() => {
                    successOverlay.remove();
                }, 500);
            }
        }, 5000);
    }

    // Add hover effects to cards
    const cards = document.querySelectorAll('.feature-card, .course-card, .testimonial-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    // Add typing effect to hero title (optional)
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        setTimeout(() => {
            const typeTimer = setInterval(() => {
                heroTitle.textContent += text.charAt(i);
                i++;
                if (i > text.length - 1) {
                    clearInterval(typeTimer);
                }
            }, 100);
        }, 2000); // Start after loading screen
    }

    // Radio button and checkbox custom styling
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Remove selected class from all radio options in the same group
            document.querySelectorAll(`input[name="${this.name}"]`).forEach(r => {
                r.closest('.radio-option').classList.remove('selected');
            });
            // Add selected class to current option
            this.closest('.radio-option').classList.add('selected');
        });
    });

    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                this.closest('.checkbox-option').classList.add('selected');
            } else {
                this.closest('.checkbox-option').classList.remove('selected');
            }
        });
    });

    // Console log for debugging
    console.log('QuranLessons website loaded successfully! ✨');
    console.log('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم');
});

// Utility function to detect if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Handle window resize
window.addEventListener('resize', function() {
    // Close mobile menu on resize
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Prevent loading screen from showing on back button
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }
});

// Bismillah Header Scroll Behavior
document.addEventListener('DOMContentLoaded', function() {
    const bismillahHeader = document.querySelector('.bismillah-header');
    const navbar = document.querySelector('.navbar');
    const mainContent = document.querySelector('.main-content');
    let lastScrollTop = 0;
    let scrollThreshold = 100; // Pixels to scroll before hiding
    
    function handleScroll() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // Check if scrolled down enough
        if (currentScroll > scrollThreshold && currentScroll > lastScrollTop) {
            // Scrolling down - hide Bismillah
            bismillahHeader.classList.add('hidden');
            navbar.classList.add('bismillah-hidden');
            if (mainContent) {
                mainContent.classList.add('bismillah-hidden');
            }
        } else if (currentScroll <= scrollThreshold || currentScroll < lastScrollTop) {
            // Scrolling up or at top - show Bismillah
            bismillahHeader.classList.remove('hidden');
            navbar.classList.remove('bismillah-hidden');
            if (mainContent) {
                mainContent.classList.remove('bismillah-hidden');
            }
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }
    
    // Throttle scroll events for better performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16); // ~60fps
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Initialize on page load
    handleScroll();
});