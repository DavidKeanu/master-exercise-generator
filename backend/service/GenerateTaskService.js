const db = require("../config/firebaseAdminConfig");
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
                lernziele: "1. Deklarieren und Initalisieren von Datentypen. 2. Zu welchem Datentyp und Wert werten Ausdrücke aus."
            }
        case 1:
            return {
                aufgabentyp: "Arrays",
                lernziele: "1. Iteration durch Arrays. 2. Zugriff auf Array-Elemente. 3. Array-Initialisierung"
            }
        case 2:
            return {
                aufgabentyp: "Schleifen",
                lernziele: "1. Umgang mit Schleifenvariablen. 2. Anzahl der Iterationen. 3. Schleifensteuerungsbefehle (break, continue)"
            }
            break;
        default:
            console.log("The number is not one, two, or three.");
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
            return "Die Aufgabe ist zu leicht. Generiere eine neue Aufgabe die etwas schwerer ist und sich inhaltlich von der vorherigen unterscheidet. " +
                "Du kannst auch eine Aufgabe für ein anderes Lernziel erstellen"
        case "zu schwer":
            return "Die Aufgabe ist zu schwer. Generiere eine neue Aufgabe die etwas leichter ist" +
                "und sich inhaltlich von der vorherigen unterscheidet. Du kannst auch eine Aufgabe für ein anderes Lernziel erstellen"
        default:
            console.log("The number is not one, two, or three.");
    }
}
/**
 * Generates a prompt history for a chat-based interaction involving the creation of programming tasks.
 * This asynchronous function creates a chat history based on the provided parameters and the existing data
 * @async
 * @function
 * @name generatePromptHistory
 * @param {string} collectionName - The name of the Firestore collection to query for existing tasks.
 * @param {Object} req - The Express.js request object containing parameters for task generation.
 * @returns {Array<Object>} - An array representing the chat history with role and content attributes for each message.
 * @author David Nutzinger
 */
const generatePromptHistory = async (collectionName, req) => {
    const aufgabentyp = mapAufgabentyp(req.body.aufgabentyp);
    const startMessage = {
        role: 'system', content: 'Du bist ein Assistent um Programmieraufgaben für Anfänger zu generieren. ' +
            `Du sollst eine Aufgabe für ${aufgabentyp.aufgabentyp} in Java erstellen. Keine Objektorientierung. ` +
            `Wähle aus einem Lernziel aus. Lernziele sind: ${aufgabentyp.lernziele}` +
            `Erstelle eine Aufgabe für das Erfahrungsniveau ${req.body.erfahrung} (1 bis 5) und dem Schwierigkeitsgrad ${req.body.schwierigkeitsgrad} (1 bis 3). ` +
            'Suche dir zufällig ein Lernziel aus, für die du eine Aufgabe generierst'+
            'Vermeide Berechnungen die Vorwissen benötigen.' +
            'Die Aufgabe sollte nicht mehr als drei kurze Sätze haben und ein erwartetes Ergebnis beinhalten' +
            'Das erwartete Ergebnis, ist das was der User machen soll, um die Aufgabe zu lösen' +
            'Achte darauf, dass das erwartete Ergbnis nicht Lösung vorgibt.' +
            'Bitte gebe nur folgendes Format zurück:' +
            '{"aufgabe": "die Aufgabe", "erwartetesErgebnis": "Das erwartete Ergebnis der Aufgabe"}'
    }
    const endMessage = {
        role: 'system', content: 'Generiere eine neue Aufgabe, die sich inhaltlich stark von' +
            'den vorherigen Aufgaben unterscheidet. Sei kreativ und denke dir unterschiedliche Aufgabenstellungen aus.' +
            'Wähle zufällig ein Lernziel' +
            'Geben folgendens JSON-Format zurück: {"aufgabe": "Die Aufgabe", "erwartetesErgebnis": "Das erwartete Ergebnis der Aufgabe"}.'
    }

    if (req.body.istGuteAufgabe === false && req.body.begruendung !== "Aufgabe wiederholt sich.") {
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
            .where('aufgabentyp', '==', req.body.aufgabentyp)
            .where('erfahrung', '==', req.body.erfahrung)
            .where('schwierigkeitsgrad', '==', req.body.schwierigkeitsgrad)
            .where('istGuteAufgabe', '==', true).get();

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
    generatePromptHistory
}