document.addEventListener('DOMContentLoaded', () => {
    // Selecteer HTML-elementen
    const startPage = document.getElementById('start-page');
    const authSection = document.getElementById('auth-section');
    const agendaSection = document.getElementById('agenda-section');
    const adminSection = document.getElementById('admin-section');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const authMessage = document.getElementById('auth-message');
    const userNameDisplay = document.getElementById('user-name');
    const adminHeader = document.getElementById('admin-header');
    const agendaList = document.getElementById('agenda-list');
    const eventNameInput = document.getElementById('event-name');
    const eventDateInput = document.getElementById('event-date');
    const adminAgendaList = document.getElementById('admin-agenda-list');

    // Knoppen
    const registerBtn = document.getElementById('register-btn');
    const loginBtn = document.getElementById('login-btn');
    const confirmRegisterBtn = document.getElementById('confirm-register-btn');
    const confirmLoginBtn = document.getElementById('confirm-login-btn');
    const addEventBtn = document.getElementById('add-event-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const adminLogoutBtn = document.getElementById('admin-logout-btn');

    // Admin gegevens
    const adminUsername = "Administrator";
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
            startPage.classList.add('hidden');
            adminSection.classList.remove('hidden');
            displayAdminAccounts();
            return;
        }

        const user = getUser(username);
        if (user && user.password === password) {
            userNameDisplay.textContent = username;
            authSection.classList.add('hidden');
            startPage.classList.add('hidden');
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

    // Admin accounts weergeven
    function displayAdminAccounts() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        adminAgendaList.innerHTML = '';
        users.forEach(user => {
            if (user.username !== adminUsername) {
                const li = document.createElement('li');
                li.innerHTML = `${user.username} <button class="select-account-btn" data-username="${user.username}">Selecteer</button>`;
                adminAgendaList.appendChild(li);
            }
        });
    }

    // Admin account selecteren
    adminAgendaList.addEventListener('click', (e) => {
        if (e.target.classList.contains('select-account-btn')) {
            const selectedUser = e.target.getAttribute('data-username');
            adminHeader.textContent = `Admin weergave: ${selectedUser}`;
            displayAgenda(selectedUser); // Weergave van geselecteerde agenda
        }
    });

    // Verwijder event
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

    // Knop functies
    registerBtn.addEventListener('click', () => {
        authSection.classList.remove('hidden');
        startPage.classList.add('hidden');
        confirmRegisterBtn.classList.remove('hidden');
        confirmLoginBtn.classList.add('hidden');
    });

    loginBtn.addEventListener('click', () => {
        authSection.classList.remove('hidden');
        startPage.classList.add('hidden');
        confirmRegisterBtn.classList.add('hidden');
        confirmLoginBtn.classList.remove('hidden');
    });

    confirmRegisterBtn.addEventListener('click', () => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        register(username, password);
        usernameInput.value = '';
        passwordInput.value = '';
    });

    confirmLoginBtn.addEventListener('click', () => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        login(username, password);
        usernameInput.value = '';
        passwordInput.value = '';
    });

    addEventBtn.addEventListener('click', () => {
        const username = userNameDisplay.textContent;
        const eventName = eventNameInput.value;
        const eventDate = eventDateInput.value;
        const agenda = getUserAgenda(username);
        agenda.push({ name: eventName, date: eventDate });
        saveUserAgenda(username, agenda);
        displayAgenda(username);
        eventNameInput.value = '';
        eventDateInput.value = '';
    });

    // Uitloggen functie
    logoutBtn.addEventListener('click', () => {
        authSection.classList.remove('hidden');
        agendaSection.classList.add('hidden');
        startPage.classList.remove('hidden');
        usernameInput.value = '';
        passwordInput.value = '';
    });

    // Admin uitloggen functie
    adminLogoutBtn.addEventListener('click', () => {
        authSection.classList.remove('hidden');
        adminSection.classList.add('hidden');
        startPage.classList.remove('hidden');
    });
});
