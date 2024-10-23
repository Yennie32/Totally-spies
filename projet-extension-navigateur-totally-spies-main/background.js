console.log("za marche")
//GESTION DES PHRASES BIEN-ÊTRE
// On ecoute les "messages" entrants venant du popup.js
let alarmListenerAdded = false;

// On ecoute les "messages" entrants venant du popup.js ou content script lorsqu'on clique sur le bouton on/off des phrases bien-être
chrome.runtime.onMessage.addListener(function(request) {  // On vérifie  si le message reçu contient l'action "goodVibeButtonClick"
    if (request.action === "goodVibeButtonClick") {
        sendGoodVibeMessage(); // appel de la fonction pour envoyer le message au content script
    }
});


//GESTION DES CITATIONS DE CHUCK NORRIS 
chrome.runtime.onMessage.addListener(function(request) {  
    if (request.action === "chuckButtonClick") {
        sendChuckMessage(); 
    }
});


// Fonction pour créer une notification pour les rappels
function createNotification(message) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: "icon16.png",
        title: 'Reminder',
        message: message,
        priority: 2
    }, function(notificationId) { // log pour s'assurer des échanges entre background et popup
        if (chrome.runtime.lastError) {
            console.error('Erreur lors de la création de la notification :', chrome.runtime.lastError.message);
        } else {
            console.log('Notification créée avec succès :', notificationId);
        }
    });
}


// Gestion des messages depuis le popup pour les rappels
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'setReminder') {
        // Récupère les données du message : heure et le message du rappel
        const { dateTime, message: reminderMessage } = message;
        // Crée une alarme avec un délai basé sur l'heure exacte
        chrome.alarms.create('reminderAlarm', { when: dateTime });

        // Stocke le message du rappel pour le récupérer lors de l'alarme
        chrome.storage.local.set({ reminderMessage }, function() {
            // Vérifie s'il y a une erreur lors du stockage du message
            if (chrome.runtime.lastError) {
                console.error('Erreur lors du stockage du message de rappel :', chrome.runtime.lastError);
            }
        });
    }
});


if (!alarmListenerAdded) {
    chrome.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name === 'reminderAlarm') {
            // Récupère le message du rappel stocké
            chrome.storage.local.get('reminderMessage', function (data) {
                if (chrome.runtime.lastError) {
                    // Affiche une erreur dans la console si la récupération échoue
                    console.error('Erreur lors de la récupération du message de rappel :', chrome.runtime.lastError);
                    return;
                }
                // Appelle la fonction pour créer une notification avec le message récupéré ou un message par défaut
                createNotification(data.reminderMessage || 'Rappel !');
            });
        }
    });
    alarmListenerAdded = true; // Marquez l'écouteur comme ajouté
}