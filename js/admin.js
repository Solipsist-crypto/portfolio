document.addEventListener('DOMContentLoaded', () => {
    // Пароль для входу
    const SECRET_PASS = "8523146";

    // Автоперевірка доступу
    if (sessionStorage.getItem('isAdmin') !== 'true') {
        const userInput = prompt("Введіть пароль адміністратора:");

        if (userInput !== null && userInput.trim() === SECRET_PASS) {
            sessionStorage.setItem('isAdmin', 'true');
        } else {
            alert("Невірний пароль!");
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

    if (openDrawerBtn) openDrawerBtn.addEventListener('click', openDrawer);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
    if (adminOverlay) adminOverlay.addEventListener('click', closeDrawer);

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('isAdmin');
            window.location.href = 'index.html';
        });
    }

    // Перемикач вкладок
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetTab = document.getElementById(btn.getAttribute('data-tab'));
            if (targetTab) targetTab.classList.add('active');
        });
    });

    // Дефолтна дата
    const todayStr = new Date().toISOString().split('T')[0];
    const taskDateInput = document.getElementById('taskDateInput');
    const noteDateInput = document.getElementById('noteDateInput');
    if (taskDateInput) taskDateInput.value = todayStr;
    if (noteDateInput) noteDateInput.value = todayStr;

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }

    // --- Логіка Задач (To-Do) ---
    const taskInput = document.getElementById('newTaskInput');
    const taskList = document.getElementById('taskList');
    const addTaskBtn = document.getElementById('addTaskBtn');

    let tasks = JSON.parse(localStorage.getItem('adminTasks')) || [];

    function renderTasks() {
        if (!taskList) return;
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

    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            if (taskInput && taskInput.value.trim()) {
                tasks.push({
                    text: taskInput.value.trim(),
                    date: taskDateInput ? taskDateInput.value : todayStr,
                    completed: false
                });
                taskInput.value = '';
                renderTasks();
            }
        });
    }

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
    const notesList = document.getElementById('notesList');
    const addNoteBtn = document.getElementById('addNoteBtn');

    let notes = JSON.parse(localStorage.getItem('adminDatedNotes')) || [];

    function renderNotes() {
        if (!notesList) return;
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

    if (addNoteBtn) {
        addNoteBtn.addEventListener('click', () => {
            if (noteInput && noteInput.value.trim()) {
                notes.unshift({
                    text: noteInput.value.trim(),
                    date: noteDateInput ? noteDateInput.value : todayStr
                });
                noteInput.value = '';
                renderNotes();
            }
        });
    }

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