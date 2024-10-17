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
const accountSelect = document.getElementById('account-select');
const adminHeader = document.getElementById('admin-header');
const adminAccountName = document.getElementById('admin-account-name');

// Knoppen
const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');
const addEventBtn = document.getElementById('add-event-btn');
const logoutBtn = document.getElementById('logout-btn');
const adminLogoutBtn = document.getElementById('admin-logout-btn');

// Admin gegevens
const adminUsername = "Admin";
const adminPassword = "Admin123";

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
        populateAccountSelect();
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
        li.innerHTML = `${event.name} op ${event.date}`;
        adminAgendaList.appendChild(li);
    });
}

// Admin kan accounts selecteren
function populateAccountSelect() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    accountSelect.innerHTML = '';
    users.forEach(user => {
        if (user.username !== adminUsername) {
            const option = document.createElement('option');
            option.value = user.username;
            option.textContent = user.username;
            accountSelect.appendChild(option);
        }
    });

    accountSelect.addEventListener('change', (e) => {
        const selectedUser = e.target.value;
        adminHeader.classList.remove('hidden');
        adminAccountName.textContent = `Account: ${selectedUser}`;
        displayAdminAgenda(selectedUser);
    });
}

// Event Listener voor registratie
registerBtn.addEventListener('click', () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    if (username && password) {
        register(username, password);
    } else {
        authMessage.textContent = 'Vul alstublieft beide velden in!';
    }
});

// Event Listener voor inloggen
loginBtn.addEventListener('click', () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    if (username && password) {
        login(username, password);
    } else {
        authMessage.textContent = 'Vul alstublieft beide velden in!';
    }
});

// Event Listener voor toevoegen van event
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
    } else {
        authMessage.textContent = 'Vul alstublieft beide velden in!';
    }
});

// Event Listener voor uitloggen
logoutBtn.addEventListener('click', () => {
    agendaSection.classList.add('hidden');
    authSection.classList.remove('hidden');
    usernameInput.value = '';
    passwordInput.value = '';
    userNameDisplay.textContent = '';
});

// Event Listener voor admin uitloggen
adminLogoutBtn.addEventListener('click', () => {
    adminSection.classList.add('hidden');
    authSection.classList.remove('hidden');
    usernameInput.value = '';
    passwordInput.value = '';
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
