import { Col, Form, Row} from "react-bootstrap";
import TeamListResult from "./TeamListResult";

function MatchListResult({matchs, drawIndex, matchIndex, value, handleChange}){
    // On envoi chaque équipe du match du tirage
    return(
        <Row className="justify-content-center">
            {/* {Object.values(matchs).map((match,index)=>(
                <> */}
                <Col  md={6} className="mb-3">
                <Row>
                    <p>Vainqueur match n°{matchIndex}</p>
                </Row>
                <Row>
                    <Col className="mb-3">
                        <Form.Group >
                            <Form.Label htmlFor={`team-1-${matchIndex}`} className="d-flex justify-content-center">
                                <TeamListResult teams={matchs.team1} />
                            </Form.Label>
                            <Form.Check 
                            type="radio" 
                            name={matchIndex} 
                            id={`team-1-${matchIndex}`}  
                            className="custom-radio" 
                            value={matchs.team1}
                            checked={value === matchs.team1}
                            onChange={() => handleChange(drawIndex, matchIndex, matchs.team1)}
                            required
                            />
                        </Form.Group>
                    </Col>
                    <Col className="mb-3">
                        <Form.Group>
                            <Form.Label htmlFor={`team-2-${matchIndex}`} className="d-flex justify-content-center">
                                <TeamListResult teams={matchs.team2} />
                            </Form.Label>
                            <Form.Check 
                            type="radio" 
                            name={matchIndex} 
                            id={`team-2-${matchIndex}`} 
                            className="custom-radio" 
                            value={matchs.team2} 
                            checked={value === matchs.team2}
                            onChange={() => handleChange(drawIndex, matchIndex, matchs.team2)}
                            required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                </Col>
                {/* </>
            ))} */}
        </Row>
    )
}

export default MatchListResult;