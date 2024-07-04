import { Col, Form, InputGroup, Row} from "react-bootstrap";
import TeamListResult from "./TeamListResult";

function MatchListResult(matchs){

    // On envoi chaque équipe du match du tirage
    return(
        <Row className="justify-content-center">
            {matchs.match.map((match,index)=>(
                <>
                <Col  md={6} className="mb-3" key={index}>
                <Row>
                    <p>Vainqueur match n°{index+1}</p>
                </Row>
                <Row>
                    <Col className="mb-3">
                        <Form.Group >
                            <Form.Label className="d-flex justify-content-center">
                                <TeamListResult teams={match.team1} />
                            </Form.Label>
                            <Form.Check type="radio" name={index+1} className="custom-radio"/>
                        </Form.Group>
                    </Col>
                    <Col className="mb-3">
                        <Form.Group>
                            <Form.Label className="d-flex justify-content-center">
                                <TeamListResult teams={match.team2} />
                            </Form.Label>
                            <Form.Check type="radio" name={index+1} className="custom-radio"/>
                        </Form.Group>
                    </Col>
                </Row>
                </Col>
                </>
            ))}
        </Row>
    )
}

export default MatchListResult;