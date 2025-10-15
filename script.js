document.addEventListener('DOMContentLoaded', async function () {
    // Firebase-based user assignment
    async function assignUserFromFirebase() {
        // Check if user already exists in localStorage
        let userId = localStorage.getItem('phonefeed_userId');
        let userNumber = localStorage.getItem('phonefeed_userNumber');

        if (userId && userNumber) {
            return {
                userId: userId,
                userNumber: parseInt(userNumber)
            };
        }

        // New user - get assignment from Firebase
        try {
            const counterRef = db.collection('counters').doc('userCounter');

            // Use Firestore transaction to atomically increment the counter
            const result = await db.runTransaction(async (transaction) => {
                const counterDoc = await transaction.get(counterRef);

                let newCount;
                if (!counterDoc.exists) {
                    // Initialize counter if it doesn't exist
                    newCount = 1;
                    transaction.set(counterRef, { count: newCount });
                } else {
                    // Increment the counter
                    newCount = counterDoc.data().count + 1;
                    transaction.update(counterRef, { count: newCount });
                }

                // Calculate image number (cycles through 1-12)
                const imageNumber = ((newCount - 1) % 12) + 1;

                return {
                    userId: 'user-' + newCount,
                    userNumber: imageNumber,
                    totalCount: newCount
                };
            });

            // Save to localStorage for future visits
            localStorage.setItem('phonefeed_userId', result.userId);
            localStorage.setItem('phonefeed_userNumber', result.userNumber.toString());

            console.log('New user assigned from Firebase:', result);
            return result;

        } catch (error) {
            console.error('Error assigning user from Firebase:', error);

            // Fallback to localStorage if Firebase fails
            console.log('Falling back to localStorage');
            let userCount = parseInt(localStorage.getItem('phonefeed_userCount') || '0') + 1;
            let fallbackUserId = 'user-' + userCount;
            let fallbackUserNumber = ((userCount - 1) % 12) + 1;

            localStorage.setItem('phonefeed_userId', fallbackUserId);
            localStorage.setItem('phonefeed_userNumber', fallbackUserNumber.toString());
            localStorage.setItem('phonefeed_userCount', userCount.toString());

            return {
                userId: fallbackUserId,
                userNumber: fallbackUserNumber
            };
        }
    }

    // Get user assignment
    const userAssignment = await assignUserFromFirebase();
    const userId = userAssignment.userId;
    const imageNumber = userAssignment.userNumber;
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
