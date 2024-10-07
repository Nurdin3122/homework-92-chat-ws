import './App.css'
import {Route, Routes} from "react-router-dom";
import Body from "./Container/Body/Body.tsx";
import Header from "./Container/Header/Header.tsx";

const App = () => {


  return (
    <>
        <header>
            <Header/>
        </header>
        <main>
            <Routes>
                <Route path="/" element={<Body/>}/>
            </Routes>
        </main>

    </>
  )
};

export default App
