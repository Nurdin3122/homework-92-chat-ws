import './App.css'
import {Route, Routes} from "react-router-dom";
import Body from "./Container/Body/Body.tsx";
import Header from "./Container/Header/Header.tsx";
import CreateUser from "./Components/Users/CreateUser.tsx";
import LoginUser from "./Components/Users/LoginUser.tsx";

const App = () => {


  return (
    <>
        <header>
            <Header/>
        </header>
        <main>
            <Routes>
                <Route path="/" element={<Body/>}/>
                <Route path="/create-user" element={<CreateUser/>}/>
                <Route path="/login-user" element={<LoginUser/>}/>
            </Routes>
        </main>

    </>
  )
};

export default App
