// DOM elements
const menuButtons = document.querySelectorAll('.menu-button');
const menuContents = document.querySelectorAll('.menu-content');
const guestForm = document.getElementById('guestForm');
const stars = document.querySelectorAll('.star');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeMenus();
    initializeStarRating();
    initializeForm();
    addScrollAnimations();
});

// Menu toggle functionality
function initializeMenus() {
    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            
            // Toggle current menu
            if (targetContent.classList.contains('active')) {
                closeMenu(this, targetContent);
            } else {
                // Close all other menus first
                closeAllMenus();
                // Open clicked menu
                openMenu(this, targetContent);
            }
        });
    });
}

function openMenu(button, content) {
    button.classList.add('active');
    content.classList.add('active');
    
    // Smooth scroll to the opened menu
    setTimeout(() => {
        button.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
        });
    }, 200);
}

function closeMenu(button, content) {
    button.classList.remove('active');
    content.classList.remove('active');
}

function closeAllMenus() {
    menuButtons.forEach(btn => btn.classList.remove('active'));
    menuContents.forEach(content => content.classList.remove('active'));
}

// Star rating functionality
function initializeStarRating() {
    let selectedRating = 0;
    
    stars.forEach((star, index) => {
        star.addEventListener('click', function() {
            selectedRating = index + 1;
            updateStarDisplay(selectedRating);
        });
        
        star.addEventListener('mouseenter', function() {
            updateStarDisplay(index + 1);
        });
    });
    
    // Reset to selected rating when mouse leaves
    document.querySelector('.star-rating').addEventListener('mouseleave', function() {
        updateStarDisplay(selectedRating);
    });
    
    function updateStarDisplay(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }
}

// Form handling
function initializeForm() {
    if (guestForm) {
        guestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const rating = document.querySelectorAll('.star.active').length;
            const opinion = this.querySelector('textarea').value;
            
            // Simulate form submission
            submitGuestForm(name, rating, opinion);
        });
    }
}

function submitGuestForm(name, rating, opinion) {
    const submitBtn = guestForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wysyłanie...';
    submitBtn.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.classList.remove('loading');
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        guestForm.reset();
        
        // Reset star rating
        stars.forEach(star => star.classList.remove('active'));
        
        // Close menu after success
        setTimeout(() => {
            closeAllMenus();
        }, 2000);
        
    }, 1500);
}

function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message show';
    successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Dziękujemy za opinię! 🙏';
    
    guestForm.appendChild(successMessage);
    
    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}

// Scroll animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe menu cards for animation
    document.querySelectorAll('.menu-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Table selection functionality
function initializeTableSelection() {
    const tableItems = document.querySelectorAll('.table-item');
    
    tableItems.forEach(table => {
        table.addEventListener('click', function() {
            // Remove previous selection
            tableItems.forEach(item => item.classList.remove('selected'));
            
            // Add selection to clicked table
            this.classList.add('selected');
            
            // Show confirmation
            showTableConfirmation(this.textContent);
        });
    });
}

function showTableConfirmation(tableNumber) {
    const confirmation = document.createElement('div');
    confirmation.className = 'table-confirmation';
    confirmation.innerHTML = `
        <i class="fas fa-check-circle"></i>
        Wybrałeś stolik nr ${tableNumber}
    `;
    
    const tableMap = document.querySelector('.table-map');
    tableMap.appendChild(confirmation);
    
    setTimeout(() => {
        confirmation.remove();
    }, 2000);
}

// Enhanced menu interactions
function addMenuEnhancements() {
    // Add haptic feedback for mobile devices
    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllMenus();
        }
    });
}

// Initialize table selection when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTableSelection();
    addMenuEnhancements();
});

// Service Worker registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Add touch gesture support
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleGesture();
});

function handleGesture() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndY - touchStartY;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // Swipe down - could close current menu
            // closeAllMenus();
        }
    }
}

// Auto-save form data to localStorage
function autoSaveFormData() {
    const inputs = guestForm.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        // Load saved data
        const savedValue = localStorage.getItem(`guestForm_${input.name || input.type}`);
        if (savedValue) {
            input.value = savedValue;
        }
        
        // Save on input
        input.addEventListener('input', function() {
            localStorage.setItem(`guestForm_${this.name || this.type}`, this.value);
        });
    });
    
    // Clear saved data on successful submit
    guestForm.addEventListener('submit', function() {
        inputs.forEach(input => {
            localStorage.removeItem(`guestForm_${input.name || input.type}`);
        });
    });
}

// Initialize auto-save when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (guestForm) {
        autoSaveFormData();
    }
})

// Dodaj do script.js
function initializeNameAndTable() {
    const nameInput = document.getElementById('guestName');
    const tableItems = document.querySelectorAll('.table-item');
    
    tableItems.forEach(table => {
        table.addEventListener('click', function() {
            const guestName = nameInput.value.trim();
            
            if (!guestName) {
                alert('Najpierw wpisz swoje imię!');
                nameInput.focus();
                return;
            }
            
            // Usuń poprzedni wybór
            tableItems.forEach(item => item.classList.remove('selected'));
            
            // Zaznacz wybrany stolik
            this.classList.add('selected');
            
            // Pokaż potwierdzenie
            showTableAssignment(guestName, this.textContent);
        });
    });
}

