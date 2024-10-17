// Selecteer HTML-elementen
const authSection = document.getElementById('auth-section');
const agendaSection = document.getElementById('agenda-section');
const usernameInput = document.getElementById('username');
const authMessage = document.getElementById('auth-message');
const userNameDisplay = document.getElementById('user-name');
const agendaList = document.getElementById('agenda-list');
const eventNameInput = document.getElementById('event-name');
const eventDateInput = document.getElementById('event-date');

// Knoppen
const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');
const addEventBtn = document.getElementById('add-event-btn');
const logoutBtn = document.getElementById('logout-btn');

// Gebruiker opslaan in Local Storage
function saveUser(username) {
    localStorage.setItem('currentUser', username);
}

// Gebruiker ophalen uit Local Storage
function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

// Gebruikersagenda ophalen uit Local Storage
function getUserAgenda(username) {
    const agenda = localStorage.getItem(`agenda_${username}`);
    return agenda ? JSON.parse(agenda) : [];
}

// Gebruikersagenda opslaan in Local Storage
function saveUserAgenda(username, agenda) {
    localStorage.setItem(`agenda_${username}`, JSON.stringify(agenda));
}

// Toon agenda in de interface
function displayAgenda(username) {
    const agenda = getUserAgenda(username);
    agendaList.innerHTML = '';

    agenda.forEach(event => {
        const li = document.createElement('li');
        li.classList.add('agenda-item');
        li.textContent = `${event.name} op ${event.date}`;
        agendaList.appendChild(li);
    });
}

// Inloggen functie
function login(username) {
    const storedAgenda = getUserAgenda(username);
    if (storedAgenda) {
        userNameDisplay.textContent = username;
        authSection.classList.add('hidden');
        agendaSection.classList.remove('hidden');
        displayAgenda(username);
        saveUser(username);
    } else {
        authMessage.textContent = "Gebruiker niet gevonden. Probeer te registreren.";
    }
}

// Registreren functie
function register(username) {
    const storedAgenda = getUserAgenda(username);
    if (storedAgenda.length > 0) {
        authMessage.textContent = "Gebruiker bestaat al!";
    } else {
        saveUserAgenda(username, []); // Lege agenda aanmaken
        authMessage.textContent = "Registratie geslaagd! Je kunt nu inloggen.";
    }
}

// Voeg nieuwe afspraak toe
addEventBtn.addEventListener('click', () => {
    const eventName = eventNameInput.value;
    const eventDate = eventDateInput.value;
    const currentUser = getCurrentUser();

    if (!eventName || !eventDate) {
        alert("Vul alstublieft zowel de naam als de datum in.");
        return;
    }

    const agenda = getUserAgenda(currentUser);
    agenda.push({ name: eventName, date: eventDate });
    saveUserAgenda(currentUser, agenda);
    displayAgenda(currentUser);
    eventNameInput.value = '';
    eventDateInput.value = '';
});

// Uitloggen
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    authSection.classList.remove('hidden');
    agendaSection.classList.add('hidden');
});

// Inloggen en Registreren knoppen
loginBtn.addEventListener('click', () => {
    const username = usernameInput.value;
    if (username) login(username);
});

registerBtn.addEventListener('click', () => {
    const username = usernameInput.value;
    if (username) register(username);
});

// Automatisch inloggen als er een huidige gebruiker is
window.onload = () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
        login(currentUser);
    }
};
