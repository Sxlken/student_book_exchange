// Function to check for unread messages
function checkUnreadMessages() {
    // Only check if user is logged in (check for message badge element)
    const messageBadge = document.querySelector('.message-badge-container');
    if (!messageBadge) return;

    fetch('/get_unread_count')
        .then(response => response.json())
        .then(data => {
            const count = data.unread_count;
            if (count > 0) {
                messageBadge.setAttribute('data-count', count);
                messageBadge.classList.add('badge');
            } else {
                messageBadge.removeAttribute('data-count');
                messageBadge.classList.remove('badge');
            }
        })
        .catch(error => {
            console.error('Error checking unread messages:', error);
        });
}

// Check for new messages every 30 seconds
document.addEventListener('DOMContentLoaded', function() {
    // Initial check
    checkUnreadMessages();
    
    // Set interval for checking
    setInterval(checkUnreadMessages, 30000);
});

function updateUnreadMessageCount() {
    fetch('/get_unread_count')
        .then(response => response.json())
        .then(data => {
            const badge = document.getElementById('unread-messages-count');
            if (!badge) return;
            if (data.unread_count > 0) {
                badge.textContent = data.unread_count;
                badge.style.display = 'inline-block';
                badge.classList.add('message-badge');
            } else {
                badge.style.display = 'none';
                badge.textContent = '';
                badge.classList.remove('message-badge');
            }
        })
        .catch(error => console.error('Error fetching unread message count:', error));
}

// Check for new messages every 30 seconds
document.addEventListener('DOMContentLoaded', function() {
    updateUnreadMessageCount();
    setInterval(updateUnreadMessageCount, 30000);
}); 