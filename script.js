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
        // Use absolute value and modulo, then add 1 to get range 1-11
        const imageNum = (Math.abs(hash) % 11) + 1;
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
});
