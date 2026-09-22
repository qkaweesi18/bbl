document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links with better offset handling
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll-based header background opacity
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(12, 5, 22, 0.95)';
        } else {
            header.style.background = 'rgba(12, 5, 22, 0.8)';
        }
    });

    // Close mobile menu when clicking any link
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function() {
            const nav = document.querySelector('nav ul');
            const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
            if (mobileMenuBtn && window.innerWidth <= 768 && nav.style.display === 'flex') {
                nav.style.display = 'none';
                mobileMenuBtn.innerHTML = '☰';
            }
        });
    });

    // Dynamic gallery rendering with categories and lightbox
    const galleryGrid = document.getElementById('gallery-grid');
    let galleryImages = [];
    let currentLightboxIndex = 0;

    // Catalog data with categories
    const catalogData = [
        { filename: 'womanlargebraids.jpeg', category: 'box-braids', title: 'Large Box Braids' },
        { filename: 'braidsexample.jpeg', category: 'box-braids', title: 'Box Braids Style' },
        { filename: 'braidswithbeedswomanexample.jpeg', category: 'creative', title: 'Braids with Beads' },
        { filename: 'cornrowsandbraidshybrid.jpeg', category: 'cornrows', title: 'Cornrows Hybrid' },
        { filename: 'cornrowsandbraidshybrid2.jpeg', category: 'cornrows', title: 'Cornrows Style 2' },
        { filename: 'womancombinghair.jpeg', category: 'process', title: 'Hair Combing Process' },
        { filename: 'womanwashinghairshampoo.jpeg', category: 'process', title: 'Wash & Treatment' },
        { filename: 'womanwithdarkbrownbraids.jpeg', category: 'box-braids', title: 'Dark Brown Braids' },
        { filename: '2womanhuggingeachotherwithcornrows.jpeg', category: 'cornrows', title: 'Matching Cornrows' },
        { filename: 'jackie-sahsoclean.jpeg', category: 'creative', title: 'Creative Style' },
        { filename: 'auntiejackie-stransform.jpeg', category: 'creative', title: 'Hair Transformation' },
        { filename: 'whatsapp-image-2025-11-07-at-18.58.31.jpeg', category: 'box-braids', title: 'Box Braids' },
        { filename: 'whatsapp-image-2025-11-07-at-18.58.31-1-.jpeg', category: 'creative', title: 'Creative Braids' },
        { filename: 'whatsapp-image-2025-11-07-at-18.58.31-2-.jpeg', category: 'cornrows', title: 'Cornrows Design' },
        { filename: 'whatsapp-image-2025-11-07-at-18.58.32-2-.jpeg', category: 'process', title: 'Styling Process' },
        { filename: 'whatsapp-image-2025-11-07-at-18.58.32-3-.jpeg', category: 'creative', title: 'Unique Style' },
        { filename: 'whatsapp-image-2025-11-07-at-18.58.33-2-.jpeg', category: 'box-braids', title: 'Box Braids Variation' },
        { filename: 'womancombingwoman-shairshowingstrands.jpeg', category: 'process', title: 'Hair Care' },
        { filename: 'womancoveredwithauntijackie-s.jpeg', category: 'process', title: 'Protective Style' },
        { filename: 'womanintheprocessofbeingbraided.jpeg', category: 'process', title: 'Braiding Process' },
        { filename: 'cornrowsexample.jpeg', category: 'cornrows', title: 'Cornrows Example' }
    ];

    async function loadGallery() {
        if (!galleryGrid) {
            console.error('Gallery grid element not found');
            return;
        }
        
        // Try to load from gallery.json first
        let loadedGallery = null;
        try {
            const res = await fetch('images/gallery.json', { cache: 'no-store' });
            if (res.ok) loadedGallery = await res.json();
        } catch (e) {
            console.warn('Could not load images/gallery.json, using catalog data', e);
        }

        // Use loaded gallery or catalog data
        if (Array.isArray(loadedGallery) && loadedGallery.length) {
            galleryImages = loadedGallery.map(filename => {
                const catalogItem = catalogData.find(item => item.filename === filename);
                return catalogItem || { filename, category: 'creative', title: 'Hairstyle' };
            });
        } else {
            galleryImages = catalogData;
        }

        renderGallery('all');
        setupFilters();
        setupLightbox();
    }

    function renderGallery(category) {
        galleryGrid.innerHTML = '';
        
        const filteredImages = category === 'all' 
            ? galleryImages 
            : galleryImages.filter(img => img.category === category);

        filteredImages.forEach((imgData, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'gallery-item';
            // Store the original index from the full galleryImages array
            const originalIndex = galleryImages.indexOf(imgData);
            wrapper.dataset.index = originalIndex;
            wrapper.dataset.category = imgData.category;
            wrapper.style.cursor = 'pointer';
            wrapper.setAttribute('role', 'button');
            wrapper.setAttribute('tabindex', '0');
            wrapper.setAttribute('aria-label', `View ${imgData.title || 'hairstyle'} image`);

            const img = document.createElement('img');
            img.src = `images/${imgData.filename}`;
            img.alt = imgData.title || 'Braided hairstyle';
            img.loading = 'lazy';

            const overlay = document.createElement('div');
            overlay.className = 'gallery-item-overlay';
            
            const title = document.createElement('h4');
            title.className = 'gallery-item-title';
            title.textContent = imgData.title || 'Hairstyle';
            
            const categoryLabel = document.createElement('p');
            categoryLabel.className = 'gallery-item-category';
            categoryLabel.textContent = formatCategory(imgData.category);

            overlay.appendChild(title);
            overlay.appendChild(categoryLabel);
            wrapper.appendChild(img);
            wrapper.appendChild(overlay);
            galleryGrid.appendChild(wrapper);
        });
    }

    function formatCategory(category) {
        const categoryNames = {
            'cornrows': 'Cornrows',
            'box-braids': 'Box Braids',
            'creative': 'Creative Styles',
            'process': 'Process & Care'
        };
        return categoryNames[category] || category;
    }

    function setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.dataset.category;
                renderGallery(category);
            });
        });
    }

    function setupLightbox() {
        const lightboxModal = document.getElementById('lightbox-modal');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const lightboxContainer = document.querySelector('.lightbox-image-container');
        const closeBtn = document.querySelector('.lightbox-close');
        const prevBtn = document.querySelector('.lightbox-prev');
        const nextBtn = document.querySelector('.lightbox-next');
        
        // Check if all required elements exist
        if (!lightboxModal || !lightboxImage || !lightboxCaption) {
            console.error('Lightbox elements not found');
            return;
        }

        if (!lightboxContainer) {
            console.error('Lightbox container not found');
            return;
        }
        
        // Zoom controls
        const zoomInBtn = document.querySelector('.zoom-in');
        const zoomOutBtn = document.querySelector('.zoom-out');
        const zoomResetBtn = document.querySelector('.zoom-reset');
        const zoomLevelDisplay = document.querySelector('.zoom-level');
        
        // Image info
        const imageStyleDisplay = document.getElementById('image-style');
        const imageCategoryDisplay = document.getElementById('image-category');
        
        let currentZoom = 1;
        let isDragging = false;
        let startX, startY, initialX, initialY;
        const minZoom = 0.5;
        const maxZoom = 3;
        const zoomStep = 0.25;

        function openLightbox(index) {
            if (index < 0 || index >= galleryImages.length) {
                return;
            }
            
            currentLightboxIndex = index;
            updateLightboxContent();
            resetZoom();
            lightboxModal.classList.add('show');
            lightboxModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightboxModal.classList.remove('show');
            lightboxModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            resetZoom();
        }

        function updateLightboxContent() {
            const imgData = galleryImages[currentLightboxIndex];
            
            if (!imgData) {
                return;
            }
            
            lightboxImage.src = `images/${imgData.filename}`;
            lightboxCaption.textContent = imgData.title || 'Hairstyle';
            
            // Update image info
            if (imageStyleDisplay) {
                imageStyleDisplay.textContent = imgData.title || 'N/A';
            }
            if (imageCategoryDisplay) {
                imageCategoryDisplay.textContent = formatCategory(imgData.category) || 'N/A';
            }
        }

        function showNext() {
            currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
            updateLightboxContent();
            resetZoom();
        }

        function showPrev() {
            currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
            updateLightboxContent();
            resetZoom();
        }

        function updateZoom() {
            lightboxImage.style.transform = `scale(${currentZoom})`;
            zoomLevelDisplay.textContent = `${Math.round(currentZoom * 100)}%`;
            
            // Enable/disable zoom buttons
            zoomOutBtn.disabled = currentZoom <= minZoom;
            zoomInBtn.disabled = currentZoom >= maxZoom;
            
            // Update cursor based on zoom level
            if (currentZoom > 1) {
                lightboxContainer.style.cursor = 'grab';
            } else {
                lightboxContainer.style.cursor = 'default';
            }
        }

        function zoomIn() {
            if (currentZoom < maxZoom) {
                currentZoom = Math.min(currentZoom + zoomStep, maxZoom);
                updateZoom();
            }
        }

        function zoomOut() {
            if (currentZoom > minZoom) {
                currentZoom = Math.max(currentZoom - zoomStep, minZoom);
                updateZoom();
            }
        }

        function resetZoom() {
            currentZoom = 1;
            lightboxImage.style.transform = 'translate(0, 0) scale(1)';
            updateZoom();
        }

        // Drag functionality
        function startDrag(e) {
            if (currentZoom <= 1) return;
            
            isDragging = true;
            lightboxContainer.classList.add('dragging');
            
            if (e.type === 'touchstart') {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            } else {
                startX = e.clientX;
                startY = e.clientY;
            }
            
            const transform = lightboxImage.style.transform;
            const translateMatch = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
            if (translateMatch) {
                initialX = parseFloat(translateMatch[1]);
                initialY = parseFloat(translateMatch[2]);
            } else {
                initialX = 0;
                initialY = 0;
            }
        }

        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            
            let clientX, clientY;
            if (e.type === 'touchmove') {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            
            const deltaX = clientX - startX;
            const deltaY = clientY - startY;
            
            const newX = initialX + deltaX;
            const newY = initialY + deltaY;
            
            lightboxImage.style.transform = `translate(${newX}px, ${newY}px) scale(${currentZoom})`;
        }

        function endDrag() {
            isDragging = false;
            lightboxContainer.classList.remove('dragging');
        }

        // Click on gallery items
        galleryGrid.addEventListener('click', (e) => {
            const item = e.target.closest('.gallery-item');
            if (item) {
                const index = parseInt(item.dataset.index);
                if (!isNaN(index) && index >= 0 && index < galleryImages.length) {
                    openLightbox(index);
                }
            }
        });

        // Keyboard support for gallery items
        galleryGrid.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const item = e.target.closest('.gallery-item');
                if (item) {
                    e.preventDefault();
                    const index = parseInt(item.dataset.index);
                    if (!isNaN(index)) {
                        openLightbox(index);
                    }
                }
            }
        });

        // Close button
        closeBtn.addEventListener('click', closeLightbox);

        // Navigation buttons
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showNext();
        });
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrev();
        });

        // Zoom controls
        if (zoomInBtn) zoomInBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            zoomIn();
        });
        if (zoomOutBtn) zoomOutBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            zoomOut();
        });
        if (zoomResetBtn) zoomResetBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            resetZoom();
        });

        // Mouse wheel zoom
        lightboxContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                zoomIn();
            } else {
                zoomOut();
            }
        });

        // Drag events
        lightboxContainer.addEventListener('mousedown', startDrag);
        lightboxContainer.addEventListener('mousemove', drag);
        lightboxContainer.addEventListener('mouseup', endDrag);
        lightboxContainer.addEventListener('mouseleave', endDrag);
        
        // Touch events for mobile
        lightboxContainer.addEventListener('touchstart', startDrag);
        lightboxContainer.addEventListener('touchmove', drag);
        lightboxContainer.addEventListener('touchend', endDrag);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightboxModal.classList.contains('show')) return;
            
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === '+' || e.key === '=') zoomIn();
            if (e.key === '-' || e.key === '_') zoomOut();
            if (e.key === '0') resetZoom();
        });

        // Click outside to close
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });
    }

    loadGallery();

    // set current year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // (Removed directional press handlers to keep buttons simple and reliable)
});

