document.addEventListener('DOMContentLoaded', function() {
    // Get or create a unique user ID
    function getUserId() {
        let userId = localStorage.getItem('phonefeed_userId');
        if (!userId) {
            // Generate a unique ID with better randomness
            const randomPart = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
            const timePart = Date.now().toString(36);
            userId = timePart + '-' + randomPart;
            localStorage.setItem('phonefeed_userId', userId);
        }
        return userId;
    }

    // Improved hash function for better distribution
    function hashToImageNumber(userId) {
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            const char = userId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        // Use absolute value and modulo, then add 1 to get range 1-12
        const imageNum = (Math.abs(hash) % 12) + 1;
        return imageNum;
    }

    // Get user ID and assigned image number
    const userId = getUserId();
    const imageNumber = hashToImageNumber(userId);
    const imagePath = `png/${imageNumber}.png`;

    console.log('User ID:', userId);
    console.log('Assigned Image:', imageNumber);
    console.log('Image Path:', imagePath);

    // Set the unique user image at the bottom
    const userImage = document.getElementById('userImage');
    userImage.src = imagePath;

    // Animated gradient overlay on scroll
    function handleGradientAnimation() {
        const imageWrappers = document.querySelectorAll('.image-wrapper');
        const windowHeight = window.innerHeight;

        imageWrappers.forEach((wrapper) => {
            const rect = wrapper.getBoundingClientRect();
            const gradientOverlay = wrapper.querySelector('.gradient-overlay');

            // Calculate how far the image is from the bottom of the viewport
            // When the bottom of the image is near the bottom of viewport, fade out gradient
            const distanceFromBottom = windowHeight - rect.bottom;
            const imageHeight = rect.height;

            // Start fading when the bottom 30% of the image is visible
            const fadeStartPoint = imageHeight * 0.3;

            if (distanceFromBottom > -fadeStartPoint && rect.top < windowHeight) {
                // Calculate fade progress (0 to 1)
                const fadeProgress = Math.min(Math.max((distanceFromBottom + fadeStartPoint) / (fadeStartPoint * 2), 0), 1);
                gradientOverlay.style.opacity = 1 - fadeProgress;
            } else if (rect.bottom < windowHeight * 0.5) {
                // Fully fade out when scrolled past
                gradientOverlay.style.opacity = 0;
            } else {
                // Fully visible when not near viewport bottom
                gradientOverlay.style.opacity = 1;
            }
        });
    }

    // Run on scroll with throttling for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleGradientAnimation();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Run once on load
    handleGradientAnimation();
});
