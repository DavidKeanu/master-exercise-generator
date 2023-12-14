import ReactModal from 'react-modal';
import { useContext, useState, useCallback, useMemo } from "react";
import AppContext from "../contexts/AppContext";
import DbService from "../services/DbService";

/**
 * Dialog box to retrieve Matrikelnummer from the user
 */
const StudentIdentifierModal = () => {

  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [inputValue, setInputValue] = useState('');

  const { setSitzungsId, setLoading } = useContext(AppContext);

  const closeModal = useCallback(() => {
    setModalIsOpen(false);
  }, [setModalIsOpen]);

  const handleInputChange = useCallback((event) => {
    setInputValue(event.target.value);
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setLoading(true);

    if (inputValue.trim() !== '') {
      DbService.createSession(inputValue.trim()).then( sitzungsId => {
        setSitzungsId(sitzungsId);
        }).finally(() => {
        setLoading(false);
        closeModal();
      });
    }
  }, [inputValue, setLoading, setSitzungsId, closeModal]);

  const modalStyles = useMemo(() => ({
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
      backgroundColor: '#fff',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      maxWidth: '400px',
      padding: '20px',
      textAlign: 'center',
    },
  }), []);

  return (
    <ReactModal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={false}
      style={modalStyles}
      appElement={document.getElementById('root')}
    >
      <form onSubmit={handleSubmit}>
        <label className="text-left block mb-2 text-sm font-medium text-black">
          Matrikelnummer
        </label>
        <input type="text" id="student_identifier"
               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               placeholder="sXXXXXXX" value={inputValue}
               onChange={handleInputChange}
               required
               autoFocus={true}/>
        <p id="helper-text-explanation" className="text-left mt-2 text-sm text-gray-500 dark:text-gray-400">
          Die Matrikelnummer wird nur verwendet um intern den Fortschritt festzuhalten. Es muss jedes mal die gleiche Matrikelnummer eingegeben werden.
        </p>
        <button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
          Fortfahren
        </button>
      </form>
    </ReactModal>
  );
}

export default StudentIdentifierModal;