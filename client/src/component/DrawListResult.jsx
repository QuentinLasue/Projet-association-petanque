import { Button, Col, Form, Row } from "react-bootstrap";
import MatchListResult from "./MatchListResult";

function DrawListResult({draw, drawIndex, results, handleChange}){    
    // On envoi chaque tirage du concours
    return (
        <>
            {/* {Object.values(draw).map((match,index)=>( */}
            {draw.map((match,index)=>(
                <Row key={index}>
                        <MatchListResult 
                        matchs={match}
                        drawIndex={drawIndex}
                        matchIndex={`match-${index + 1}`}
                        value={results[drawIndex][`match-${index + 1}`]}
                        handleChange={handleChange}
                        />
                </Row>
            ))}
        </>
    )
}

export default DrawListResult;