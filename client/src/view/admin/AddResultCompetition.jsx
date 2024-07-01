import { useContext } from "react";
import { AppContext } from "../../appContext/AppContext";
import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import DrawListResult from "../../component/DrawListResult";


function AddResultCompetition(){
    const {drawCompetition, setDrawCompetition }=useContext(AppContext)

    return (
        <>
        { drawCompetition.length ? (
            <Row>
                {drawCompetition.map((draw, index)=>(
                    <DrawListResult draw={draw} key={index}/>
                ))}

            </Row>
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