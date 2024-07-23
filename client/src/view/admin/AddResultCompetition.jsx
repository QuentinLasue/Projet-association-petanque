import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../appContext/AppContext";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import DrawListResult from "../../component/DrawListResult";


function AddResultCompetition(){
    const {drawCompetition, setDrawCompetition }=useContext(AppContext);
    const [error, setError]= useState("");
    const [success, setSuccess]= useState("");

    const initialResultsState = drawCompetition.reduce((acc, draw, index)=>{
        const savedResults =JSON.parse(localStorage.getItem('results'))|| {};
        acc[index]=savedResults[index] || {};
        draw.forEach((match, matchIndex) => {
            if(!acc[index][`match-${matchIndex + 1}`]){
                acc[index][`match-${matchIndex + 1}`]= '';
            }
        });
        return acc;
    },{});

    const [results, setResults]= useState(initialResultsState);
    const [finalResults, setFinalResults]= useState(initialResultsState); 
    // sauvegarde dans le localstorage a chaque envoi des resultats
    useEffect(() => {
      localStorage.setItem('results', JSON.stringify(finalResults))

    }, [finalResults]);
    

    const handleChange = (drawIndex, matchIndex, value)=>{
        setResults({
            ...results,
            [drawIndex]: {
                ...results[drawIndex],
                [matchIndex]: value
            }}
        )
    }
    const handleSubmit=(index)=>{
        setError('');
        setSuccess('');
        // vérifier si tous les résultats sont entrée pour le tirage envoyer
        let allFieldsFilled = true;

        for(let matchKey in results[index]){
            if( results[index][matchKey] ===''){
                allFieldsFilled = false;
                break;
            }
        }

        if(allFieldsFilled){
            // enregistrer les résultats
            setFinalResults(results);
            //faire disparaitre le tirage qui a était envoyé.
            setSuccess(`Les résultats du tirage n°${index+1} ont été envoyé.`)
        }else{
            setError(`Les résultats entrée ne sont pas complet pour le tirage n°${index+1}.`)
        }
        // Sinon message d'erreur ?
    }
    const handleSend = (event)=>{
        event.preventDefault();
        setError('');
        setSuccess('');
        const listWinner = extractIdMembre(results);
        console.log(listWinner);
        if(Array.isArray(listWinner)){
            console.log('resultat ok');
        }else{
            // gérer le cas ou listWinner est le msg d'erreur de resultats manquant 
            setError(listWinner);
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
                {error && <p style={{ color: 'red' }} className="mb-3">{error}</p>}
                {success && <p style={{ color: 'green' }} className="mb-3">{success}</p>}
                {drawCompetition.map((draw, index)=>(
                    <Row className="mb-3" key={index}>
                        <Form onSubmit={(event)=>{
                                event.preventDefault();
                                handleSubmit(index)}
                                }
                            >
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
                <Button variant="warning" onClick={handleSend}>Finaliser l'enregistrement des résultats du concours</Button>
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