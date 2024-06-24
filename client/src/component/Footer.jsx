import { Container, Row, Col, Image } from "react-bootstrap";

function Footer(){
    return(
        <footer className="mt-3">
            <Container className="mt-5 bg-primary text-white py-3" fluid>
                <Row className="justify-content-center">
                    <Col>
                            <Image 
                                width="80"
                                height="80"
                                src='../logoAPBBlanc.png'
                                rounded
                            />
                    </Col>
                    <Col>
                        <p>Réalisé avec une API - Node JS - Express</p>
                        <p>ReactJS - Axios - localStorage - BrowserRouter</p>
                    </Col>
                    <Col >
                        <p>Résalisé par Quentin LASUE</p>
                        <p>Lors d'un stage pour l'AP Bailleul</p>
                        <a href="https://www.linkedin.com/in/quentin-lasue/" target="_blank" className="m-2" rel="noreferrer">
                            <Image src="linkedinLogo.png" alt="Logo Linkedin" width="24" height="24"></Image>
                        </a>
                        <a href="https://github.com/QuentinLasue" target="_blank" className="m-2" rel="noreferrer">
                            <Image src="githubLogo.png" alt="Logo Github" width="24" height="24"></Image>
                        </a>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}
export default Footer;