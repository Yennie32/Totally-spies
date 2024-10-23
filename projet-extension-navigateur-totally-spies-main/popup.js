/*GESTION DES PHRASES BIEN-ÊTRE
Fonction qui envoie le message au content script qui contient les instructions de la fonctionnalité Goodvibes*/
function sendGoodVibeMessage() {
    //on récupère l'onglet actif de la fenêtre actuelle. On utilise l'API chrome "chrome.tabs"
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) { 
        chrome.tabs.sendMessage(tabs[0].id, { action: "showGoodVibe" }); // le message contient l'action { action: "showGoodVibe" }
    });
}

// Fonction qui gère l'évenement d'envoi du message lorsqu'on clique sur le bouton on/off des phrases bien-être
function GoodVibeButtonClick() {
    const gvButton = document.getElementById("goodVibe");
    if (gvButton) {
        gvButton.addEventListener("change", function() {
            if (gvButton.checked) {
                sendGoodVibeMessage();  // Active les phrases bien-être
            } else {
                stopMessages('goodVibe'); // Désactive les phrases bien-être
            }
        });
    } else {
        console.error("Le bouton avec l'ID 'goodVibe' n'a pas été trouvé.");
    }
}
// On initialise le popup de la phrase goodVibe une fois le DOM chargé et bouton cliqué
// document.addEventListener("DOMContentLoaded", GoodVibeButtonClick);


//GESTION DES CITATIONS DE CHUCK NORRIS 
function sendChuckMessage() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // Envoie la valeur de l'input au content script via un message
        chrome.tabs.sendMessage(tabs[0].id, { 
            action: "showChuckQuote"
        }); 
    });
}

function chuckButtonClick() {
    const cnButton = document.getElementById("chuckNorris");
    if (cnButton) {
        cnButton.addEventListener("change", function() {
            if (cnButton.checked) {
                sendChuckMessage();  // Active les citations Chuck Norris
            } else {
                stopMessages('chuckQuote'); // Désactive les citations Chuck Norris
            }
        });} else {
        console.error("Le bouton avec l'ID 'chuckNorris' n'a pas été trouvé.");
    }
}
// document.addEventListener("DOMContentLoaded", chuckButtonClick);

// Construit l'heure courante
let now = new Date();
// Récupère heure courante, convertit en string et complète avec une chaîne de caractère si besoin
let hours = now.getHours().toString().padStart(2, '0'); 
let minutes = now.getMinutes().toString().padStart(2, '0');
let systemTime = `${hours}:${minutes}`;

const sound = new Audio('sounds/totally_spies.mp3');
document.getElementById('reminderForm').addEventListener('submit', function (event) {
    event.preventDefault();
    // empêche un evenement d'intervenir, ici le "submit", qui recharge la page par défaut 
    
    sound.play().catch(error => console.error('Erreur lors de la lecture du son :', error));

    const message = document.getElementById('reminderMessage').value; //récupère valeur de l'input
    const time = document.getElementById('reminderTime').value; //récupère valeur de l'input
    console.log("message:", message);
    console.log("time:", time);

    // Construit l'heure de l'utilisateur
    const [reminderHours, reminderMinutes] = time.split(':').map(Number); // assigne reminderHours et reminderMinutes en séparant time au niveau de : dans l'odre avec les .map
    const reminderDateTime = new Date(); // crée un nouvel objet date
    console.log("reminderDateTime1", reminderDateTime); // Lui aussigne heures et minutes définies plus tôt
    
    reminderDateTime.setHours(reminderHours, reminderMinutes, 0, 0); // Mettre les secondes et millisecondes à 0
    console.log("reminderDateTime2:", reminderDateTime);

    // Si l'heure programmée est déjà passée aujourd'hui, ajoutez un jour
    if (reminderDateTime < now) {
        reminderDateTime.setDate(reminderDateTime.getDate() + 1);
    }

    console.log("reminderDateTime3:", reminderDateTime);
   

// Envoie le message au script de fond pour créer une alarme
// Remplace le comportement du "submit"
chrome.runtime.sendMessage({
    action: 'setReminder', // définit l'action à executer dans le background
    dateTime: reminderDateTime.getTime(), // Convertit la date en millisecondes
    message: message // récupère l'input
});
alert("Don't worry, we're on it !");
});

// Fonction pour envoyer un message pour arrêter les notifications du type spécifique
function stopMessages(type) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "stopNotifications", type: type });
    });
}

// Initialisation de l'événement DOMContentLoaded
document.addEventListener("DOMContentLoaded", function() {
    GoodVibeButtonClick();
    chuckButtonClick();
});
    



