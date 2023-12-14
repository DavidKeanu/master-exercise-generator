import Joyride from 'react-joyride';

/**
 * Helper tour. Content is every help for all functions inside the editor.
 */
const JoyRideTutorial = (props) => {

  const {run, joyrideCallback} = props;

  const steps = [
    {
      placement: 'center',
      target: 'body',
      content: '🎉 Willkommen im S.E.E.D. Editor! 🎉'
    },
    {
      target: '.code-editor',
      content: `Das ist der Code Editor. Hier kannst du Javacode schreiben. Die Klasse muss dabei IMMER Main heißen.`,
    },
    {
      target: '.compile-code-button',
      content: 'Das ist der Button zum Kompilieren. Damit wird der Code ausgeführt. Achte darauf, dass die Klasse "Main" heißen muss!'
    },
    {
      target: '.compile-output-window',
      content: 'Bei erfolgreichem Kompilieren wird das hier angegeben. Solltest du mit System.out.println() Text ausgeben, wird dieser hier ausgegeben. Bei Fehlern im Code werden diese rot angezeigt.',
    },
    {
      target: '.explain-compile-output-button',
      content: 'Sollten Kompilierfehler auftreten und du verstehst den Fehler nicht, drücke diesen Button. Dieser erklärt dir den Fehler mithhilfe von ChatGPT leichter.'
    },
    {
      target: '.ai-helper-window',
      content: 'Die Hilfe wird dann hier dargestellt.'
    },
    {
      target: '.evaluate-code-button',
      content: 'Mit diesem Button wird der gesamte Code evaluiert und erkannte Fehler werden angemerkt. Es werden in der Testphase nur bestimmte Fehler zu Methoden erkannt.'
    },
    {
      target: '.ai-evaluator-window',
      content: 'Die erkannten Fehler werden hier aufgelistet.'
    },
    {
      target: '.explain-code-button',
      content: 'Mit diesem Button kannst du dir deinen Code erklären lassen. Das ist praktisch, wenn du deinen Code debuggen willst. Solltest du eine Aufgabenstellung hinterlegt haben, wird dein Code zusätzlich geprüft, ob du damit die Aufgabenstellung bewältigt hast.'
    },
    {
      target: '.ai-explain-window',
      content: 'Die Erklärung wird dann hier angezeigt.'
    },
    {
      target: '.save-file-button',
      content: 'Hiermit kann der Inhalt des Code Editors als .java Datei gespeichert werden.'
    },
    {
      target: '.upload-file-button',
      content: 'Und hiermit kann eine .java Datei hochgeladen werden in den Editor.'
    },
    {
      target: '.assignment-button',
      content: 'Hier kannst du eine Aufgabenstellung hinterlegen, wenn du eine Aufgabe bearbeitest. Du kannst auch einstellen, dass diese dauerhaft eingeblendet wird. Die Aufgabenstellung kannst du dann überall hinziehen. Wenn du eine Aufgabenstellung hinterlegst, wird diese mit in der Erklärung deines Codes mit einbezogen.'
    },
    {
      target: '.gpt-models-group',
      content: 'Die KI in diesem Editor baut auf ChatGPT auf. Hier gibt es mehrere Modelle. Das Standardmodell ist gpt-3.5-turbo. Solltest du mit den Ergebnissen der KI-Funktionalitäten nicht zufrieden sein, probiere ruhig andere Modelle aus.'
    },
    {
      target: '.split-sash-content',
      content: 'Alle Fenster im Editor lassen sich in der Größe anpassen. Hover mit deiner Maus über den Bereich zwischen zwei Fenstern und verändere die Größe. Probiere es aus, um deinen Editor nach deinen Wünschen anzupassen.'
    },
    {
      placement: 'center',
      target: 'body',
      content: '🎉 Viel Erfolg beim Programmieren! 🎉'
    },
  ];

  return (
    <Joyride steps={steps}
             run={run}
             callback={joyrideCallback}
             continuous={true}
             showProgress={true}
             showSkipButton={true}
             hideCloseButton={true}/>
  );
}

export default JoyRideTutorial;