function showTableAssignment(name, tableNumber) {
    const confirmation = document.createElement('div');
    confirmation.className = 'table-confirmation';
    confirmation.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${name} - Stolik nr ${tableNumber}
    `;
    
    const tableMap = document.querySelector('.table-map');
    tableMap.appendChild(confirmation);
    
    setTimeout(() => {
        confirmation.remove();
    }, 3000);
}

// Dodaj do DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNameAndTable();
});

// Baza danych przypisania gości do stolików
const guestDatabase = {
    "Jan Kowalski": 1,
    "Anna Nowak": 2,
    "Piotr Wiśniewski": 3,
    "Maria Dąbrowska": 4,
    "Tomasz Lewandowski": 5,
    "Katarzyna Wójcik": 1,
    "Michał Kamiński": 2,
    "Agnieszka Krawczyk": 3,
    "Robert Mazur": 4,
    "Joanna Zielińska": 5,
    "Marcin Kozłowski": 1,
    "Magdalena Jankowska": 2
};

function initializeGuestSearch() {
    const nameInput = document.getElementById('guestName');
    
    if (nameInput) {
        // Sprawdzaj podczas wpisywania
        nameInput.addEventListener('input', function() {
            const inputValue = this.value.trim();
            
            if (inputValue.length >= 3) {
                checkGuestTable(inputValue);
            } else {
                clearHighlights();
                clearNotifications();
            }
        });
        
        // Sprawdzaj też po utracie focus
        nameInput.addEventListener('blur', function() {
            const inputValue = this.value.trim();
            if (inputValue.length >= 2) {
                checkGuestTable(inputValue);
            }
        });
    }
}

function checkGuestTable(searchTerm) {
    const normalizedSearch = searchTerm.toLowerCase();
    
    // Szukaj dokładnego dopasowania
    let foundGuest = Object.keys(guestDatabase).find(name => 
        name.toLowerCase() === normalizedSearch
    );
    
    // Jeśli nie znaleziono dokładnego, szukaj częściowego
    if (!foundGuest) {
        foundGuest = Object.keys(guestDatabase).find(name => {
            const normalizedName = name.toLowerCase();
            return normalizedName.includes(normalizedSearch) || 
                   normalizedSearch.includes(normalizedName.split(' ')[0]) ||
                   normalizedSearch.includes(normalizedName.split(' ')[1]);
        });
    }
    
    if (foundGuest) {
        const tableNumber = guestDatabase[foundGuest];
        highlightTable(tableNumber);
        showGuestFound(foundGuest, tableNumber);
    } else {
        clearHighlights();
        
        // Pokaż sugestie jeśli nie znaleziono
        if (searchTerm.length >= 4) {
            showSuggestions(searchTerm);
        }
    }
}

function highlightTable(tableNumber) {
    clearHighlights();
    
    const tableElement = document.querySelector(`[data-table="${tableNumber}"]`);
    if (tableElement) {
        tableElement.classList.add('highlighted');
        
        // Przewiń do stolika
        setTimeout(() => {
            tableElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 300);
    }
}

function clearHighlights() {
    document.querySelectorAll('.table-item').forEach(table => {
        table.classList.remove('highlighted');
    });
}

function showGuestFound(guestName, tableNumber) {
    clearNotifications();
    
    const notification = document.createElement('div');
    notification.className = 'guest-notification';
    notification.innerHTML = `
        <i class="fas fa-user-check"></i>
        Znaleziono: <strong>${guestName}</strong><br>
        <i class="fas fa-chair"></i> Stolik nr <strong>${tableNumber}</strong>
    `;
    
    const nameSection = document.querySelector('.name-input-section');
    nameSection.appendChild(notification);
    
    // Auto usuń po 5 sekundach
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function showSuggestions(searchTerm) {
    clearNotifications();
    
    const suggestions = Object.keys(guestDatabase).filter(name =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 3);
    
    if (suggestions.length > 0) {
        const notification = document.createElement('div');
        notification.className = 'guest-notification';
        notification.style.background = 'linear-gradient(135deg, #ff9800, #f57c00)';
        notification.innerHTML = `
            <i class="fas fa-search"></i>
            Czy chodziło o: <strong>${suggestions.join('</strong>, <strong>')}</strong>?
        `;
        
        const nameSection = document.querySelector('.name-input-section');
        nameSection.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
    }
}

function clearNotifications() {
    document.querySelectorAll('.guest-notification').forEach(notification => {
        notification.remove();
    });
}

// Inicjalizacja po załadowaniu DOM
document.addEventListener('DOMContentLoaded', function() {
    initializeGuestSearch();
});