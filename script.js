document.addEventListener('DOMContentLoaded', function () {
    // create unique user ID
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

    // Get or assign user number (all users get sequential numbers cycling 1-12)
    function getUserNumber() {
        let userNumber = localStorage.getItem('phonefeed_userNumber');

        if (!userNumber) {
            // Get the current user count from localStorage
            let userCount = parseInt(localStorage.getItem('phonefeed_userCount') || '0');

            // Increment the user count for this new user
            userCount++;
            localStorage.setItem('phonefeed_userCount', userCount.toString());

            // Assign image number based on user count (cycles through 1-12)
            // User 1 gets image 1, user 2 gets image 2, ..., user 13 gets image 1, etc.
            userNumber = ((userCount - 1) % 12) + 1;

            localStorage.setItem('phonefeed_userNumber', userNumber.toString());
        } else {
            userNumber = parseInt(userNumber);
        }

        return userNumber;
    }

    // Get user ID and assigned image number
    const userId = getUserId();
    const imageNumber = getUserNumber();
    const imagePath = `png/${imageNumber}.png`;

    console.log('User ID:', userId);
    console.log('Assigned Image:', imageNumber);
    console.log('Image Path:', imagePath);

    // Set the unique user image at the bottom
    const userImage = document.getElementById('userImage');
    userImage.src = imagePath;

    // Auto-scroll to bottom after user scrolls past half of first image
    let autoScrollTriggered = false;
    const firstImage = document.querySelector('.full-image');

    function smoothScrollTo(targetY, duration) {
        const startY = window.scrollY || window.pageYOffset;
        const distance = targetY - startY;
        const startTime = performance.now();

        function animation(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth acceleration/deceleration
            const easeInOutCubic = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            window.scrollTo(0, startY + distance * easeInOutCubic);

            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    function checkAutoScroll() {
        if (autoScrollTriggered || !firstImage) return;

        const firstImageHeight = firstImage.offsetHeight;
        const scrollPosition = window.scrollY || window.pageYOffset;

        // Check if user has scrolled past half the height of first image
        if (scrollPosition > firstImageHeight / 2) {
            autoScrollTriggered = true;
            // Scroll to bottom over 15 seconds (15000ms)
            smoothScrollTo(document.body.scrollHeight, 15000);
        }
    }

    window.addEventListener('scroll', checkAutoScroll);

});