// Service card click opens a modal with more details
(function () {
    const cards = document.querySelectorAll('.service-card');
    if (!cards || !cards.length) return;

    const serviceModal = document.getElementById('service-modal');
    const modalTitle = document.getElementById('service-modal-title');
    const modalDetails = document.getElementById('service-modal-details');
    const modalClose = serviceModal.querySelector('.lightbox-close');

    function openModal(card) {
        const titleEl = card.querySelector('.service-title');
        const title = titleEl ? titleEl.textContent.trim() : '';
        const details = card.getAttribute('data-details') || '';
        modalTitle.textContent = title;
        modalDetails.textContent = details;
        serviceModal.classList.add('show');
        serviceModal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
        serviceModal.classList.remove('show');
        serviceModal.setAttribute('aria-hidden', 'true');
    }

    cards.forEach(card => {
        // Open modal on click (except when clicking a book button inside the card)
        card.addEventListener('click', (e) => {
            if (e.target.closest('.book-button')) return; // let booking handle its own click
            openModal(card);
        });
        // Keyboard accessibility (Enter or Space triggers modal)
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (e.target.closest('.book-button')) return;
                openModal(card);
            }
        });
    });

    // Close modal via close button or Escape key
    modalClose.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && serviceModal.classList.contains('show')) {
            closeModal();
        }
    });
})();
(function () {
    const cards = document.querySelectorAll('.service-card');
    if (!cards || !cards.length) return;

    cards.forEach(card => {
        // prepare expanded container
        const detailsText = card.getAttribute('data-details') || '';
        const metaText = card.querySelector('.service-meta') ? card.querySelector('.service-meta').textContent : '';

        const expanded = document.createElement('div');
        expanded.className = 'service-expanded';
        expanded.innerHTML = `
            <div class="expanded-inner">
                <p class="expanded-desc">${detailsText}</p>
                <div class="expanded-meta">${metaText}</div>
                <div class="expanded-actions">
                    <button class="book-button" type="button">Book</button>
                    <button class="collapse-button" type="button" aria-label="Close details">Close</button>
                </div>
            </div>
        `;

        card.appendChild(expanded);
        card.setAttribute('aria-expanded', 'false');

        function open() {
            // collapse any other expanded cards
            document.querySelectorAll('.service-card.expanded').forEach(other => {
                if (other === card) return;
                other.classList.remove('expanded');
                other.setAttribute('aria-expanded', 'false');
                const otherExpanded = other.querySelector('.service-expanded');
                if (otherExpanded) otherExpanded.style.display = 'none';
            });

            card.classList.add('expanded');
            card.setAttribute('aria-expanded', 'true');
            expanded.style.display = 'block';
            // scroll into view a bit
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        function close() {
            card.classList.remove('expanded');
            card.setAttribute('aria-expanded', 'false');
            expanded.style.display = 'none';
        }

        // click handler: toggle expansion unless clicking book link
        card.addEventListener('click', (e) => {
            if (e.target.closest('.book-button') || e.target.classList.contains('collapse-button')) return;
            const isExpanded = card.classList.contains('expanded');
            if (isExpanded) close(); else open();
        });

        // button handler to close
        expanded.querySelector('.collapse-button').addEventListener('click', (e) => {
            e.stopPropagation();
            close();
        });

        // keyboard support
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const isExpanded = card.classList.contains('expanded');
                if (isExpanded) close(); else open();
            }
            if (e.key === 'Escape' && card.classList.contains('expanded')) {
                close();
            }
        });

        // hide expanded by default
        expanded.style.display = 'none';
    });
})();

