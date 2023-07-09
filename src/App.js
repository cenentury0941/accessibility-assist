import './App.css';
import { BrowserRouter , Route , Routes} from 'react-router-dom';
import { ThemeProvider, createTheme } from "@mui/material/styles";

import Landing from './components/Landing';
import Tour from './components/Tour';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FFF",
      dark: "#fff"
    },
    secondary: {
      main: "#FFFFFF",
      dark: "#fff"
    }
  }
});

const firebaseConfig = {

  apiKey: "AIzaSyDediO1CPm4T60pxMLhuimFI3xIFQD7rbw",

  authDomain: "verify-bot-ennovate.firebaseapp.com",

  databaseURL: "https://verify-bot-ennovate-default-rtdb.firebaseio.com",

  projectId: "verify-bot-ennovate",

  storageBucket: "verify-bot-ennovate.appspot.com",

  messagingSenderId: "656544899745",

  appId: "1:656544899745:web:977f5c9b78d1dfee7a06e0",

  measurementId: "G-2842XBLZSE"

};


// Initialize Firebase
const app2 = initializeApp(firebaseConfig, "ts");


// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app2);

var ts = new Date().toString()

set(ref(database, 'ts/' + Date.now()), {
  timestamp : ts
});



function App() {
  return (
    <ThemeProvider theme={theme}>
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route path="access/" element={<Landing/>}/>
          <Route path="access/tour/" element={<Tour/>}/>
          </Routes>  
      </BrowserRouter>

    </div>
    </ThemeProvider>
  );
}

export default App;
