import { Button, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function Error(){

    return (
        <Container>
            <Row>
                <h1 className="mb-3 text-danger">Le chemin renseigné en URL est inconnue.</h1>
                <Link to={`/`}>
                    <Button variant="primary" className="mb-3">Retour à la liste des joueurs</Button>
                </Link>
            </Row>
        </Container>
    )
}

export default Error;