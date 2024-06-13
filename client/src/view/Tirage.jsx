import { useState, useEffect} from "react";
import { Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

function Tirage(){
    // const { numberPlayerTeam } = useParams();
    // taille des équipe en fonction de la valeur reçu
    // const teamSize = numberPlayerTeam === "true" ? 3:2;
    const teamSize = 2;
    const [players, setPlayers] = useState(JSON.parse(localStorage.getItem('players'))||[])
    const teams = [];
    // Pour stocker les joueurs qui ne peuvent être avec personne
    const playersAlone = [];
    // Pour stocker les joueurs attribuer a une équipes pour éviter les doublons
    const remainingPlayers = new Set(players);
    let currentTeam = [];

   const selectRandomPlayer = (player)=> {
        // Si le joueurs na pas été assigné encore
        if(remainingPlayers.has(player)){
            // initialise la liste de tous les joueurs a une liste moins les joueurs assigné et moins les joueurs interdits
            let validTeammates = players.filter(p => !player.teammates.includes(p.numero) && remainingPlayers.has(p));
            // Si la liste de coéquipier possible a un élément au moins
            if(validTeammates.length > 0){
                // on en selectionne un au hazard par son index
                const randomTeammate = validTeammates[Math.floor(Math.random()*validTeammates.length)];
                // Si le joueur trouvé n'est pas assigné a une équipe
                    // on envoi le joueur dans une équipe et son coéquipier également
                    currentTeam.push(player, randomTeammate);
                    // et on ajoute les deux joueurs a a liste des jouers affecté à une équipe
                    remainingPlayers.delete(player);
                    remainingPlayers.delete(randomTeammate);
                // Si il ne reste qu'un joueur a assigné
            } else if(remainingPlayers.size === 1){
                // On selectionne une équipe au hazard et on vérifie si le joueur peut être avec ses joueurs
                    const indexRandom = Math.floor(Math.random()*teams.length);
                    const randomTeam = teams[indexRandom];
                    if(randomTeam.every(p => !player.teammates.includes(p.numero))){
                                randomTeam.push(player);
                                remainingPlayers.delete(player);
                     // si il ne peut pas on relance pour trouver une autre équipe. 
                    }else {
                        selectRandomPlayer(player);
                    }
            }else {
                // si pas de joueurs possible restant, on parcours les équipes à la recherche d'un joueurs possible
                for(const team of teams) {
                    const validPartner = team.find(p => !player.teammates.includes(p.numero));
                    if (validPartner){
                        // on va cherche l'index du joueurs dans son tableau d'équipes
                        const index = team.findIndex(p => p.numero === validPartner.numero)
                        // on va chercher son partenaires actuelle 
                        let partnerIndex;
                        index === 0 ? partnerIndex = 1: partnerIndex= 0;
                        const newPlayerAlone = team[partnerIndex];
                        // on enléve le joueur  a remplacer et le rajoute dans les joueurs restant a attribuer
                        remainingPlayers.add(newPlayerAlone);
                        team.splice(partnerIndex,1);
                        // on ajoute notre joueur et on l'enléve des joueurs restant
                        team.push(player);
                        remainingPlayers.delete(player);
                        // je lance la recherche pour le joueur que l'on viens de rajouter
                        selectRandomPlayer(newPlayerAlone);
                        break;
                    }else {
                        // gérer le cas ou aucun partenaire valide existe
                        playersAlone.push(player);
                        remainingPlayers.delete(player);
                    }
                }
            }
        }
    };

    const teamBalancing = ()=>{
        // Sélectionne une équipe à redistribuer
        const teamToRedistribute = teams.find(team=> team.length === 2);
        if(teamToRedistribute){
            //stocker l'équipe retirer
            const playersToRedistribute = teamToRedistribute
            // Retire cette équipe
            teams.splice(teams.indexOf(teamToRedistribute),1);
            // On essaye de redistribuer les joueurs dans des équipes valide 
            playersToRedistribute.forEach(player=>{
                let redistributed = false;
                for(let team of teams){
                    if(team.length === 2 && team.every(p => !player.teammates.includes(p.numero))){
                        console.log(team);
                        team.push(player);
                        redistributed = true;
                        break;
                    }
                }
                // si pas d'équipe on le met dans le tableau des joueurs seul
                if(!redistributed){
                    playersAlone.push(player);
                }
            })
        }
    }
   // constitution des équipes à la création du composant
   useEffect(()=>{
    while(remainingPlayers.size !=0){
        // Formations des  équipes 
        for (const player of Array.from(remainingPlayers)){
            if(currentTeam.length < teamSize){
                selectRandomPlayer(player);
                // si la longeur de l'équipe est atteinte ou tous les joueurs on été assigné a une équipe (pour gérer un nombre de joueurs impaire)
                if(currentTeam.length === teamSize){
                    teams.push(currentTeam);
                    currentTeam = [];
                }
            }
        }
    }
    if (teams.length % 2 !== 0 ){
        teamBalancing();
    }
    console.log(teams);
    console.log(remainingPlayers);
    console.log(playersAlone);
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