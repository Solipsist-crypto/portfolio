document.addEventListener('DOMContentLoaded', () => {
    // 1. Плавна прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 2. Анімація лічильників статистики
    const statCards = document.querySelectorAll('.stat-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const number = entry.target.querySelector('.stat-num');
                const target = parseInt(number.getAttribute('data-target'));
                let count = 0;
                const speed = target / 40;

                const updateCount = () => {
                    count += speed;
                    if (count < target) {
                        number.innerText = Math.ceil(count);
                        setTimeout(updateCount, 30);
                    } else {
                        number.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statCards.forEach(card => observer.observe(card));
});

// 5. Admin Panel Login Logic
const adminBtn = document.getElementById('adminBtn');

if (adminBtn) {
    adminBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Вкажи свій пароль тут:
        const SECRET_PASS = "8523146"; // Зміни на свій надійний пароль
        
        const userInput = prompt("Введіть пароль адміністратора:");
        
        if (userInput === SECRET_PASS) {
            // Зберігаємо сесію, щоб адмінка знала, що вхід успішний
            sessionStorage.setItem('isAdmin', 'true');
            window.location.href = 'admin.html';
        } else if (userInput !== null) {
            alert("Невірний пароль!");
        }
    });
}