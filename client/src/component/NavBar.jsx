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

        <Navbar expand="md" className="bg-primary" variant="dark">
      <Container>
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
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link >
                <Link to="/">
                    <Button>Liste des joueurs</Button>
                </Link>
            </Nav.Link>
            <Nav.Link>
                <Link to="/tirage">
                    <Button>Tirage</Button>
                </Link>
            </Nav.Link>
            {!loggedIn ? (""):(
            <Nav.Link>
                <Link to="/admin">
                    <Button>Liste des membres</Button>
                </Link>
            </Nav.Link>
                    )}
          </Nav>
          <Nav>
            <BtnConnexion/>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </header>
  );
  }

export default NavBar;