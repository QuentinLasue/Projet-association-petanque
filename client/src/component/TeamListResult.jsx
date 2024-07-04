import { Card, ListGroup } from "react-bootstrap";

function TeamListResult(teams){
    return(
        <Card  border="primary" className="p-0">
            <Card.Header className="bg-primary fw-bold text-light">Equipe</Card.Header>
            <ListGroup variant="">
                {Object.values(teams).map((players)=>(
                    <>
                    {players.map((player, idx)=>(
                        <ListGroup.Item key={idx}>{player.nom} {player.prenom}</ListGroup.Item>
                    ))}
                    </>
                ))}
            </ListGroup>
        </Card>
    )
}

export default TeamListResult;