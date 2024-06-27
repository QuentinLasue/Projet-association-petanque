import { useContext, useEffect, useState } from "react";
import { Button, Row, Col } from "react-bootstrap"
import { AuthContext } from "../Auth/AuthContext";

function BtnTirageConcours({createTeams, nbrDraw}){
    const {isLogged} = useContext(AuthContext);

    // modification : utilisation du context plutot que du local storage pour stocker les équipes, les matchs et le nbr de tirage (voir chat GPT pour explication)
    const createConcours=(type)=>{
        // selection du type de concours 2€ ou interne
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