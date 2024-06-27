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
import { Container } from 'react-bootstrap';
import { AppProvider } from './appContext/AppContext';

function App() {

  return (
    <>
    <AuthProvider>
      <AppProvider>
      <BrowserRouter>
        <div className='app-container'>
          <NavBar/>
          <Container className='flex-grow-1'>
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
            </Routes>
          </Container>
          <Footer/>
        </div>
      </BrowserRouter>
      </AppProvider>
    </AuthProvider>
    </>
  )
}

export default App
