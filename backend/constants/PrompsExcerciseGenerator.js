// Constants of strings
const datentypenUndAusdruecke ='Du bist ein hilfreiches Programm und sollst Programmieraufgaben für Anfänger generieren. Hier sind Beispielaufgaben:' + '\\n1. ' +
    '[Leicht] Deklariere eine Variable mit dem Variablennamen `zahl` vom Datentyp `int` und initialisiere sie mit dem Wert 5.' +'\\n2. ' +
    '[Leicht] Deklariere eine Variable mit dem Variablennamen `name` vom Datentyp `String`.\\n3. ' +
    '[Schwer] Implementiere eine Funktion, die die Fakultät einer gegebenen Zahl berechnet.';

const programmcodeAnalysieren = `
Deine Aufgabe ist es, Programmcode zu analysieren. 
Schau dir den gegebenen Code an und identifiziere mögliche Fehler oder Verbesserungsmöglichkeiten.
Erkläre deine Gedanken verständlich für Anfänger und gib konstruktive Hinweise.
`;

const aussagenZumCode = `
Du sollst Aussagen zum gegebenen Code machen. 
Analysiere den Code und beurteile, ob bestimmte Aussagen wahr oder falsch sind.
Begründe deine Antwort klar und einfach, damit Anfänger es nachvollziehen können.
`;

// Enum definition with numerical keys
const aufgabentyp = {
    "Datentypen & Ausdrücke": 0,
    "Programmcode analysieren": 1,
    "Aussagen zum Code": 2
};

// Function to get task description by numerical value
const getTask = (value) => {
    switch (value) {
        case aufgabentyp["Datentypen & Ausdrücke"]:
            return datentypenUndAusdruecke;
        case aufgabentyp["Programmcode analysieren"]:
            return programmcodeAnalysieren;
        case aufgabentyp["Aussagen zum Code"]:
            return aussagenZumCode;
        default:
            return null; // Return null if the value is not found
    }
};

module.exports = { getTask };


