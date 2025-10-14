document.addEventListener('DOMContentLoaded', function() {
    // Get or create a unique user ID
    function getUserId() {
        let userId = localStorage.getItem('phonefeed_userId');
        if (!userId) {
            // Generate a unique ID using timestamp and random number
            userId = Date.now().toString(36) + Math.random().toString(36).substring(2);
            localStorage.setItem('phonefeed_userId', userId);
        }
        return userId;
    }

    // Hash function to consistently map user ID to a number between 1-11
    function hashToImageNumber(userId) {
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            hash = ((hash << 5) - hash) + userId.charCodeAt(i);
            hash = hash & hash; // Convert to 32bit integer
        }
        // Map to 1-11 range
        return Math.abs(hash % 11) + 1;
    }

    // Get user ID and assigned image number
    const userId = getUserId();
    const imageNumber = hashToImageNumber(userId);
    const imagePath = `png/${imageNumber}.png`;

    console.log('User ID:', userId);
    console.log('Assigned Image:', imageNumber);

    // Set the unique user image at the bottom
    const userImage = document.getElementById('userImage');
    userImage.src = imagePath;
});
