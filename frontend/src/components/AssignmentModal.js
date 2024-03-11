import ReactModal from "react-modal";

/**
 * Dialog to save an assignment
 */
const AssignmentModal = (props) => {

    const {
        assignmentText,
        setAssignmentText,
        modalIsOpen,
        setModalIsOpen,
        buttonRef,
        handleShowAssignmentChange,
        showAssignmentOverlay
    } = props;

    /**
     * Updates the assignmentText for every input change
     * @param event Event
     */
    const handleInputChange = (event) => {
        setAssignmentText(event.target.value);
    };

    /**
     * Close the dialog
     * @param event Event
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        setModalIsOpen(false);
    };

    /**
     * Get button top position to place the dialog box
     * @returns {string} The left position in pixels, or '50%' if not available
     */
    const getButtonTopPosition = () => {
        if (buttonRef.current?.getBoundingClientRect()) {
            return `${buttonRef.current.getBoundingClientRect().top + 50}px`;
        } else {
            return '50%';
        }
    }

    /**
     * Get button left position to place the dialog box
     *
     * @return {string} The left position in pixels, or '50%' if not available
     */
    const getButtonLeftPosition = () => {
        if (buttonRef.current?.getBoundingClientRect()) {
            return `${buttonRef.current.getBoundingClientRect().left}px`;
        } else {
            return '50%';
        }
    }

    return (
        <ReactModal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            shouldCloseOnOverlayClick={false}
            appElement={document.getElementById('root')}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
                content: {
                    backgroundColor: '#fff',
                    position: 'fixed',
                    top: getButtonTopPosition(),
                    left: getButtonLeftPosition(),
                    right: 'auto',
                    bottom: 'auto',
                    padding: '20px',
                    textAlign: 'center',
                },
            }}
        >
            <form onSubmit={handleSubmit}>
                <label className="text-left block mb-2 text-sm font-medium text-black">
                    Aufgabe
                </label>
                <textarea
                    id="assignment-modal"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={assignmentText}
                    onChange={handleInputChange}
                    autoFocus={true}
                    style={{ width: '600px' }}
                />

                <div className="flex items-center mt-4">
                    <input
                        type="checkbox"
                        id="show-assignment"
                        className="mr-2"
                        checked={showAssignmentOverlay}
                        onChange={(event) => handleShowAssignmentChange(event.target.checked)}
                    />
                    <label htmlFor="show-assignment" className="text-sm text-black">
                        Aufgabe als Overlay anzeigen
                    </label>
                </div>

                <button
                    type="submit"
                    className="mt-4 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                >
                    Schließen
                </button>
            </form>
        </ReactModal>
    );
}

export default AssignmentModal;