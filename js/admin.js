document.addEventListener('DOMContentLoaded', async () => {
    // SHA-256 хеш для пароля 8523146
    const PASS_HASH = "5ca3c4bc1619808a9ec3848b7a635bcbd25ed1e8a8ea1eef7dbcf9efd01ee7c9";

    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Автоперевірка доступу
    if (sessionStorage.getItem('isAdmin') !== 'true') {
        const userInput = prompt("Введіть пароль адміністратора:");

        if (userInput) {
            const inputHash = await hashPassword(userInput.trim());
            if (inputHash === PASS_HASH) {
                sessionStorage.setItem('isAdmin', 'true');
            } else {
                alert("Невірний пароль!");
                window.location.href = 'index.html';
                return;
            }
        } else {
            window.location.href = 'index.html';
            return;
        }
    }

    // Елементи інтерфейсу
    const adminDrawer = document.getElementById('adminDrawer');
    const adminOverlay = document.getElementById('adminOverlay');
    const openDrawerBtn = document.getElementById('openDrawerBtn');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    function openDrawer() {
        adminDrawer.classList.add('open');
        adminOverlay.classList.add('open');
    }

    function closeDrawer() {
        adminDrawer.classList.remove('open');
        adminOverlay.classList.remove('open');
    }

    openDrawerBtn.addEventListener('click', openDrawer);
    closeDrawerBtn.addEventListener('click', closeDrawer);
    adminOverlay.addEventListener('click', closeDrawer);

    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('isAdmin');
        window.location.href = 'index.html';
    });

    // Перемикач вкладок
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(btn.getAttribute('data-tab')).classList.add('active');
        });
    });

    // Дефолтна дата
    const todayStr = new Date().toISOString().split('T')[0];
    document.getElementById('taskDateInput').value = todayStr;
    document.getElementById('noteDateInput').value = todayStr;

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }

    // --- Логіка Задач (To-Do) ---
    const taskInput = document.getElementById('newTaskInput');
    const taskDateInput = document.getElementById('taskDateInput');
    const taskList = document.getElementById('taskList');
    const addTaskBtn = document.getElementById('addTaskBtn');

    let tasks = JSON.parse(localStorage.getItem('adminTasks')) || [];

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `item-card ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <div class="item-info">
                    <span class="item-title">${task.text}</span>
                    ${task.date ? `<span class="item-date"><i class="far fa-calendar-alt"></i> Дедлайн: ${formatDate(task.date)}</span>` : ''}
                </div>
                <div class="item-actions">
                    <i class="fas fa-check" onclick="toggleTask(${index})" title="Виконано"></i>
                    <i class="fas fa-pen" onclick="editTask(${index})" title="Редагувати"></i>
                    <i class="fas fa-trash" onclick="deleteTask(${index})" title="Видалити"></i>
                </div>
            `;
            taskList.appendChild(li);
        });
        localStorage.setItem('adminTasks', JSON.stringify(tasks));
    }

    addTaskBtn.addEventListener('click', () => {
        if (taskInput.value.trim()) {
            tasks.push({
                text: taskInput.value.trim(),
                date: taskDateInput.value,
                completed: false
            });
            taskInput.value = '';
            renderTasks();
        }
    });

    window.toggleTask = function(index) {
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
    };

    window.deleteTask = function(index) {
        tasks.splice(index, 1);
        renderTasks();
    };

    window.editTask = function(index) {
        const currentText = tasks[index].text;
        const newText = prompt("Редагувати задачу:", currentText);
        if (newText !== null && newText.trim() !== "") {
            tasks[index].text = newText.trim();
            renderTasks();
        }
    };

    // --- Логіка Нотаток та Фінансів ---
    const noteInput = document.getElementById('newNoteInput');
    const noteDateInput = document.getElementById('noteDateInput');
    const notesList = document.getElementById('notesList');
    const addNoteBtn = document.getElementById('addNoteBtn');

    let notes = JSON.parse(localStorage.getItem('adminDatedNotes')) || [];

    function renderNotes() {
        notesList.innerHTML = '';
        notes.forEach((note, index) => {
            const div = document.createElement('div');
            div.className = 'item-card';
            div.innerHTML = `
                <div class="item-info">
                    <span class="item-title">${note.text}</span>
                    <span class="item-date"><i class="far fa-clock"></i> ${formatDate(note.date)}</span>
                </div>
                <div class="item-actions">
                    <i class="fas fa-pen" onclick="editNote(${index})" title="Редагувати"></i>
                    <i class="fas fa-trash" onclick="deleteNote(${index})" title="Видалити"></i>
                </div>
            `;
            notesList.appendChild(div);
        });
        localStorage.setItem('adminDatedNotes', JSON.stringify(notes));
    }

    addNoteBtn.addEventListener('click', () => {
        if (noteInput.value.trim()) {
            notes.unshift({
                text: noteInput.value.trim(),
                date: noteDateInput.value
            });
            noteInput.value = '';
            renderNotes();
        }
    });

    window.deleteNote = function(index) {
        notes.splice(index, 1);
        renderNotes();
    };

    window.editNote = function(index) {
        const currentText = notes[index].text;
        const newText = prompt("Редагувати запис:", currentText);
        if (newText !== null && newText.trim() !== "") {
            notes[index].text = newText.trim();
            renderNotes();
        }
    };

    renderTasks();
    renderNotes();
});