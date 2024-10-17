// Selecteer HTML-elementen
const authSection = document.getElementById('auth-section');
const agendaSection = document.getElementById('agenda-section');
const adminSection = document.getElementById('admin-section');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const authMessage = document.getElementById('auth-message');
const userNameDisplay = document.getElementById('user-name');
const agendaList = document.getElementById('agenda-list');
const eventNameInput = document.getElementById('event-name');
const eventDateInput = document.getElementById('event-date');
const adminAccountsList = document.getElementById('admin-accounts-list');
const adminAgendaList = document.getElementById('admin-agenda-list');
const adminViewHeader = document.getElementById('admin-view-header');
const adminAccountName = document.getElementById('admin-account-name');

// Knoppen
const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');
const addEventBtn = document.getElementById('add-event-btn');
const logoutBtn = document.getElementById('logout-btn');
const adminLogoutBtn = document.getElementById('admin-logout-btn');

// Admin gegevens
const adminUsername = "Adminestrator";
const adminPassword = "Admin";

// Gebruiker opslaan in een aparte JSON file
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
        displayAdminAccounts();
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

// Admin: Accounts weergeven
function displayAdminAccounts() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    adminAccountsList.innerHTML = '';
    users.forEach(user => {
        if (user.username !== adminUsername) {
            const li = document.createElement('li');
            li.classList.add('agenda-item');
            li.innerHTML = `${user.username} <button class="view-account-btn" data-username="${user.username}">Bekijk Planner</button>`;
            adminAccountsList.appendChild(li);
        }
    });
}

// Admin: Planner van geselecteerd account weergeven
function displayAdminAgenda(username) {
    const agenda = getUserAgenda(username);
    adminAgendaList.innerHTML = '';
    agenda.forEach((event, index) => {
        const li = document.createElement('li');
        li.classList.add('agenda-item');
        li.innerHTML = `${event.name} op ${event.date}`;
        adminAgendaList.appendChild(li);
    });
    adminViewHeader.classList.remove('hidden');
    adminAccountName.textContent = username;
    adminAgendaList.classList.remove('hidden');
}

// Event Listeners
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

addEventBtn.addEventListener('click', () => {
    const eventName = eventNameInput.value;
    const eventDate = eventDateInput.value;
    const username = userNameDisplay.textContent;
    if (eventName && eventDate) {
        const agenda = getUserAgenda(username);
        agenda.push({ name: eventName, date: eventDate });
        saveUserAgenda(username, agenda);
        displayAgenda(username);
    }
});

logoutBtn.addEventListener('click', () => {
    authSection.classList.remove('hidden');
    agendaSection.classList.add('hidden');
    usernameInput.value = '';
    passwordInput.value = '';
});

adminLogoutBtn.addEventListener('click', () => {
    authSection.classList.remove('hidden');
    adminSection.classList.add('hidden');
    adminViewHeader.classList.add('hidden');
    adminAgendaList.classList.add('hidden');
    usernameInput.value = '';
    passwordInput.value = '';
});

// Admin: Event listener voor account bekijken
adminAccountsList.addEventListener('click', (e) => {
    if (e.target.classList.contains('view-account-btn')) {
        const username = e.target.getAttribute('data-username');
        displayAdminAgenda(username);
    }
});

// Event Listener voor verwijderen van event
agendaList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const index = e.target.getAttribute('data-index');
        const username = userNameDisplay.textContent;
        const agenda = getUserAgenda(username);
        agenda.splice(index, 1);
        saveUserAgenda(username, agenda);
        displayAgenda(username);
    }
});
