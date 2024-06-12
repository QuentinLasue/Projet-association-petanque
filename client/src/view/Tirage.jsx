import { useState, useEffect} from "react";
import { Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

function Tirage(){
    const { numberPlayerTeam } = useParams();
    // taille des équipe en fonction de la valeur reçu
    const teamSize = numberPlayerTeam === "true" ? 3:2;
    const [players, setPlayers] = useState(JSON.parse(localStorage.getItem('players'))||[])
    const teams = [];
    // Pour stocker les joueurs attribuer a une équipes pour éviter les doublons
    const assignedPlayers = new Set();
    let currentTeam = [];

    // function pour vérifié si les joueurs on déjà jouer ensemble avec un troisième joueurs optionnel
    // const havePlayedTogether =(player1 , player2 , player3 = false)=>{
    //     // on parcours le tableau a la recherche du numero de l'autre joueurs
    //     const havePlayed = player1.teammates.includes(player2.numero) && player2.teammates.includes(player1.numero);
    //     // Si 3ème joueur renseigné
    //     if(player3){
    //         // on vérifie en rappellant cette function si il a jouer avec l'un des deux joueurs
    //         const havePlayedWidthThird = havePlayedTogether(player1,player3) && havePlayedTogether(player2,player3);
    //         return havePlayedWidthThird && havePlayed;
    //     }else{
    //         return havePlayed;
    //     }
    // }

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

   const selectRandomPlayer = (player)=> {
       
        // vérifie les coéquipiers
        const validTeammates = players;
        // Si le joueurs na pas été assigné encore
        if(!assignedPlayers.has(player)){
            // parcours le tableau en enlevant ceux qui ont un numero inclus dans teammates
            if(player.teammates.length!==0){
                for(let i = 0; i < player.teammates.length; i++){
                    validTeammates.filter((p)=> p.numero !== player.teammates[i]);
                }
            }
            // Si la liste de coéquipier possible a un élément au moins
            if(validTeammates.length > 0){
                // on en selectionne un au hazard par son index
                const randomTeammate = validTeammates[Math.floor(Math.random()*(validTeammates.length - 1))];
                // Si le joueur trouvé n'est pas assigné a une équipe
                if(!assignedPlayers.has(randomTeammate) && randomTeammate){
                    // on envoi le joueur dans une équipe et son coéquipier également
                    currentTeam.push(player);
                    currentTeam.push(players.find((player)=>player.numero === randomTeammate.numero))
                    // et on ajoute les deux joueurs a a liste des jouers affecté à une équipe
                    assignedPlayers.add(player);
                    assignedPlayers.add(players.find((player)=>player.numero === randomTeammate.numero));
                } else {
                    // Si il ne reste qu'un joueur a assigné
                    if(assignedPlayers.size == players.lenght - 1){
                        const indexRandom = Math.floor(Math.random()*(teams.length - 1))
                        // On selectionne une équipe au hazard et on vérifie si le jouer peut être avec ses joueurs
                            const randomTeam = teams[indexRandom];
                            const sizeTeamBeforeVerif = randomTeam.length;
                            // parcours le tableau en enlevant ceux qui ont un numero inclus dans teammates
                            for(let i = 0; i < player.teammates.length; i++){
                                randomTeam.filter((p)=> p.numero !== player.teammates[i]);
                            }
                            const sizeTeamAfterVerif = randomTeam.length;
                            if(sizeTeamAfterVerif === sizeTeamBeforeVerif ){
                                // on enléve l'équipe du tableau d'équipe déjà créer car on la rajoute après
                                teams.splice(indexRandom);
                                // on remplace l'équipe par celle retirer et on ajoute le joueur
                                currentTeam = randomTeam;
                                currentTeam.push(player);
                                assignedPlayers.add(player);
                                
                            }else {
                                // Sinon on rappel la fonction pour retrouver une équipe possible
                                selectRandomPlayer(player);
                            }
                    }else {
                        // sinon on rappel la fonction pour trouver un autre joueur
                        selectRandomPlayer(player);
                    }
                }
            } else {
                const indexRandom = Math.floor(Math.random()* (players.length - 1));
                const randomTeammate = players[indexRandom];
                // si le jouer random n'est pas assigné
                if(!assignedPlayers.has(randomTeammate)){
                    // on envoi le joueur dans une équipe et son coéquipier également
                    currentTeam.push(player);
                    currentTeam.push(players.find((player)=>player.numero === randomTeammate.numero))
                    // et on ajoute les deux joueurs a a liste des jouers affecté à une équipe
                    assignedPlayers.add(player);
                    assignedPlayers.add(players.find((player)=>player.numero === randomTeammate.numero));
                } else {
                    // Si il ne reste qu'un joueur a assigné
                    if(assignedPlayers.size == players.lenght - 1){
                        const indexRandom = Math.floor(Math.random()*(teams.length - 1))
                        // On selectionne une équipe au hazard
                        const randomTeam = teams[indexRandom];
                        // on enléve l'équipe du tableau d'équipe déjà créer car on la rajoute après
                        teams.splice(indexRandom);
                        // on remplace l'équipe par celle retirer et on ajoute le joueur
                        currentTeam = randomTeam;
                        currentTeam.push(player);
                        assignedPlayers.add(player);
                   }
                }
            }
        }
   }

//    // Formations des  équipes 
//    for (const player of players){
//     if(currentTeam.length < teamSize){
//          selectRandomPlayer(player);
//         // si la longeur de l'équipe est atteinte ou tous les joueurs on été assigné a une équipe (pour gérer un nombre de joueurs impaire)
//         if(currentTeam.lenght == teamSize || assignedPlayers.size === players.length){
//             teams.push(currentTeam);
//             currentTeam = [];
//         }else {
//             selectRandomPlayer(player);
//         }
//     }
//    }
   // Mélange les joueurs à la création du composant et constitution des équipes
   useEffect(()=>{
    const newTablePlayers = mixPlayers(players);
    setPlayers(newTablePlayers);
    // Formations des  équipes 
    for (const player of players){
        if(currentTeam.length < teamSize){
            selectRandomPlayer(player);
            // si la longeur de l'équipe est atteinte ou tous les joueurs on été assigné a une équipe (pour gérer un nombre de joueurs impaire)
            if(currentTeam.length == teamSize || assignedPlayers.size === players.length){
                teams.push(currentTeam);
                currentTeam = [];
            }else {
                selectRandomPlayer(player);
            }
        }
    }
    console.log(teams);
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