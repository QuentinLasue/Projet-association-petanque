import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Col, Image, Row, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BtnConnexion from './BtnConnexion';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Auth/AuthContext';

function NavBar() {
    const {isLogged } = useContext(AuthContext);
    const [loggedIn,setLoggedIn]= useState(isLogged())

    useEffect(() => {
      setLoggedIn(isLogged());
    }, [isLogged])

  return (
    <header className='mb-5'>
        <Navbar bg="primary" data-bs-theme="dark" className='justify-content-between'>
                <Navbar.Brand>
                    <Link to="/">
                        <Image 
                            width="80"
                            height="80"
                            src='../logoAPBBlanc.png'
                            rounded
                            />
                    </Link>
                </Navbar.Brand>
                <Nav className="me-auto">
                    <Link to="/">
                        <Button>Liste des joueurs</Button>
                    </Link>
                    <Link to="/tirage">
                        <Button>Tirage</Button>
                    </Link>
                    {!loggedIn ? (""):(
                        <Link to="/admin">
                        <Button>Liste des membres</Button>
                    </Link>
                    )}
                     
                </Nav>
                <BtnConnexion/>
        </Navbar>
    </header>
  );
  }

export default NavBar;