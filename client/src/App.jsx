import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from './component/NavBar'
import Entrainement from './view/Entrainement'
function App() {

  return (
    <>
      <BrowserRouter>
        <NavBar/>
    
        <Routes>
          <Route index path="/" element={<Entrainement/>}></Route>
          <Route></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
