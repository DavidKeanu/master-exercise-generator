import React, {useCallback, useMemo, useRef, useState} from "react";
import {MdOutlineAssignment} from "react-icons/md";
import AssignmentModal from "./AssignmentModal";
import Draggable from "react-draggable";
import {AppBar, IconButton, Toolbar} from "@mui/material";
import {AddTask, Lightbulb, PlayArrow, QuestionMark, Save, Task, UploadFile} from "@mui/icons-material";
import SelectGptModels from "./SelectGptModels";
import Box from "@mui/material/Box";
import CodingConcepts from "./ConceptDialog";

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
        handleSaveCodeAsFile,
        updateCode
    } = props;

    const [selectedGptModel, setSelectedGptModel] = useState('');
    const [assignmentText, setAssignmentText] = useState('');
    const [assignmentModalIsOpen, setAssignmentModalIsOpen] = useState(false);
    const [showAssignmentOverlay, setShowAssignmentOverlay] = useState(false);

    const assignmentButtonRef = useRef();

    const ERROR_CODES = [6, 7, 8, 9, 10, 11, 12];

    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        // Trigger the file input when the button is clicked
        fileInputRef.current.click();
    };

    const handleGptModelChange = (gptModel) => {
        setSelectedGptModel(gptModel);
    };

    /**
     * Handles file upload
     */
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        if (file.name.endsWith('.java')) {
            reader.onload = (e) => {
                const content = e.target.result;
                updateCode(content);
            };

            reader.readAsText(file);
        } else {
            alert('Bitte wähle eine Java-Datei aus.');
        }
    };

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
                {line.trim().length > 0 ? line.trim() : <br/>}
            </div>
        ), [assignmentText]);

    return (
        <AppBar position="static" sx={{backgroundColor: 'white'}}>
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <div>
                        {showAssignmentOverlay &&
                            <Draggable>
                                <div className="assignment-overlay absolute z-[9999] shadow-xl">
                                    <h2 className={'bg-[#4e293b] rounded-t-md text-white border-b-2 shadow-md flex justify-center'}>
                                        <MdOutlineAssignment size={25}/>
                                        Aufgabe
                                    </h2>
                                    <div
                                        className={`bg-[#4e293b] rounded-b-md text-white text-left font-normal text-m overflow-y-auto shadow-md max-h-96`}>
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
                    <IconButton title="Code kompilieren" onClick={handleCompileClick}>
                        <PlayArrow/>
                    </IconButton>
                    <IconButton title="Compile Error erklären lassen"
                                onClick={() => handleCompileErrorExplanation(selectedGptModel)}>
                        <QuestionMark/>
                    </IconButton>
                    <IconButton title="Code erklären lassen"
                                onClick={() => handleExplainCode(selectedGptModel, assignmentText)}>
                        <Lightbulb/>
                    </IconButton>
                    <IconButton title="Datei speichern" onClick={handleSaveCodeAsFile}>
                        <Save/>
                    </IconButton>
                    <IconButton title="Datei laden" onClick={handleButtonClick}>
                        <UploadFile/>
                    </IconButton>
                    <input
                        id="file-input"
                        type="file"
                        accept=".java"
                        onChange={handleFileUpload}
                        style={{display: 'none'}}
                        ref={fileInputRef}
                    />
                    <IconButton title="Aufgabe hinterlegen"
                                ref={assignmentButtonRef}
                                onClick={() => setAssignmentModalIsOpen(true)}>
                        <Task/>
                    </IconButton>
                    <div>
                        <SelectGptModels transferGptModelToParent={handleGptModelChange}/>
                    </div>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', // Center vertically
                }}>
                    <CodingConcepts/>
                    <button className="bg-red-500 flex-end hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                            onClick={startHelpTour}
                            title="Hilfe anzeigen">
                        Hilfe
                    </button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default ManagementBar;