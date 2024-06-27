import { Card, Col, ListGroup} from "react-bootstrap";
function MatchCardList({matchs, teamsFinish}){
    return (
        <>
        {
            matchs.map((match,index)=>(
                <Col md={5} className="mb-3 d-flex justify-content-center" key={index}>
                <Card  border="primary" className="w-50 p-0">
                    <Card.Header className="bg-primary fw-bold text-light">Partie n°{index +1}</Card.Header>
                    <ListGroup variant="">
                        {match.team1.map((player,idx)=>(
                            <ListGroup.Item key={idx}>{player.nom} {player.prenom}</ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card>
                    <div className="d-flex align-items-center justify content center mx-2">
                        <h2 className="fw-bold fst-italic">Vs</h2>
                    </div>
                <Card  border="primary" className="w-50 p-0">
                    <Card.Header className="bg-primary fw-bold text-light">Partie n°{index +1}</Card.Header>
                    <ListGroup variant="">
                        {match.team2.map((player,idx)=>(
                            <ListGroup.Item key={idx}>{player.nom} {player.prenom}</ListGroup.Item>
                            ))}
                    </ListGroup>
                </Card>
                </Col>
        ))}
        </>
    )
}
export default MatchCardList;