import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from './component/NavBar'
import Entrainement from './view/Entrainement'
import Tirage from './view/Tirage'
import LimiteNombrePartie from './view/LimiteNombrePartie';
import Error from './view/Error';
import AuthRouter from './Auth/AuthRouter';
import AuthGuard from './authGuard/AuthGuard';
import AdminRouter from './view/admin/AdminRouter';
import { AuthProvider } from './Auth/AuthContext';
import Footer from './component/Footer';

function App() {

  return (
    <>
    <AuthProvider>
      <BrowserRouter>
        <NavBar/>
    
        <Routes>
          <Route index path="/" element={<Entrainement/>}></Route>
          <Route path="/tirage" element={<Tirage/>}></Route>
          <Route path="/limiteNombrePartie" element={<LimiteNombrePartie/>}></Route>
          <Route path="/auth/*" element={<AuthRouter/>}></Route>
          <Route path="/admin/*" element={
            <AuthGuard>
              <AdminRouter/>
            </AuthGuard>
          }></Route>
          <Route path="*" element={<Error/>}></Route> 
          {/* <Route path="/tirage/:numberPlayerTeam" element={<Tirage/>}></Route> */}
        </Routes>
        <Footer/>
      </BrowserRouter>
    </AuthProvider>
    </>
  )
}

export default App
