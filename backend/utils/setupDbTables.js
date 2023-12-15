const sequelize = require("../config/sequelizeConfig");
const Fehler = require("../models/Fehler");
const Sitzung = require("../models/Sitzung")
const Fehlerklasse = require("../models/Fehlerklasse");
const Fehlerdetail = require("../models/Fehlerdetail");
const Hilfsmaterial = require("../models/Hilfsmaterial");
const HilfsmaterialLinks = require("../models/HilfsmaterialLinks");
const Student = require("../models/Student");

/**
 * Setup database tables and insert standard values.
 */
sequelize.sync({ force: true }).then(async () => {
  // Standardwerte einfügen
  const fehlerklassen = [
    { fehlerklasse_id: 1, name: 'Kompilierungsfehler' },
    { fehlerklasse_id: 2, name: 'Laufzeitfehler' },
    { fehlerklasse_id: 3, name: 'Logik-/Designfehler' },
    { fehlerklasse_id: 4, name: 'Clean-Code-Fehler' }
  ];
  await Fehlerklasse.bulkCreate(fehlerklassen);

  const fehlerdetails = [
    { fehlerdetail_id: 1, fehlerklasse_id: 1, name: 'Falscher Methodenaufruf aufgrund von Tippfehler', detail: 'Überprüfe jeden Methodenaufruf in dieser Java-Klasse darauf, ob die diese mit Tippfehlern aufgerufen wurde.' },
    { fehlerdetail_id: 2, fehlerklasse_id: 1, name: 'Falscher Methodenaufruf aufgrund inkorrekter Parameteranzahl', detail: 'Überprüfe jeden Methodenaufruf in dieser Java-Klasse darauf, ob die aufgerufenen Methoden mit der korrekten Anzahl an Parametern aufgerufen wurden. Die Überprüfung sollte sich nur auf Methoden konzentrieren, die innerhalb der gleichen Java-Datei definiert sind.' },
    { fehlerdetail_id: 3, fehlerklasse_id: 1, name: 'Falscher Methodenaufruf aufgrund inkorrekter Parametertypen', detail: 'Überprüfe jeden Methodenaufruf in dieser Java-Klasse darauf, ob die Parameter, die in den Methodenaufrufen übergeben werden, den erwarteten Datentypen der jeweiligen Methodensignaturen entsprechen. Die Überprüfung sollte sich nur auf Methoden konzentrieren, die innerhalb der gleichen Java-Datei definiert sind.' },
    { fehlerdetail_id: 4, fehlerklasse_id: 1, name: 'Fehlerhafte Verwendung des static Schlüsselworts', detail: 'Überprüfe im Java-Code die Verwendung des static-Schlüsselworts auf syntaktische Korrektheit und darauf, ob es gemäß den Java-Konventionen angewendet wurde. Achte darauf, ob statische Methoden nicht von Instanzmethoden aus aufgerufen werden und ob statische Variablen nur in einem Kontext verwendet werden, in dem dies angebracht ist.' },
    { fehlerdetail_id: 5, fehlerklasse_id: 2, name: 'Falscher Indexzugriff auf Array', detail: 'Überprüfe alle Zugriffe auf Arrays in diesem Java-Code darauf, ob der Index negativ ist oder den Array-Größenbereich überschreitet. Wenn möglich, identifiziere solche fehlerhaften Indexzugriffe.' },
    { fehlerdetail_id: 6, fehlerklasse_id: 3, name: 'Unvollständige Nutzung der Methodenparameter', detail: 'Überprüfe in allen Methoden dieser Java-Klasse, die innerhalb der gleichen Java-Datei definiert sind, ob jeder im Methodenkopf deklarierte Parameter auch im Methodenkörper verwendet wird.' },
    { fehlerdetail_id: 7, fehlerklasse_id: 3, name: 'Überschreibung der Methodenparameter', detail: 'Überprüfe in allen Methoden dieser Java-Klasse, die innerhalb der gleichen Java-Datei definiert sind, ob irgendwelche der im Methodenkopf deklarierten Parameter im Methodenkörper überschrieben werden.' },
    { fehlerdetail_id: 8, fehlerklasse_id: 4, name: 'Uberflüssige Nutzung von System.out.println-Anweisungen laut Aufgabenstellung', detail: 'Überprüfe den Java-Code auf Vorkommen der Methode System.out.println. Vergleiche diese mit der Aufgabenstellung, um festzustellen, ob die Nutzung dieser Methode in diesem Kontext erforderlich oder erlaubt ist.' },
    { fehlerdetail_id: 9, fehlerklasse_id: 4, name: 'Nichteinhaltung von Namenskonventionen', detail: 'Überprüfe den Java-Code darauf, ob er die Java-Namenskonventionen für Variablen, Klassen und Methoden einhält. Achte insbesondere auf die CamelCase-Schreibweise für Methoden- und Variablennamen sowie die PascalCase-Schreibweise für Klassennamen.' },
    { fehlerdetail_id: 10, fehlerklasse_id: 4, name: 'Verwendung von unaussagekräftigen Methodennamen', detail: 'Überprüfe den Namen jeder im Java-Code definierten Methode im Kontext ihrer Funktionsweise. Wenn der Methodenname nicht klar die Aufgabe oder die Funktionalität der Methode kommuniziert, markiere dies als potenziellen Fehler.' },
  ];
  await Fehlerdetail.bulkCreate(fehlerdetails);

  const hilfsmaterials = [
    { hilfsmaterial_id: 1, fehlerdetail_id: 1, hilfstext: 'Kommentar eines Dozenten: Beachten Sie, dass das kein Fehler an sich ist, aber gegen Konventionen spricht'},
    { hilfsmaterial_id: 2, fehlerdetail_id: 2, hilfstext: 'Kommentar eines Dozenten: Beachten Sie, dass das kein Fehler an sich ist, aber gegen Konventionen spricht'},
    { hilfsmaterial_id: 3, fehlerdetail_id: 6, hilfstext: 'Kommentar eines Dozenten: Generell sollte Code aufgeräumt sein. Dazu zählt, dass keine ungenutzen Methoden im Code sein sollten.'},
  ];
  await Hilfsmaterial.bulkCreate(hilfsmaterials);

  const hilfsmaterialLinks = [];
  await HilfsmaterialLinks.bulkCreate(hilfsmaterialLinks);

  await Student.create({ matrikelnummer: 's0566443' });
  //await Fehler.create({});
}).catch(err => {
  console.error('Fehler beim Erstellen der Tabellen:', err);
});