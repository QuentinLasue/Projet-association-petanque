import { useContext } from "react";
import { AppContext } from "../../appContext/AppContext";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import DrawListResult from "../../component/DrawListResult";


function AddResultCompetition(){
    const {drawCompetition, setDrawCompetition }=useContext(AppContext)

    return (
        <>
        { drawCompetition.length ? (
            <Container>
                {drawCompetition.map((draw, index)=>(
                    <Row>
                        <Form>
                            <h3>Tirage n°{index+1}</h3>
                            <DrawListResult draw={draw} key={index}/>
                            <Button>Envoyer les résultats du tirage n°{index +1}</Button>
                        </Form>
                    </Row>
                ))}

            </Container>
        ):(
            <Row>
                <Col>
                <h1 className="mb-3">Pas de concours en cours.</h1>
                <Link to={`/tirage`}>
                    <Button className="m-3 mx-5" variant="primary" size="lg" >Aller au tirage</Button>
                </Link>
                </Col>
            </Row>
        )}
        </>
    )
}

export default AddResultCompetition;