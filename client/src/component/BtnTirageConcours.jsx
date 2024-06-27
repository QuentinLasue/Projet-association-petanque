import { useContext, useEffect, useState } from "react";
import { Button, Row, Col } from "react-bootstrap"
import { AuthContext } from "../Auth/AuthContext";
import { AppContext } from "../appContext/AppContext";
import axios from "axios";

function BtnTirageConcours({createTeams}){
    const {isLogged} = useContext(AuthContext);
    const {setCompetition, nbrDraw, setNumberCompetition} = useContext(AppContext);
    // Récupération du token dans le local storage sui il existe
    const token = localStorage.getItem('accessToken');
    // Configuration du headers pour inclure le token JWT
    const headers = {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
    const createCompetition = async (type)=>{
        try {
            const response = await axios.post(`http://localhost:5000/competition/addCompetition`, {
                type: type,
            },
        { headers }
    );
        setNumberCompetition(response.data.competitionId)
        } catch (error) {
            console.log("Erreur création concours: ", error);
        }
    }
    const launchConcours=(type)=>{
        setCompetition(true);
        // création du concours en BDD
        createCompetition(type);
        // dans tirage ne pas oublier de faire vérification si un concours existe avec de créer de nouvelle équipes et d'enregistrer le tirage si c'est le cas 
        // Création des équipes 
        createTeams();
    }
    return(
        <>
            {isLogged() && nbrDraw===0 ? (
            <Row>
                <Col>
                    <Button className="m-3 mx-5" variant="warning" size="lg" onClick={()=>launchConcours(1)}>Tirage concours interne</Button>
                    <Button className="m-3 mx-5" variant="warning" size="lg" onClick={()=>launchConcours(2)}>Tirage concours 2€</Button>
                </Col>
            </Row>
            ):("")}
        </>
    )
}

export default BtnTirageConcours;