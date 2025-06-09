// Toggle favorite function
function toggleFavorite(bookId) {
    // Находим кнопку по data-book-id
    const btn = document.querySelector(`.toggle-favorite[data-book-id="${bookId}"]`);
    if (!btn) return;
    
    // Добавляем атрибут disabled, чтобы предотвратить множественные клики
    if (btn.disabled) return;
    btn.disabled = true;
    
    // Добавляем класс для визуальной индикации загрузки
    btn.classList.add('loading');
    
    fetch(`/toggle_favorite/${bookId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                // Перенаправляем на страницу входа, если пользователь не авторизован
                window.location.href = "/login";
                throw new Error('Please sign in first');
            }
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'added') {
            btn.innerHTML = `<i class="fas fa-heart" style="color: #ea4335;"></i> Remove from Favorites`;
            
            // Отображаем уведомление об успешном добавлении
            showNotification('success', 'Book added to favorites!');
            
            // Если мы на странице избранного, возможно, стоит обновить страницу
            if (window.location.pathname === '/favorites') {
                window.location.reload();
            }
        } else if (data.status === 'removed') {
            btn.innerHTML = `<i class="far fa-heart"></i> Add to Favorites`;
            
            // Отображаем уведомление об успешном удалении
            showNotification('success', 'Book removed from favorites!');
            
            // Если мы на странице избранного, удаляем карточку книги
            if (window.location.pathname === '/favorites') {
                const bookCard = btn.closest('.book-card');
                if (bookCard) {
                    bookCard.style.opacity = '0';
                    setTimeout(() => {
                        bookCard.remove();
                        
                        // Проверяем, не осталось ли книг
                        const remainingBooks = document.querySelectorAll('.book-card');
                        if (remainingBooks.length === 0) {
                            window.location.reload(); // Обновляем страницу, чтобы показать сообщение "No favorite books yet"
                        }
                    }, 300);
                }
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('error', error.message || 'An error occurred');
    })
    .finally(() => {
        // Разблокируем кнопку и убираем класс загрузки
        btn.disabled = false;
        btn.classList.remove('loading');
    });
}

// Функция для отображения уведомлений
function showNotification(type, message) {
    // Создаем контейнер для уведомлений, если его еще нет
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Добавляем иконку в зависимости от типа
    let icon = '';
    if (type === 'success') {
        icon = '<i class="fas fa-check-circle"></i>';
    } else if (type === 'error') {
        icon = '<i class="fas fa-exclamation-circle"></i>';
    } else {
        icon = '<i class="fas fa-info-circle"></i>';
    }
    
    // Устанавливаем содержимое
    notification.innerHTML = `${icon} ${message}`;
    
    // Добавляем в контейнер
    container.appendChild(notification);
    
    // Автоматически скрываем уведомление через 3 секунды
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
            
            // Если контейнер пуст, удаляем его
            if (container.children.length === 0) {
                container.remove();
            }
        }, 500);
    }, 3000);
}

// Функция для инициализации проверки статуса избранных книг
function initFavoriteButtons() {
    // Находим все кнопки с классом toggle-favorite
    const favoriteButtons = document.querySelectorAll('.toggle-favorite');
    
    // Проверяем статус избранных книг
    if (favoriteButtons.length > 0) {
        const bookIds = Array.from(favoriteButtons).map(btn => btn.dataset.bookId);
        
        fetch('/check_favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ book_ids: bookIds })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to check favorites status');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.favorites) {
                favoriteButtons.forEach(btn => {
                    const bookId = btn.dataset.bookId;
                    
                    if (data.favorites.includes(parseInt(bookId))) {
                        btn.innerHTML = `<i class="fas fa-heart" style="color: #ea4335;"></i> Remove from Favorites`;
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error checking favorites:', error);
            // Не блокируем интерфейс пользователя при ошибке, просто логируем проблему
        });
    }
}

// Инициализируем функциональность при загрузке документа
document.addEventListener('DOMContentLoaded', function() {
    // Автоматически скрываем уведомления
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(notification => {
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    });
    
    // Инициализируем кнопки избранного
    initFavoriteButtons();
    
    // Добавляем обработчики событий для кнопок избранного
    const favoriteButtons = document.querySelectorAll('.toggle-favorite');
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const bookId = this.dataset.bookId;
            toggleFavorite(bookId);
        });
    });

    // Fix for Edit Book buttons - make sure they navigate directly
    const editButtons = document.querySelectorAll('.edit-book-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Prevent default to avoid any conflict
            e.preventDefault();
            // Navigate directly to the href
            window.location.href = this.getAttribute('href');
        });
    });
}); 