document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Dynamic gallery rendering from images folder list (most recent first)
    const galleryImages = [
        'WhatsApp Image 2025-11-07 at 18.58.38.jpeg',
        'WhatsApp Image 2025-11-07 at 18.58.37 (2).jpeg',
        'WhatsApp Image 2025-11-07 at 18.58.37 (1).jpeg',
        'WhatsApp Image 2025-11-07 at 18.58.37.jpeg',
        'WhatsApp Image 2025-11-07 at 18.58.36 (2).jpeg',
        'WhatsApp Image 2025-11-07 at 18.58.36 (1).jpeg',
        'WhatsApp Image 2025-11-07 at 18.58.36.jpeg',
        'WhatsApp Image 2025-11-07 at 18.58.35 (4).jpeg',
        'WhatsApp Image 2025-11-07 at 18.58.35 (3).jpeg',
        'WhatsApp Image 2025-11-07 at 18.58.35 (2).jpeg',
        'WhatsApp Image 2025-11-07 at 18.58.35 (1).jpeg',
        'WhatsApp Image 2025-11-07 at 18.58.35.jpeg',
        'WhatsApp Image 2025-11-07 at 18.58.34 (1).jpeg',
        'WhatsApp Image 2025-11-07 at 18.58.34.jpeg',
        'WhatsApp Image 2025-11-07 at 18.58.33 (2).jpeg',
        'WhatsApp Image 2025-11-07 at 18.58.33 (1).jpeg',
        'WhatsApp Image 2025-11-07 at 18.58.33.jpeg',
        'WhatsApp Image 2025-11-07 at 18.58.32 (3).jpeg',
        'WhatsApp Image 2025-11-07 at 18.58.32 (2).jpeg',
        'WhatsApp Image 2025-11-07 at 18.58.32 (1).jpeg',
        'WhatsApp Image 2025-11-07 at 18.58.32.jpeg',
        'WhatsApp Image 2025-11-07 at 18.58.31 (2).jpeg',
        'WhatsApp Image 2025-11-07 at 18.58.31 (1).jpeg',
        'WhatsApp Image 2025-11-07 at 18.58.31.jpeg'
    ];

    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid) {
        galleryImages.forEach(filename => {
            const wrapper = document.createElement('div');
            wrapper.className = 'gallery-item';

            const img = document.createElement('img');
            img.src = `images/${filename}`;
            img.alt = 'Braided hairstyle';
            img.loading = 'lazy';

            wrapper.appendChild(img);
            galleryGrid.appendChild(wrapper);
        });
    }
});