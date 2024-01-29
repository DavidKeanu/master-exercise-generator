import {AiOutlineQuestionCircle} from "react-icons/ai";
import {BiFolder, BiPlay, BiSave} from "react-icons/bi";
import {GiTeacher} from "react-icons/gi";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import GptService from "../services/GptService";
import {MdAssignment, MdOutlineAssignment} from "react-icons/md";
import AssignmentModal from "./AssignmentModal";
import Draggable from "react-draggable";

/**
 * Bar on top of the editor. Each editor function is called from here.
 */
const ManagementBar = (props) => {

  const {
    handleCompileClick,
    handleAssignmentRequest,
    handleExplainCode,
    startHelpTour,
    handleCompileErrorExplanation,
    compileStatus,
    handleSaveCodeAsFile,
    onChange
  } = props;

  const [selectedGptModel, setSelectedGptModel] = useState('');
  const [gptModels, setGptModels] = useState([]);
  const [assignmentText, setAssignmentText] = useState('');
  const [assignmentModalIsOpen, setAssignmentModalIsOpen] = useState(false);
  const [showAssignmentOverlay, setShowAssignmentOverlay] = useState(false);

  const assignmentButtonRef = useRef();

  const aiButtonsCss = "bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded";
  const aiButtonsDisabledCss = "bg-purple-500 text-white font-bold py-1 px-2 rounded opacity-50 cursor-not-allowed";

  const generateTask = "bg-purple-500"
  const ERROR_CODES = [6,7,8,9,10,11,12];

  useEffect(() => {
    GptService.getGptModels().then(models => {
      setGptModels(models);
      setSelectedGptModel(models[0]);
    });
  }, []);

  /**
   * Handles input events for assignment
   */
  const handleChange = useCallback((event) => {
    setSelectedGptModel(event.target.value);
  }, []);

  /**
   * Handles file upload
   */


  function handleTest(x) {
    console.log(x);
  }

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    if (file.name.endsWith('.java')) {
      reader.onload = (e) => {
        const content = e.target.result;
        onChange("code", content);
      };

      reader.readAsText(file);
    } else {
      alert('Bitte wähle eine Java-Datei aus.');
    }
  }, [onChange]);

  /**
   * Returns true if assignment is set.
   */
  const isAssignmentSet = useMemo(() => assignmentText.trim() === '', [assignmentText]);

  /**
   * Handles the show assignment click
   */
  const handleShowAssignmentChange = useCallback((checked) => {
    setShowAssignmentOverlay(checked);
  }, []);

  /**
   * Returns assignment formatted.
   */
  const assignmentTextAsLines = useMemo(() => assignmentText
    .split('\n')
    .map((line, i) =>
      <div className='ml-2 mr-2' key={i}>
        {line.trim().length > 0 ? line.trim() : <br />}
      </div>
    ), [assignmentText]);

  return (
    <div>
      <div>
        {showAssignmentOverlay &&
          <Draggable>
            <div className="assignment-overlay absolute z-[9999] shadow-xl">
              <h2 className={'bg-[#4e293b] rounded-t-md text-white border-b-2 shadow-md flex justify-center'}>
                <MdOutlineAssignment size={25} />
                Aufgabe
              </h2>
              <div className={`bg-[#4e293b] rounded-b-md text-white text-left font-normal text-m overflow-y-auto shadow-md max-h-96`}>
                {assignmentTextAsLines}
              </div>
            </div>
          </Draggable>
        }
      </div>
      <AssignmentModal assignmentText={assignmentText}
                       setAssignmentText={setAssignmentText}
                       setModalIsOpen={setAssignmentModalIsOpen}
                       modalIsOpen={assignmentModalIsOpen}
                       buttonRef={assignmentButtonRef}
                       handleShowAssignmentChange={handleShowAssignmentChange}
                       showAssignmentOverlay={showAssignmentOverlay}/>
      <div className="w-full h-12 bg-gray-100 p-2 flex justify-between items-center space-x-2">
        <div className="flex space-x-2">
          <button className="compile-code-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  onClick={handleCompileClick}
                  title="Code ausführen">
            <BiPlay size={25} />
          </button>
          <button className={`explain-compile-output-button ${ERROR_CODES.includes(compileStatus) ? aiButtonsCss : aiButtonsDisabledCss}`}
                  onClick={() => handleCompileErrorExplanation(selectedGptModel)}
                  title="Compilerfehler/Runtimefehler erklären lassen">
            <AiOutlineQuestionCircle size={25} />
          </button>
          <button className={`explain-code-button ${aiButtonsCss}`}
                  onClick={() => handleExplainCode(selectedGptModel, assignmentText)}
                  title="Code erklären">
            <GiTeacher size={25} />
          </button>
          <button className="save-file-button bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-2 rounded"
                  title="Datei Speichern"
                  onClick={handleSaveCodeAsFile}>
            <BiSave size={25} />
          </button>
          <button className={generateTask}
                  onClick={handleAssignmentRequest}
                  title="Compilerfehler/Runtimefehler erklären lassen">
            <AiOutlineQuestionCircle size={25} />
          </button>
          <label htmlFor="file-input" className="upload-file-button bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-2 rounded cursor-pointer"
                 title="Datei Laden">
            <BiFolder size={25} />
            <input
              id="file-input"
              type="file"
              accept=".java"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>
          <button className="assignment-button bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  ref={assignmentButtonRef}
                  title="Aufgabe hinterlegen"
                  onClick={() => setAssignmentModalIsOpen(true)}>
            {isAssignmentSet ? <MdOutlineAssignment size={25} /> : <MdAssignment size={25}/>}
          </button>
          <div className="gpt-models-group flex space-x-2 border border-gray-300 rounded-md">
            <div className="flex items-center ml-2">
              <label className="text-center w-full">GPT-Model</label>
            </div>
            <select
              value={selectedGptModel}
              onChange={handleChange}
              className="gpt-model-select px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              {gptModels.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>


        </div>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                onClick={startHelpTour}
                title="Hilfe anzeigen">
          Hilfe
        </button>
      </div>
    </div>
  );
}

export default ManagementBar;