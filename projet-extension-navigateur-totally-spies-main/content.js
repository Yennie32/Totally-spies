//GESTION DYNAMIQUE DES DIV 
let notificationInterval = null; // Variable qui stocke l'intervalle actif pour l'affichage des notif
let activeNotificationType = null; // Variable qui garde en mémoire le type de notif actif (ex : 'goodVibe', 'chuckQuote', 'Reminder')


function createNotifDiv() {
    let div = document.getElementById('newDiv');
    if (!div) {
        div = document.createElement('div');
        div.id = 'newDiv';
        document.body.appendChild(div);
    }
    return div;
}


function fillDiv(text, type){ //la fonction prendra en paramètre le contenu que l'on veut afficher dans la div 
    let newDivContent = createNotifDiv();
    if (newDivContent) {
        newDivContent.innerText = text; // Change le texte affiché dans la div
    } else {
        console.error(`La div n'a pas été trouvée.`);
    }
}

// Fonction pour arrêter toutes les notifications et vider le contenu de la div
function stopNotifications() {
    if (notificationInterval) {
        clearInterval(notificationInterval); // on arrête l'intervalle actif pour éviter de superposer les types de notifs
        notificationInterval = null;  // on réinitialise l'intervalle
    }
    // Vider la div
    let div = document.getElementById('newDiv');
    if (div) {
        div.innerText = ''
        div.remove();
    }
}

// Fonction pour gérer l'annulation de l'intervalle actif
function clearNotificationInterval() {
    if (notificationInterval) {
        clearInterval(notificationInterval);
        notificationInterval = null;
    }
}

//GESTION DES PHRASES BIEN-ÊTRE
const goodVibeArr = [
    "Une petite gorgée d'eau ?", 
    "Et si on s'étirait ?", 
    "As-tu pensé à demander de l'aide ?", 
    "Un ptit café ?", 
    "Allez, une petite pause ?"]

function randomGoodMix (){
    let goodVibePhrase = goodVibeArr[Math.floor(Math.random()*goodVibeArr.length)]  //math.random renvoie un nombre random flottant, math floor le transforme en entier
    console.log("phrase goodvibe: " + goodVibePhrase)
    fillDiv(goodVibePhrase, 'goodVibe')
}

//GESTION DES CITATIONS DE CHUCK NORRIS 
async function getChuckQuote () {
    try {
        const response = await fetch('https://api.chucknorris.io/jokes/random?category=dev');
        if (!response.ok) throw new Error('Network response was not ok');
        const chuckNorrisQuote = await response.json();
        console.log(chuckNorrisQuote.value);
        return chuckNorrisQuote.value;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
  }

  async function randomChuckMix (){
    let chuckQuote = await getChuckQuote()
    console.log("phrase Chuck Norris: " +chuckQuote);    
    fillDiv(chuckQuote, 'chuckNorris')
}

// GESTION DES MESSAGES ENVOYES DEPUIS LE POPUP
/*1 - Vérification si le message demande d'afficher le type de phrase souhaité
 *2 - On check si le le type de notification actif n'est pas déjà "le type souhaité
      si oui, on arrête les notifications en cours et on à jour le type de notif actif
 *3 - On appelle la fonction qui récupère les phrases à afficher une première fois et 
      on l'affiche à nouveau toutes les X fois selon l'interval souhaité */
chrome.runtime.onMessage.addListener(function(message) {
    if (message.action === "showGoodVibe") {
        if (activeNotificationType !== "goodVibe") {
            stopNotifications();
            activeNotificationType = "goodVibe";
            randomGoodMix();
            notificationInterval = setInterval(randomGoodMix, 3000); // Toutes les 3 secondes
        }
    } else if (message.action === "showChuckQuote") {
        if (activeNotificationType !== "chuckQuote") {
            stopNotifications();
            activeNotificationType = "chuckQuote";
            randomChuckMix();
            notificationInterval = setInterval(randomChuckMix, 10000); // Toutes les 10 secondes
        }
    } else if (message.action === "customReminder") {
        stopNotifications(); // Annule les intervalles avant de montrer le reminder
        activeNotificationType = "reminder"; // Marquer comme type "reminder" si besoin
        fillDiv(message.inputValue, 'reminder');
    }
    // Arrête les notifications pour un type spécifique quand le toggle est désactivé
    else if (message.action === "stopNotifications") {
        if (activeNotificationType === message.type) {
            stopNotifications(); // Arrête les notifications pour ce type
            activeNotificationType = null; // Réinitialise le type de notification
        }
}})



// // Fonction principale pour écouter et traiter les messages entre le script du background et le script de la fonctionnalité des phrases bien-être 
// chrome.runtime.onMessage.addListener(receiveReminderMessage);

    // Envoie le message au script de fond pour créer une alarme
    chrome.runtime.sendMessage({
        action: 'setReminder',
        dateTime: reminderDateTime.getTime(), // Convertit la date en millisecondes
        message: message
    });

