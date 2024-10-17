// Selecteer HTML-elementen
const authSection = document.getElementById('auth-section');
const agendaSection = document.getElementById('agenda-section');
const adminSection = document.getElementById('admin-section');
const userSelect = document.getElementById('user-select');
const viewAccountBtn = document.getElementById('view-account-btn');
const selectedAccountSection = document.getElementById('selected-account');
const accountNameDisplay = document.getElementById('account-name');
const adminAgendaList = document.getElementById('admin-agenda-list');
const deleteTaskBtn = document.getElementById('delete-task-btn');

// Knoppen
const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');
const addEventBtn = document.getElementById('add-event-btn');
const logoutBtn = document.getElementById('logout-btn');
const adminLogoutBtn = document.getElementById('admin-logout-btn');

// Admin gegevens
const adminUsername = "admin";
const adminPassword = "admin123";

// Gebruiker opslaan in Local Storage met wachtwoord
function saveUser(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({ username, password, agenda: [] });
    localStorage.setItem('users', JSON.stringify(users));
}

// Gebruiker ophalen uit Local Storage
function getUser(username) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find(user => user.username === username);
}

// Gebruikersagenda ophalen
function getUserAgenda(username) {
    const user = getUser(username);
    return user ? user.agenda : [];
}

// Gebruikersagenda opslaan
function saveUserAgenda(username, agenda) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = users.map(user => {
        if (user.username === username) {
            return { ...user, agenda };
        }
        return user;
    });
    localStorage.setItem('users', JSON.stringify(updatedUsers));
}

// Inloggen functie
function login(username, password) {
    if (username === adminUsername && password === adminPassword) {
        authSection.classList.add('hidden');
        adminSection.classList.remove('hidden');
        loadUserSelect();
        return;
    }

    const user = getUser(username);
    if (user && user.password === password) {
        userNameDisplay.textContent = username;
        authSection.classList.add('hidden');
        agendaSection.classList.remove('hidden');
        displayAgenda(username);
    } else {
        authMessage.textContent = "Ongeldige gebruikersnaam of wachtwoord!";
    }
}

// Registreren functie
function register(username, password) {
    const user = getUser(username);
    if (user) {
        authMessage.textContent = "Gebruiker bestaat al!";
    } else {
        saveUser(username, password);
        authMessage.textContent = "Registratie geslaagd! Je kunt nu inloggen.";
    }
}

// Afspraken weergeven
function displayAgenda(username) {
    const agenda = getUserAgenda(username);
    agendaList.innerHTML = '';
    agenda.forEach((event, index) => {
        const li = document.createElement('li');
        li.classList.add('agenda-item');
        li.innerHTML = `${event.name} op ${event.date} <button class="delete-btn" data-index="${index}">Verwijderen</button>`;
        agendaList.appendChild(li);
    });
}

// Admin agenda weergeven
function displayAdminAgenda(username) {
    const agenda = getUserAgenda(username);
    adminAgendaList.innerHTML = '';
    agenda.forEach((event, index) => {
        const li = document.createElement('li');
        li.textContent = `${event.name} op ${event.date}`;
        adminAgendaList.appendChild(li);
    });
}

// Gebruikers laden in de select
function loadUserSelect() {
    userSelect.innerHTML = '';
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.forEach(user => {
        if (user.username !== adminUsername) {
            const option = document.createElement('option');
            option.value = user.username;
            option.textContent = user.username;
            userSelect.appendChild(option);
        }
    });
}

// Account bekijken
viewAccountBtn.addEventListener('click', () => {
    const selectedUsername = userSelect.value;
    accountNameDisplay.textContent = selectedUsername;
    displayAdminAgenda(selectedUsername);
    selectedAccountSection.classList.remove('hidden');
});

// Taak verwijderen
deleteTaskBtn.addEventListener('click', () => {
    const selectedUsername = userSelect.value;
    const agenda = getUserAgenda(selectedUsername);
    if (agenda.length > 0) {
        agenda.pop(); // Verwijdert de laatste taak als voorbeeld
        saveUserAgenda(selectedUsername, agenda);
        displayAdminAgenda(selectedUsername); // Verfris de agenda-weergave
    }
});

// Evenement toevoegen
addEventBtn.addEventListener('click', () => {
    const username = userNameDisplay.textContent;
    const eventName = eventNameInput.value;
    const eventDate = eventDateInput.value;

    if (eventName && eventDate) {
        const agenda = getUserAgenda(username);
        agenda.push({ name: eventName, date: eventDate });
        saveUserAgenda(username, agenda);
        displayAgenda(username);
        eventNameInput.value = '';
        eventDateInput.value = '';
    }
});

// Log out
logoutBtn.addEventListener('click', () => {
    authSection.classList.remove('hidden');
    agendaSection.classList.add('hidden');
});

adminLogoutBtn.addEventListener('click', () => {
    authSection.classList.remove('hidden');
    adminSection.classList.add('hidden');
});

// Event listeners voor registratie en login
registerBtn.addEventListener('click', () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    register(username, password);
});
loginBtn.addEventListener('click', () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    login(username, password);
});
