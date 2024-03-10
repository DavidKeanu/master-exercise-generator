const db = require("../config/firebaseAdminConfig");

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

function mapBegrudnungPrompt(begruendung) {
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

const generatePromptHistory = async (collectionName, req) => {
    const aufgabentyp = mapAufgabentyp(req.body.aufgabentyp);
    const startMessage = {
        role: 'system', content: 'Du bist ein Assistent um Programmieraufgaben für Anfänger zu generieren. ' +
            `Du sollst eine Aufgabe für ${aufgabentyp.aufgabentyp} in Java erstellen. Keine Objektorientierung. ` +
            `Wähle aus einem Lernziel aus. Lernziele sind: ${aufgabentyp.lernziele}` +
            `Erstelle eine Aufgabe für das Erfahrungsniveau ${req.body.experience} (1 bis 5) und dem Schwierigkeitsgrad ${req.body.schwierigkeitsgrad} (1 bis 3). ` +
            'Suche dir zufällig ein Lernziel aus, für die du eine Aufgabe generierst'+
            'Vermeide Berechnungen die Vorwissen benötigen.' +
            'Die Aufgabe sollte nicht mehr als drei kurze Sätze haben und ein erwartetes Ergebnis beinhalten' +
            'Das erwartete Ergebnis, ist das was der User machen soll, um die Aufgabe zu lösen' +
            'Achte darauf, dass das erwartete Ergbnis nicht Lösung vorgibt.' +
            'Bitte gebe nur folgendes Format zurück:' +
            '{"task": "die Aufgabe", "erwartetesErgebnis": "Das erwartete Ergebnis der Aufgabe"}'
    }
    const endMessage = {
        role: 'system', content: 'Generiere eine neue Aufgabe, die sich inhaltlich stark von' +
            'den vorherigen Aufgaben unterscheidet. Sei kreativ und denke dir unterschiedliche Aufgabenstellungen aus.' +
            'Wähle zufällig ein Lernziel' +
            'Geben folgendens JSON-Format zurück: {"task": "Die Aufgabe", "erwartetesErgebnis": "Das erwartete Ergebnis der Aufgabe"}.'
    }

    if (req.body.isGoodTask === false && req.body.begruendung !== "Aufgabe wiederholt sich.") {
        const prompt = [{
            role: 'assistant',
            content: req.body.task
        }, {
            role: 'system',
            content: mapBegrudnungPrompt(req.body.begruendung)
        }]
        prompt.unshift(startMessage);
        return prompt;
    }
    try {
        const collectionRef = db.collection(collectionName);
        const snapshot = await collectionRef
            .where('aufgabentyp', '==', req.body.aufgabentyp)
            .where('experience', '==', req.body.experience)
            .where('schwierigkeitsgrad', '==', req.body.schwierigkeitsgrad)
            .where('isGoodTask', '==', true).get();

        if (snapshot.empty) {
            return [
                startMessage
            ];
        }
        const mappedData = snapshot.docs.map((doc) => {
            const obj = {id: doc.id, ...doc.data()};

            const assistantContent = obj.task;
            return [
                {role: 'assistant', content: assistantContent}
            ];
        });
        const chatHistory = mappedData.flat();
        // Add a message at the front
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