const db = require("../config/firebaseAdminConfig");
const {getRandomTheme} = require("../constants/themes");

/**
 * Maps an ID to an object containing information about the corresponding task category (Aufgabentyp).
 * @function
 * @param {number} id - The numerical identifier of the task category.
 * @returns {Object} - An object containing information about the task category, including Aufgabentyp and Lernziele.
 * @author David Nutzinger
 */
function mapAufgabentyp(id) {
    switch (id) {
        case 0:
            return {
                aufgabentyp: "Datentypen & Ausdrücke",
                lernziele: [
                    "Deklarieren und Initalisieren von Datentypen",
                    "Zu welchem Datentyp und Wert werten Ausdrücke aus",
                    "Konvertierung von Datentypen",
                    "Manipulation von Zeichenketten"
                ]
            }
        case 1:
            return {
                aufgabentyp: "Arrays",
                lernziele: [
                    "Iteration durch Arrays",
                    "Zugriff auf Array-Elemente",
                    "Array-Initialisierung",
                    "Deklarieren von Arrays"
                ]
            }
        case 2:
            return {
                aufgabentyp: "Schleifen",
                lernziele: [
                    "Umgang mit Schleifenvariablen",
                    "Schreiben der Schleifenbedingung",
                    "Anzahl der Iterationen",
                    "Schleifensteuerungsbefehle (break, continue)"
                ]
            }
            break;
        default:
            console.log("The number is not one, two, or three.");
    }
}

function getRandomLernziel(id) {
    const aufgabenTyp = mapAufgabentyp(id);
    if (aufgabenTyp && aufgabenTyp.lernziele) {
        const lernziele = aufgabenTyp.lernziele;
        const randomIndex = Math.floor(Math.random() * lernziele.length);
        return lernziele[randomIndex];
    } else {
        return "Noch keine Lernziele für diesen Aufgabentyp definiert.";
    }
}

/**
 * Maps a justification reason to a corresponding prompt for generating a new task.
 *
 * @function
 * @name mapBegruednungPrompt
 * @param {string} begruendung - The justification reason provided by the user.
 * @returns {string} - A user-friendly prompt suggesting actions for generating a new task.
 * @author David Nutzinger
 */
function mapBegruednungPrompt(begruendung) {
    switch (begruendung) {
        case "zu leicht":
            return "Die Aufgabe ist zu leicht. Generiere eine neue Aufgabe die etwas schwerer ist."
        case "zu schwer":
            return "Die Aufgabe ist zu schwer. Generiere eine neue Aufgabe die etwas leichter ist."
        case "Aufgabe wiederholt sich.":
            return "Die Aufgabe wiederholt sich. Generiere eine neue Aufgabe, die sich inhaltlich stark von der vorherigen unterscheidet."
        default:
            console.log("The number is not one, two, or three.");
    }
}

/**
 * Generates a prompt history for a chat-based interaction involving the creation of programming tasks.
 * This asynchronous function creates a chat history based on the provided parameters and the existing data
 * @async
 * @function
 * @name generatePrompt
 * @param {string} collectionName - The name of the Firestore collection to query for existing tasks.
 * @param {Object} req - The Express.js request object containing parameters for task generation.
 * @returns {Array<Object>} - An array representing the chat history with role and content attributes for each message.
 * @author David Nutzinger
 */
const generatePrompt = async (collectionName, req) => {
    const aufgabentyp = mapAufgabentyp(req.body.aufgabentyp);
    const startMessage = {
        role: 'system', content: 'Du bist ein Assistent um Programmieraufgaben für Anfänger zu generieren. ' +
            `Du sollst eine Aufgabe für ${aufgabentyp.aufgabentyp} in Java erstellen. Keine Objektorientierung. ` +
            `Erstelle eine Aufgabe für das Erfahrungsniveau ${req.body.erfahrung} (1 bis 5) und dem Schwierigkeitsgrad ${req.body.schwierigkeitsgrad} (1 bis 3). ` +
            `Verwende das Thema: ${getRandomTheme()} und folgendes Lernziel: ${getRandomLernziel(req.body.aufgabentyp)}  für die Aufgabenstellung.` +
            'Vermeide Berechnungen die Vorwissen benötigen. ' +
            'Die Aufgabe muss ohne externe Klasse wie z.B. Scanner lösbar sein. ' +
            'Die Aufgabe sollte nicht mehr als vier kurze Sätze haben und ein erwartetes Ergebnis beinhalten. ' +
            'Das erwartete Ergebnis, ist das was der User machen soll, um die Aufgabe zu lösen' +
            'Achte darauf, dass das erwartete Ergebnis nicht Lösung vorgibt.' +
            'Bitte gebe nur folgendes Format zurück:' +
            '{"aufgabe": "die Aufgabe", "erwartetesErgebnis": "Das erwartete Ergebnis"}'
    }
    const endMessage = {
        role: 'system', content: 'Generiere eine neue Aufgabe, die sich inhaltlich stark von' +
            'den vorherigen Aufgaben unterscheidet. Sei kreativ und denke dir unterschiedliche Aufgabenstellungen aus.' +
            'Geben folgendens JSON-Format zurück: {"aufgabe": "Die Aufgabe", "erwartetesErgebnis": "Das erwartete Ergebnis der Aufgabe"}.'
    }

    if (req.body.istGuteAufgabe === false) {

        if (req.body.begruendung === "Aufgabe wiederholt sich.") {
            return [startMessage];
        }

        const prompt = [{
            role: 'assistant',
            content: req.body.aufgabe
        }, {
            role: 'system',
            content: mapBegruednungPrompt(req.body.begruendung)
        }]
        prompt.unshift(startMessage);
        return prompt;
    }
    try {
        const collectionRef = db.collection(collectionName);
        // filter for relevant documents from the db
        const snapshot = await collectionRef
            .limit(10)
            .where('aufgabentyp', '==', req.body.aufgabentyp)
            .where('erfahrung', '==', req.body.erfahrung)
            .where('schwierigkeitsgrad', '==', req.body.schwierigkeitsgrad)
            .where('istGuteAufgabe', '==', true)
            .get();

        if (snapshot.empty) {
            return [
                startMessage
            ];
        }
        const mappedData = snapshot.docs.map((doc) => {
            const obj = {id: doc.id, ...doc.data()};

            const assistantContent = obj.aufgabe;
            return [
                {role: 'assistant', content: assistantContent}
            ];
        });
        const chatHistory = mappedData.flat();
        // message at the front and the existing chatHistory
        chatHistory.unshift(startMessage);
        chatHistory.push(endMessage);
        return chatHistory;
    } catch (error) {
        console.error(`Error fetching ${collectionName} collection:`, error);
        throw error;
    }
};

module.exports = {
    generatePrompt: generatePrompt
}