import { useContext, useEffect, useState } from "react";
import { Button, Row, Col } from "react-bootstrap"
import { AuthContext } from "../Auth/AuthContext";
import { AppContext } from "../appContext/AppContext";

function BtnTirageConcours({createTeams}){
    const {isLogged} = useContext(AuthContext);
    const {competition, setCompetition, nbrDraw} = useContext(AppContext);
    // Récupération du token dans le local storage sui il existe
    const token = localStorage.getItem('accessToken');
    // Configuration du headers pour inclure le token JWT
    const headers = {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
    const createConcours=(type)=>{
        setCompetition(true);

        // créer un concours en base de donné avec la date du jours et le type de concours si il n'y en a pas 
        // dans tirage ne pas oublier de faire vérification si un concours existe avec de créer de nouvelle équipes.

        // Création des équipes 
        // createTeams();
    }
    return(
        <>
            {isLogged() && nbrDraw===0 ? (
            <Row>
                <Col>
                    <Button className="m-3 mx-5" variant="warning" size="lg" onClick={()=>createConcours(1)}>Tirage concours interne</Button>
                    <Button className="m-3 mx-5" variant="warning" size="lg" onClick={()=>createConcours(2)}>Tirage concours 2€</Button>
                </Col>
            </Row>
            ):("")}
        </>
    )
}

export default BtnTirageConcours;