import { Button, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function LimiteNombrePartie(){

    return (
        <Container>
            <Row>
                <h1 className="mb-3 text-danger">Limite de 4 partie par entrainement atteinte.</h1>
                <p>Si vous souhaitez continuer vous devez réinitialiser la liste des joueurs.</p>
                <Link to={`/`}>
                    <Button variant="primary" className="mb-3">Retour à la liste des joueurs</Button>
                </Link>
                <p className="fw-lighter fst-italic">Cette limite permet d'éviter les problèmes dans la création d'équipes avec un trop grand nombre de joueurs à replacer manuellement.</p>
            </Row>
        </Container>
    )
}

export default LimiteNombrePartie;