import React, {useContext, useState} from "react";
import AppContext from "../contexts/AppContext";
import CompilerService from "../services/CompilerService";
import {toast, ToastContainer} from "react-toastify";
import CodeEditorWindow from "./CodeEditor";
import CompileOutput from "./CompileOutput";
import {parseErrorLines} from "../utils/CompileOutputParser";
import GptCompilationHelper from "./GptCompilationHelper";
import GptService from "../services/GptService";
import JoyRideTutorial from "./JoyRideTutorial";
import {STATUS} from "react-joyride";
import ManagementBar from "./ManagementBar";
import SplitPane, {Pane} from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css'
import GptExplainer from "./GptExplainer";
import INITIAL_CODE from "../constants/CodeEditorConstants";
import GenerateAssignmentService from "../services/GenerateAssignment";
/**
 * Home component. Combines every other component
 */
const Home = () => {
  const [code, setCode] = useState(INITIAL_CODE);
  const [compileOutput, setCompileOutput] = useState('');
  const [explainText, setExplainText] = useState('');
  const [compileStatus, setCompileStatus] = useState(null);
  const [errorLines, setErrorLines] = useState([]);
  const { setLoading, sitzungsId } = useContext(AppContext);
  const [aiHelpCompileError, setAiHelpCompileError] = useState('');
  const [tourRunning, setTourRunning] = useState(false);
  const [sizesCodingAndAI, setSizesCodingAndAI] = useState([
    '70%',
    '30%',
  ]);
  const [sizesAI, setSizesAI] = useState([
    '80%',
    '20%',
  ]);
  const [sizesCoding, setSizesCoding] = useState([
    '80%',
    '20%',
  ]);

  /**
   * Should get called if code changes in the code editor.
   * @param action for now, just "code"
   * @param data new code
   */
  const onChange = (action, data) => {
    if (action === "code") {
      setCode(data);
    } else {
      console.warn("case not handled!", action, data);
    }
  };

  /**
   * Sends code to external compiler.
   * Sets application loading screen to true until code is compiled.
   * Calls handlerFunction if code is compiled.
   * @param value code to be sent to the compiler
   */
  const sendCompileAndStatusRequests = (value) => {
    setLoading(true);
    CompilerService.sendCodeCompileRequest(value)
      .then((token) => CompilerService.sendCodeCompileStatusRequest(token))
      .then(handleCompileResult)
      .catch(stopLoading);
  }

  /**
   * Handles the compile result and stops the loading screen.
   * The "Fehlerinspektor" component text gets reset.
   * Calls helperFunctions for every case: success, compile error, runtime error or unhandled
   * @param status
   * @param stdout
   * @param compile_output
   * @param stderr
   */
  const handleCompileResult = ({status, stdout, compile_output, stderr}) => {
    stopLoading();
    setAiHelpCompileError('');
    setCompileStatus(status.id);

    const resultHandlers = {
      3: () => handleSuccessCompileResult(stdout),
      6: () => handleCompilationErrorResult(compile_output),
      7: () => handleRuntimeErrorResult(stderr),
      8: () => handleRuntimeErrorResult(stderr),
      9: () => handleRuntimeErrorResult(stderr),
      10: () => handleRuntimeErrorResult(stderr),
      11: () => handleRuntimeErrorResult(stderr),
      12: () => handleRuntimeErrorResult(stderr),
    };

    const resultHandler = resultHandlers[status.id] || unhandledResultCase(status.id);
    resultHandler();
  }

  /**
   * Stops loading screen.
   */
  const stopLoading = () => setLoading(false);

  /**
   * Resets compile output and warns the user about an unhandled case.
   * @param id unhandled case id
   */
  const unhandledResultCase = (id) => {
    setCompileOutput('');
    console.warn('result status case not handled: ', id);
    toast.error('Result status case not handled');
  }

  /**
   * Sets the compile output to fixed text if there is no compile output.
   * Sets the compile output to the returned compile output if there is output.
   * Mistakes marked in the code editor get reset and a success message gets shown.
   * @param stdout compiler output
   */
  const handleSuccessCompileResult = (stdout) => {
    const output = stdout ? atob(stdout) : '<Kein Compile-Output>';
    setCompileOutput(output);
    setErrorLines([]);
    toast.success('Erfolgreich ausgeführt');
  }

  /**
   * Sets the compile output to the compilation error and shows an error message.
   * Errors will be parsed and marked in the code editor.
   * @param compile_output compiler output
   */
  const handleCompilationErrorResult = (compile_output) => {
    const output = atob(compile_output);
    setCompileOutput(output);
    setErrorLines(parseErrorLines(output));
    toast.error('Kompilierfehler');
  }

  /**
   * Sets the compile output to the runtime error and shows an error message.
   * Errors will be parsed and makred in the code editor
   * @param stderr compiler output
   */
  const handleRuntimeErrorResult = (stderr) => {
    const output = atob(stderr);
    setCompileOutput(output);
    setErrorLines(parseErrorLines(output));
    toast.error('Laufzeitfehler');
  }

  const handleCompileClick = () => sendCompileAndStatusRequests(code);

  const handleAssignmentRequest = () => GenerateAssignmentService.sendAssignmentRequest().
    then((test)=> console.log(test));

  /**
   * Will be called in the management bar component. Gpt service is called to explain code.
   * @param gptModel Desired gpt model
   * @param assignment optional assignment
   */
  const handleExplainCodeClick = (gptModel, assignment) => {
    setLoading(true);
    GptService.explainCode(code, gptModel, assignment).then(result => {
      setExplainText(result);
      stopLoading();
    });
  }

  /**
   * Will be called in the management bar component. Gpt service is called to get compilation/runtime error help.
   * @param gptModel Desired gpt model
   */
  const handleAiHelperRequestClick = (gptModel) => {
    setLoading(true);
    GptService.getCompileErrorHelp(code, compileOutput, gptModel).then(function(result) {
      setLoading(false);
      setAiHelpCompileError(result);
    });
  }

  /**
   * Used for helper tour. Will set the tour to an end if it is skipped or finished.
   * @param data status of the tour
   */
  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setTourRunning(false);
    }
  };

  /**
   * Will be called in the management bar component. Will start a helper tour to introduce the user to the editor.
   */
  const handleStartHelpTour = () => {
    setTourRunning(true);
  }

  /**
   * Will be called in the management bar component. Will save the code editor input as java file locally.
   */
  const handleSaveCodeAsFile = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const file = new File([blob], 'Main.java');

    const fileUrl = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = file.name;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(fileUrl);
  }

  return (
    <div className="App h-screen flex flex-col">
      <JoyRideTutorial run={tourRunning} joyrideCallback={handleJoyrideCallback}/>
      <ToastContainer position="bottom-center" autoClose={2000} hideProgressBar={true} />
      <ManagementBar
        startHelpTour={handleStartHelpTour}
        handleCompileClick={handleCompileClick}
        handleCompileErrorExplanation={handleAiHelperRequestClick}
        handleExplainCode={handleExplainCodeClick}
        compileStatus={compileStatus}
        handleAssignmentRequest={handleAssignmentRequest}
        handleSaveCodeAsFile={handleSaveCodeAsFile}
        onChange={onChange}
      />
      <div className="flex h-screen w-full">
        <SplitPane
          split='vertical'
          sizes={sizesCodingAndAI}
          onChange={setSizesCodingAndAI}
        >
          <Pane minSize='30%'>
            <SplitPane
              split='horizontal'
              sizes={sizesCoding}
              onChange={setSizesCoding}
            >
              <Pane minSize="30%">
                <div className="flex flex-col h-full">
                  <CodeEditorWindow code={code} onChange={onChange} errorLines={errorLines}/>
                </div>
              </Pane>
              <Pane minSize="10%">
                <div className="flex flex-col h-full">
                  <CompileOutput output={compileOutput} compileStatus={compileStatus} />
                </div>
              </Pane>
            </SplitPane>
          </Pane>
          <Pane minSize='20%'>
            <SplitPane
              split="horizontal"
              sizes={sizesAI}
              onChange={setSizesAI}
            >
              <Pane minSize='10%'>
                <div className="flex-grow h-full">
                  <GptExplainer output={explainText}/>
                </div>
              </Pane>
              <Pane minSize='10%'>
                <div className="h-full">
                  <GptCompilationHelper output={aiHelpCompileError} />
                </div>
              </Pane>
            </SplitPane>
          </Pane>
        </SplitPane>
      </div>
    </div>
  );
}

export default Home;