document.addEventListener('DOMContentLoaded', () => {
    const shooter = document.getElementById('shooter');
    const target = document.getElementById('target');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const attemptsDisplay = document.getElementById('attempts');
    let score = 0;
    let attemptsLeft = parseInt(localStorage.getItem('attemptsLeft')) || 5;
    let gameTimer = 30;
    let timerInterval;

    // Сбрасываем количество попыток в начале нового дня
    const today = new Date().toDateString();
    if (localStorage.getItem('lastPlayedDate') !== today) {
        localStorage.setItem('lastPlayedDate', today);
        attemptsLeft = 5;
        localStorage.setItem('attemptsLeft', attemptsLeft);
    }

    // Обновляем отображение оставшихся попыток
    attemptsDisplay.textContent = `Attempts left: ${attemptsLeft}`;

    // Проверяем, есть ли доступные попытки
    if (attemptsLeft <= 0) {
        alert('No attempts left for today.');
        document.querySelector('.btn').click(); // Возвращаемся на главную страницу
        return;
    }

    // Сброс счета при загрузке страницы
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;

    // Устанавливаем таймер на 30 секунд
    timerDisplay.textContent = `Time: ${gameTimer}s`;
    timerInterval = setInterval(() => {
        gameTimer--;
        timerDisplay.textContent = `Time: ${gameTimer}s`;

        if (gameTimer <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);

    shooter.addEventListener('click', shoot);

    function shoot(event) {
        const bullet = document.createElement('div');
        bullet.classList.add('bullet');
        document.body.appendChild(bullet);

        const shooterRect = shooter.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const bulletRect = bullet.getBoundingClientRect();

        bullet.style.left = `${shooterRect.left + shooterRect.width / 2 - bulletRect.width / 2}px`;
        bullet.style.top = `${shooterRect.top - bulletRect.height}px`;

        const hitChance = Math.random() < 0.3; // 50% шанс попадания

        if (hitChance) {
            const targetX = targetRect.left + targetRect.width / 2;
            const targetY = targetRect.top + targetRect.height / 2;

            const bulletX = bulletRect.left + bulletRect.width / 2;
            const bulletY = bulletRect.top + bulletRect.height / 2;

            const deltaX = targetX - bulletX;
            const deltaY = targetY - bulletY;
            const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

            const speed = 500; // pixels per second
            const duration = distance / speed;

            bullet.style.transition = `all ${duration}s linear`;
            bullet.style.left = `${targetX - bulletRect.width / 2}px`;
            bullet.style.top = `${targetY - bulletRect.height / 2}px`;

            setTimeout(() => {
                score += 10;
                scoreDisplay.textContent = `Score: ${score}`;

                // Обновляем общий счетчик кликов на главной странице
                let totalClicks = parseInt(localStorage.getItem('clicks')) || 0;
                totalClicks += 10;
                localStorage.setItem('clicks', totalClicks);

                bullet.remove();
            }, duration * 1000);
        } else {
            // Случайное позиционирование снаряда при промахе
            const gameContainer = document.querySelector('.game-container');
            const containerRect = gameContainer.getBoundingClientRect();

            const randomX = Math.random() * (containerRect.width - bulletRect.width);
            const randomY = Math.random() * (containerRect.height - bulletRect.height);

            bullet.style.left = `${randomX}px`;
            bullet.style.top = `${randomY}px`;

            // Удаляем снаряд через некоторое время
            setTimeout(() => {
                bullet.remove();
            }, 500);
        }
    }

    function endGame() {
        alert(`Game over! Your score: ${score}`);
        localStorage.setItem('gameScore', score);

        // Уменьшаем количество оставшихся попыток
        attemptsLeft--;
        localStorage.setItem('attemptsLeft', attemptsLeft);

        // Очищаем очки
        score = 0;
        localStorage.removeItem('gameScore');
        
        document.querySelector('.btn').click(); // Возвращаемся на главную страницу
    }
});
