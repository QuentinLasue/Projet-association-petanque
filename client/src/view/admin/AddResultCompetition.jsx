import { useContext, useState } from "react";
import { AppContext } from "../../appContext/AppContext";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import DrawListResult from "../../component/DrawListResult";


function AddResultCompetition(){
    const {drawCompetition, setDrawCompetition }=useContext(AppContext)

    const initialResultsState = drawCompetition.reduce((acc, draw, index)=>{
        acc[index]={};
        draw.forEach((match, matchIndex) => {
            acc[index][`match-${matchIndex + 1}`]= '';
        });
        return acc;
    },{});

    const [results, setResults]= useState(initialResultsState);

    const handleChange = (drawIndex, matchIndex, value)=>{
        setResults({
            ...results,
            [drawIndex]: {
                ...results[drawIndex],
                [matchIndex]: value
            }}
        )
    }

    const handleSubmit = (event)=>{
        event.preventDefault();
        console.log(results);
    }

    return (
        <>
        { drawCompetition.length ? (
            <Container>
                {drawCompetition.map((draw, index)=>(
                    <Row className="mb-3" key={index}>
                        <Form onSubmit={handleSubmit}>
                            <h3>Tirage n°{index+1}</h3>
                            <DrawListResult 
                            draw={draw} 
                            drawIndex={index} 
                            results={results} 
                            handleChange={handleChange}
                            />
                            <Button type="submit">Envoyer les résultats du tirage n°{index +1}</Button>
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