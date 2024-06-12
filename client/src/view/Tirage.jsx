import { useState, useEffect} from "react";
import { Container, Row } from "react-bootstrap";

function Tirage(){

    const [players, setPlayers] = useState(JSON.parse(localStorage.getItem('players'))||[])

    // function pour vérifié si les joueurs on déjà jouer ensemble avec un troisième joueurs optionnel
    const havePlayedTogether =(player1 , player2 , player3 = false)=>{
        // on parcours le tableau a la recherche du numero de l'autre joueurs
        const havePlayed = player1.teammates.includes(player2.numero) && player2.teammates.includes(player1.numero);
        // Si 3ème joueur renseigné
        if(player3){
            // on vérifie en rappellant cette function si il a jouer avec l'un des deux joueurs
            const havePlayedWidthThird = havePlayedTogether(player1,player3) && havePlayedTogether(player2,player3);
            return havePlayedWidthThird && havePlayed;
        }else{
            return havePlayed;
        }
    }

   // Function pour mélanger le tableau de joueurs algorythme de Fisher-Yates shuffle
   const mixPlayers = (array)=>{
    // Pour chaque élément du tableau
    for(let i = array.length -1; i >0; i--){
        // tirer au sort un nombre compris entre 0 et la taille du tableau - 1 pour correspondre au index
        // floor le plus grand entier proche de celui tirer // random pour tirer un nombre entre 0 et 0.99...
        const j = Math.floor(Math.random()*(i + 1));
        [array[i], array[j]] = [array[j],array[i]]
    }
    return array;
   }
   // Mélange les jouerus à la création du composant
   useEffect(()=>{
    const newTablePlayers = mixPlayers(players);
    setPlayers(newTablePlayers);
   },[]); // Tableau vide pour que cela se produit qu'une fois lors du montage du composant

   useEffect(()=>{
    localStorage.setItem('players', JSON.stringify(players))
    },[players])

    return(
        <>
            <Container>
                <Row>

                </Row>
            </Container>
        </>
    )
}

export default Tirage;