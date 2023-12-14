import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./components/Home";
import {AppContextProvider} from "./contexts/AppContext";

function App() {
  return (
    <div className="App">
      <AppContextProvider>
        <Home/>
      </AppContextProvider>
    </div>
  );
}

export default App;