// Booking modal behavior: multi-step form with WhatsApp integration
document.addEventListener('DOMContentLoaded', function () {
    const bookingModal = document.getElementById('booking-modal');
    const bookingForm = document.getElementById('booking-form');
    if (!bookingModal || !bookingForm) return;

    let currentStep = 1;
    const totalSteps = 4;

    // Form elements
    const bookingService = document.getElementById('booking-service');
    const nameInput = document.getElementById('booking-name');
    const phoneInput = document.getElementById('booking-phone');
    const emailInput = document.getElementById('booking-email');
    const dateInput = document.getElementById('booking-date');
    const timeInput = document.getElementById('booking-time');
    const notesInput = document.getElementById('booking-notes');
    const errorP = document.getElementById('booking-error');

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    if (dateInput) dateInput.setAttribute('min', today);

    function openBooking(service) {
        currentStep = 1;
        bookingService.value = service || '';
        
        // Reset form
        nameInput.value = '';
        phoneInput.value = '';
        emailInput.value = '';
        dateInput.value = '';
        timeInput.value = '';
        notesInput.value = '';
        errorP.style.display = 'none';
        
        // Reset service selection
        document.querySelectorAll('input[name="service-option"]').forEach(radio => {
            radio.checked = false;
        });
        
        // Pre-select service if provided
        if (service) {
            const serviceRadio = document.querySelector(`input[name="service-option"][value="${service}"]`);
            if (serviceRadio) serviceRadio.checked = true;
        }
        
        // Reset time slots
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        // Show first step
        updateStepDisplay();
        bookingModal.classList.add('show');
        bookingModal.setAttribute('aria-hidden', 'false');
    }

    function closeBooking() {
        bookingModal.classList.remove('show');
        bookingModal.setAttribute('aria-hidden', 'true');
        currentStep = 1;
        updateStepDisplay();
    }

    function updateStepDisplay() {
        // Update progress indicator
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.remove('active', 'completed');
            if (stepNum === currentStep) {
                step.classList.add('active');
            } else if (stepNum < currentStep) {
                step.classList.add('completed');
            }
        });

        // Show/hide steps
        document.querySelectorAll('.booking-step').forEach((step, index) => {
            const stepNum = index + 1;
            if (stepNum === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Update next button state
        const nextButton = document.querySelector('.booking-step.active .next-step');
        if (nextButton) {
            nextButton.disabled = !validateCurrentStep();
        }
    }

    function validateCurrentStep() {
        switch (currentStep) {
            case 1:
                const serviceSelected = document.querySelector('input[name="service-option"]:checked') !== null;
                if (!serviceSelected) {
                    showError('Please select a service to continue.');
                }
                return serviceSelected;
            case 2:
                const dateFilled = dateInput.value.trim() !== '';
                const timeFilled = timeInput.value.trim() !== '';
                if (!dateFilled || !timeFilled) {
                    showError('Please select both a preferred date and time.');
                }
                return dateFilled && timeFilled;
            case 3:
                const nameFilled = nameInput.value.trim() !== '';
                const phoneFilled = phoneInput.value.trim() !== '';
                const consentGiven = document.getElementById('booking-consent').checked;
                
                if (!nameFilled) {
                    showError('Please enter your name.');
                } else if (!phoneFilled) {
                    showError('Please enter your WhatsApp phone number.');
                } else if (!consentGiven) {
                    showError('Please confirm you consent to be contacted via WhatsApp.');
                } else if (phoneInput.value.replace(/[^0-9]/g, '').length < 9) {
                    showError('Please enter a valid phone number (at least 9 digits).');
                }
                
                return nameFilled && phoneFilled && consentGiven;
            default:
                return true;
        }
    }

    function goToStep(step) {
        if (step < 1 || step > totalSteps) return;
        
        // Clear any existing errors when moving between steps
        errorP.style.display = 'none';
        
        // Validate current step before moving forward
        if (step > currentStep && !validateCurrentStep()) {
            return;
        }
        
        currentStep = step;
        updateStepDisplay();
        
        // If going to confirmation step, populate summary
        if (currentStep === 4) {
            populateSummary();
        }
    }

    function showError(message) {
        errorP.textContent = message;
        errorP.style.display = 'block';
    }

    function populateSummary() {
        const selectedService = document.querySelector('input[name="service-option"]:checked');
        const serviceValue = selectedService ? selectedService.value : bookingService.value;
        const servicePrice = selectedService ? selectedService.getAttribute('data-price') : '';
        
        document.getElementById('summary-service').textContent = serviceValue + (servicePrice ? ` (${servicePrice})` : '');
        
        const dateValue = dateInput.value;
        const timeValue = timeInput.value;
        let datetimeDisplay = '';
        if (dateValue) {
            const dateObj = new Date(dateValue);
            datetimeDisplay = dateObj.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
        }
        if (timeValue) {
            datetimeDisplay += ' at ' + timeValue;
        }
        document.getElementById('summary-datetime').textContent = datetimeDisplay || 'Not specified';
        
        document.getElementById('summary-name').textContent = nameInput.value || 'Not provided';
        document.getElementById('summary-phone').textContent = phoneInput.value || 'Not provided';
        
        const notesValue = notesInput.value.trim();
        const notesContainer = document.getElementById('summary-notes-container');
        if (notesValue) {
            notesContainer.style.display = 'flex';
            document.getElementById('summary-notes').textContent = notesValue;
        } else {
            notesContainer.style.display = 'none';
        }
    }

    function sendToWhatsApp() {
        const selectedService = document.querySelector('input[name="service-option"]:checked');
        const serviceValue = selectedService ? selectedService.value : bookingService.value;
        const servicePrice = selectedService ? selectedService.getAttribute('data-price') : '';
        
        const dateValue = dateInput.value;
        const timeValue = timeInput.value;
        let datetimeDisplay = '';
        if (dateValue) {
            const dateObj = new Date(dateValue);
            datetimeDisplay = dateObj.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
        }
        if (timeValue) {
            datetimeDisplay += ' at ' + timeValue;
        }
        
        let msg = `🌟 *New Booking Request* 🌟\n\n`;
        msg += `*Service:* ${serviceValue}\n`;
        if (servicePrice) msg += `*Price:* ${servicePrice}\n`;
        msg += `*Date & Time:* ${datetimeDisplay || 'Not specified'}\n\n`;
        msg += `*Client Details:*\n`;
        msg += `Name: ${nameInput.value}\n`;
        msg += `Phone: ${phoneInput.value}\n`;
        if (emailInput.value) msg += `Email: ${emailInput.value}\n`;
        if (notesInput.value.trim()) msg += `\n*Notes:* ${notesInput.value}\n`;
        
        // Use the WhatsApp number from the footer for consistency
        const businessNumber = '27650527770';
        const url = `https://wa.me/${businessNumber}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
        closeBooking();
    }

    // open modal when clicking any .book-button inside a service card
    document.addEventListener('click', (e) => {
        const btn = e.target.closest && e.target.closest('.book-button');
        if (!btn) return;
        // only handle book clicks that are inside a service card (leave header/footer anchors alone)
        const card = btn.closest('.service-card');
        if (!card) return;
        e.preventDefault();
        const service = card.querySelector('.service-title') ? card.querySelector('.service-title').textContent.trim() : '';
        openBooking(service);
    });

    // Simple directional press indicator: set data-press to left/right/center on pointerdown, clear on up
    (function simplePressDirection() {
        function onPointerDown(e) {
            const btn = e.target.closest && e.target.closest('.book-button');
            if (!btn || e.isPrimary === false) return;
            const r = btn.getBoundingClientRect();
            const x = e.clientX - r.left;
            const half = r.width / 2;
            if (x < half * 0.6) btn.setAttribute('data-press', 'left');
            else if (x > half * 1.4) btn.setAttribute('data-press', 'right');
            else btn.setAttribute('data-press', 'center');
        }
        function clearPress(e) {
            const btn = (e && e.target && e.target.closest) ? e.target.closest('.book-button') : null;
            // if pointerup fired on a different element, clear all book buttons
            if (!btn) {
                document.querySelectorAll('.book-button[data-press]').forEach(b => b.removeAttribute('data-press'));
                return;
            }
            btn.removeAttribute('data-press');
        }

        document.addEventListener('pointerdown', onPointerDown, { passive: true });
        document.addEventListener('pointerup', clearPress);
        document.addEventListener('pointercancel', clearPress);
        document.addEventListener('pointerleave', clearPress);

        // keyboard support: show center press on keydown and clear on keyup
        document.addEventListener('keydown', (ev) => {
            if (!(ev.key === ' ' || ev.key === 'Enter')) return;
            const el = document.activeElement;
            if (el && el.classList && el.classList.contains('book-button')) el.setAttribute('data-press', 'center');
        });
        document.addEventListener('keyup', (ev) => {
            if (!(ev.key === ' ' || ev.key === 'Enter')) return;
            const el = document.activeElement;
            if (el && el.classList && el.classList.contains('book-button')) el.removeAttribute('data-press');
        });
    })();

    // close handlers
    bookingModal.querySelectorAll('[data-booking-close]').forEach(btn => btn.addEventListener('click', closeBooking));

    // Step navigation
    document.querySelectorAll('.next-step').forEach(btn => {
        btn.addEventListener('click', () => goToStep(currentStep + 1));
    });

    document.querySelectorAll('.prev-step').forEach(btn => {
        btn.addEventListener('click', () => goToStep(currentStep - 1));
    });

    // Service selection
    document.querySelectorAll('input[name="service-option"]').forEach(radio => {
        radio.addEventListener('change', () => {
            updateStepDisplay();
        });
    });

    // Time slot selection
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.addEventListener('click', () => {
            document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            timeInput.value = slot.getAttribute('data-time');
            updateStepDisplay();
        });
    });

    // Form validation on input
    [dateInput, timeInput, nameInput, phoneInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => updateStepDisplay());
        }
    });

    // Confirm button
    const confirmButton = document.getElementById('booking-confirm');
    if (confirmButton) {
        confirmButton.addEventListener('click', sendToWhatsApp);
    }
});