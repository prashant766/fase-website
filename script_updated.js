/* ============================================
   FASE - MAIN JAVASCRIPT
   Handles: Mobile menu, dropdowns, course filtering, i18n
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initDropdowns();
    filterCourses();
    initLanguageSwitcher();
});

/* ============================================
   LANGUAGE SWITCHER (i18n)
   ============================================ */

function initLanguageSwitcher() {
    const langSwitch = document.querySelector('.lang-switch');
    
    if (langSwitch) {
        const saved = localStorage.getItem('language') || 'en';

        // 🔥 THIS LINE FIXES YOUR MAIN BUG
        switchLanguage(saved);

        langSwitch.value = saved;
        
        langSwitch.addEventListener('change', function(e) {
            switchLanguage(e.target.value);
        });
    }
}

/* ============================================
   MOBILE MENU FUNCTIONALITY
   ============================================ */

function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!mobileMenuToggle) return;

    mobileMenuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't close if it's a dropdown toggle
            if (this.nextElementSibling && this.nextElementSibling.classList.contains('dropdown-menu')) {
                e.preventDefault();
                toggleDropdown(this.parentElement);
            } else {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    });
}

/* ============================================
   DROPDOWN MENU FUNCTIONALITY
   ============================================ */

function initDropdowns() {
    const dropdownItems = document.querySelectorAll('.nav-item.dropdown');

    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        
        // Desktop: handled by CSS :hover
        // Mobile: click to toggle
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                toggleDropdown(item);
            }
        });
    });

    // Nested dropdowns
    const nestedDropdowns = document.querySelectorAll('.dropdown-nested');
    nestedDropdowns.forEach(item => {
        const link = item.querySelector('.dropdown-link');
        
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                toggleNestedDropdown(item);
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-item')) {
            dropdownItems.forEach(item => {
                item.classList.remove('active');
            });
            nestedDropdowns.forEach(item => {
                item.classList.remove('active');
            });
        }
    });
}

function toggleDropdown(element) {
    // Close other dropdowns at the same level
    const parent = element.parentElement;
    const siblings = parent.querySelectorAll('.nav-item.dropdown');
    
    siblings.forEach(sibling => {
        if (sibling !== element) {
            sibling.classList.remove('active');
        }
    });

    element.classList.toggle('active');
}

function toggleNestedDropdown(element) {
    element.classList.toggle('active');
}

/* ============================================
   COURSE FILTERING
   ============================================ */

function filterCourses() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const courseType = urlParams.get('type');

    // Only run on courses page
    const coursesGrid = document.getElementById('coursesGrid');
    if (!coursesGrid) return;

    // Show all courses by default, or filter by type
    const courseCards = coursesGrid.querySelectorAll('.course-card');

    if (courseType) {
        courseCards.forEach(card => {
            const cardType = card.getAttribute('data-type');
            if (cardType === courseType) {
                card.style.display = 'block';
                card.classList.add('show');
            } else {
                card.style.display = 'none';
            }
        });

        // Update active filter button
        updateActiveFilter(courseType);
    } else {
        // Show all courses
        courseCards.forEach(card => {
            card.style.display = 'block';
        });
        updateActiveFilter(null);
    }
}

function updateActiveFilter(courseType) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        
        // Check if button corresponds to the course type
        const btnHref = btn.getAttribute('href');
        const btnType = new URLSearchParams(btnHref.split('?')[1]).get('type');
        
        if (courseType === null && btnHref === 'courses.html') {
            btn.classList.add('active');
        } else if (courseType && btnType === courseType) {
            btn.classList.add('active');
        }
    });
}

/* ============================================
   RESPONSIVE ADJUSTMENTS
   ============================================ */

window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        // Reset mobile menu on desktop
        const navMenu = document.querySelector('.nav-menu');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        
        if (navMenu && mobileMenuToggle) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }

        // Remove active classes from dropdowns (they use :hover on desktop)
        const dropdownItems = document.querySelectorAll('.nav-item');
        dropdownItems.forEach(item => {
            item.classList.remove('active');
        });
    }
});

/* ============================================
   SMOOTH SCROLL BEHAVIOR
   ============================================ */

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* ============================================
   PAGE LOAD ANIMATIONS (Optional Enhancement)
   ============================================ */

// Add animation to elements on page load
window.addEventListener('load', function() {
    const animateElements = document.querySelectorAll('.gallery-item, .team-card, .course-card');
    
    animateElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.animation = `slideInUp 0.6s ease ${index * 0.1}s forwards`;
    });
});

/* ============================================
   CTA BUTTON FUNCTIONALITY
   ============================================ */

const ctaButtons = document.querySelectorAll('.cta-button, .course-btn');
ctaButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        // Add ripple effect on click
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});
