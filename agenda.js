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
const adminAgendaList = document.getElementById('admin-agenda-list');

// Knoppen
const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');
const addEventBtn = document.getElementById('add-event-btn');
const logoutBtn = document.getElementById('logout-btn');
const adminLogoutBtn = document.getElementById('admin-logout-btn');

// Admin gegevens
const adminUsername = "Adminestrator";
const adminPassword = "Admin";

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
        displayAdminAgenda();
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
function displayAdminAgenda() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    adminAgendaList.innerHTML = '';
    users.forEach(user => {
        if (user.username !== adminUsername) {
            const userAgenda = user.agenda.map(event => `${event.name} op ${event.date}`).join(', ');
            const li = document.createElement('li');
            li
