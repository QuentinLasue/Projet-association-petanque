import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Image } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

function NavBar() {

  return (
    <header className='mb-5'>
        <Navbar bg="primary" data-bs-theme="dark">
            <Container>
                <Navbar.Brand>
                    <Link to="/">
                        <Image 
                            width="120"
                            height="60"
                            src='../logo.jpg'
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
                    <Link to="/">
                        <Button>Administrateur</Button>
                    </Link>
                </Nav>
                
            </Container>
        </Navbar>
    </header>
  );
  }

export default NavBar;