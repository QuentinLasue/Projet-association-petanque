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
        // console.log(results[0]["match-1"][0].id_membre);
        // console.log(results);
        // console.log(results.length);
        const listWinner = extractIdMembre(results);
        console.log(listWinner);
        if(Array.isArray(listWinner)){

        }else{
            // gérer le cas ou listWinner est le msg d'erreur de resultats manquant 
        }
    }

    function extractIdMembre(results) {
        let idMembres =[];
        //Parcours chaque clé dans results
        for(let key in results){
            let numericKey = parseInt(key)
            let matches = results[key];
            // Parcours chaque match dans chaque objet 
            for (let matchKey in matches){
                let matchArray = matches[matchKey];

                // Vérification si matchArray est un tableau (donc que les resultats on étéait envoyer)
            if(Array.isArray(matchArray)){
                // Parcours chaque objet dans matchArray
                matchArray.forEach(item=>{
                    if(item && item.id_membre !== undefined){
                        // Ajoute les numéro des joueurs gagnant au tableau
                        idMembres.push(item.id_membre);
                    }
                })
            }else{
                let error = `Résultat manquant pour le tirage n°${numericKey+1} pour le match n°${matchKey}`
                return error;
            }
            }
        }
        return idMembres;
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
                {/* <Button variant="warning">Finaliser l'envoi des résultats</Button> */}
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