import { Button, Col, Form, Row } from "react-bootstrap";
import MatchListResult from "./MatchListResult";

function DrawListResult(draw){    
    // On envoi chaque tirage du concours
    return (
        <>
            {Object.values(draw).map((match,index)=>(
                <Row key={index}>
                        <MatchListResult match={match}/>
                </Row>
            ))}
        </>
    )
}

export default DrawListResult;