import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from './component/NavBar'
import Entrainement from './view/Entrainement'
import Tirage from './view/Tirage'
function App() {

  return (
    <>
      <BrowserRouter>
        <NavBar/>
    
        <Routes>
          <Route index path="/" element={<Entrainement/>}></Route>
          <Route path="/tirage" element={<Tirage/>}></Route>
          {/* <Route path="/tirage/:numberPlayerTeam" element={<Tirage/>}></Route> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
