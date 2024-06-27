import { useState, useEffect, useContext} from "react";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MatchCardList from "../component/MatchCardList";
import BtnTirageConcours from "../component/BtnTirageConcours";
import { AppContext } from "../appContext/AppContext";

function Tirage(){
    const teamSize = 2;
    const{ players, setPlayers, teamsFinish, setTeamsFinish, matchs, setMatchs, nbrDraw, setNbrDraw, setDrawCompetition, drawCompetition, setCompetition, competition, numberCompetition,setNumberCompetition} = useContext(AppContext);
    let teams = [];
    let currentTeam = [];
    let newMatch=[];
    const [tryTocreated, setTryTocreated] = useState(false)
    // Pour stocker les joueurs qui ne peuvent être avec personne
    const [playersAlone, setPlayersAlone] = useState([]);
    // Pour stocker les joueurs non-attribuer a une équipes pour éviter les doublons
    const remainingPlayers = new Set(players);
    // Pour afficher un msg d'erreur si les équipes ne peuvent pu être créer a cause des contraintes
    const [contraintsError, setConstraintsError]= useState("");
    const[error, setError]=useState("");
    // protection boucle trop grande 
    let permutationLimit = 50;
    let navigate = useNavigate();

    // mélange de Knuth
    const shuffleArray=(array)=> {
        const newArray = array.slice(); // Copie du tableau pour éviter de modifier l'original
        for (let i = newArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Échange des éléments
        }
        return newArray;
      }

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
                    // On ajoute son nouveau partenaire dans la liste teammates de chacun des deux joueurs
                    updatedTeammatesList(player, randomTeammate.numero)
                    updatedTeammatesList(randomTeammate, player.numero)
                // Si il ne reste qu'un joueur a assigné
            } else if(remainingPlayers.size === 1){
                let addedToTeam = false;
                for(let i=0;i<teams.length ; i++){
                    const randomTeam = teams[i];
                    if(randomTeam.every(p => !player.teammates.includes(p.numero))){
                        for(let rp of randomTeam){
                            updatedTeammatesList(player, rp.numero);
                            updatedTeammatesList(rp, player.numero);
                        }
                        randomTeam.push(player);
                        remainingPlayers.delete(player);
                        addedToTeam = true;
                        break;
                    }
                }
                if(!addedToTeam){
                    setPlayersAlone([...playersAlone, player]);
                }
            }else if(teams.length>0 && teams.some(team => team.length === teamSize)){
                // si pas de joueurs possible restant, on parcours les équipes à la recherche d'un joueurs possible
                for(const team of teams) {

                    if(permutationLimit <= 0){
                        setPlayersAlone([...playersAlone, player]);
                        remainingPlayers.delete(player);
                        setConstraintsError("La formation des équipes est impossible en respectant les contraintes de coéquipiers. Vous pouvez réinitialiser la liste d'équipes.");
                        break;
                    }
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
                        permutationLimit--;
                        console.log(permutationLimit);
                        selectRandomPlayer(newPlayerAlone);
                        break;
                    }else {
                        // gérer le cas ou aucun partenaire valide existe
                        setPlayersAlone([...playersAlone, player]);
                        remainingPlayers.delete(player);
                    }
                }
            }else {
                setConstraintsError("Impossible de créer de nouvelles équipes à cause des contraintes, veuillez réinitialiser la liste des joueurs.")
            }
        }
    };
    
    const teamBalancing = ()=>{
        // Sélectionne une équipe à redistribuer
        const teamToRedistribute = teams.find(team=> team.length === 2);
        if(teamToRedistribute){
            //stocker l'équipe retirer
            const playersToRedistribute = teamToRedistribute
            // retirer le coéquipier qui va changer de la liste ou on l'a ajouter à la création de l'équipe
            removeTeammatesList(playersToRedistribute[0],playersToRedistribute[1].numero);
            removeTeammatesList(playersToRedistribute[1],playersToRedistribute[0].numero);
            // Retire cette équipe
            teams.splice(teams.indexOf(teamToRedistribute),1);
            // On essaye de redistribuer les joueurs dans des équipes valide 
            playersToRedistribute.forEach(player=>{
                let redistributed = false;
                for(let team of teams){
                    if(team.length === 2 && team.every(p => !player.teammates.includes(p.numero))){
                        // on met a jour les liste des teammates
                        for(let rp of team){
                            updatedTeammatesList(player, rp.numero);
                            updatedTeammatesList(rp, player.numero);
                        }
                        // t on ajoute le joueurs dans l'équipe
                        team.push(player);
                        redistributed = true;
                        break;
                    }
                }
                // si pas d'équipe on le met dans le tableau des joueurs seul
                if(!redistributed){
                    setPlayersAlone([...playersAlone, player]);
                }
            })
        }
    }
    // tirage au sort des rencontres
    const randomDrawMatchs = ()=>{
        if(matchs.length ===0){
            // Sépare les équipes de 2 et 3 joueurs 
            const teamOf3 = teamsFinish.filter(team=> team.length ===3);
            const teamOf2 = teamsFinish.filter(team=> team.length ===2);
            // Sachant que le nombre d'équipe total est paires, si un des groupes est impaires 
            if(teamOf3.length %2 !== 0 ){
                // alors on prend une équipe de 3 et on le met dans le groupe de 2
                const teamToMove = teamOf3.pop();
                teamOf2.push(teamToMove);
            }
            drawMatchs(teamOf3);
            drawMatchs(teamOf2);
    
            setMatchs(newMatch);
            if(competition){
                setDrawCompetition([...drawCompetition, newMatch]);
            }
        }
    }
    const drawMatchs = (teams)=>{
        // Pour stocker les équipes non attribuer pour le tirage au sort 
        const remainingTeams = new Set(teams)
        
        for (const team of teamsFinish){
            if(remainingTeams.has(team)){
                remainingTeams.delete(team);
                const teamsArray = Array.from(remainingTeams)
                const team2 = teamsArray[Math.floor(Math.random()* teamsArray.length)];
                remainingTeams.delete(team2);
                newMatch.push({
                    team1: team,
                    team2: team2,
                });
            }
        }
    }

    const updatedTeammatesList = (player, numberToAdd)=>{
        const updatedPlayers = players.map(p => {
            if (player.numero === p.numero){
                player.teammates.push(numberToAdd);
                return p;
            }else{
                return p;
            }
        })
        setPlayers(updatedPlayers);
    }
    const removeTeammatesList = (player, numberToRemove)=>{
        const updatedPlayers = players.map(p => {
            if (player.numero === p.numero){
                player.teammates.splice(player.teammates.indexOf(numberToRemove),1);
                return p;
            }else{
                return p;
            }
        })
        setPlayers(updatedPlayers);
    }

    const createTeams = ()=>{
        if(players.length>=8){
            setTryTocreated(true);
            setNbrDraw(nbrDraw+1);
            if(nbrDraw>3){
                navigate('/limiteNombrePartie');
                return;
            }
            while(remainingPlayers.size !=0){
                // Formations des  équipes 
                const shuffleList = shuffleArray(Array.from(remainingPlayers));
                for (const player of shuffleList){
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
            setTeamsFinish(teams);
            
        }else{
            setError("Il faut 8 joueurs minimum pour former des équipes valident pour les 4 parties.")
        }
    }   
    const deleteDraw = ()=> {
        let confirm = window.confirm("Êtes-vous sure de vouloir tirer le tirage suivant ? celui en cours seras éffacé.");
        if(confirm){
            setMatchs([]);
            setTeamsFinish([]);
            setTryTocreated(false);
            setPlayersAlone([]);
            createTeams();
        }
    }
    const cancelDraw= ()=>{
        let confirm = window.confirm("Êtes-vous sure de vouloir annuler le tirage ?");
        if(confirm){
            // on retire les joueurs de la liste des joueurs interdit les uns des autres
            for(let team of teamsFinish){
                removeTeammatesList(team[0], team[1].numero);
                removeTeammatesList(team[1], team[0].numero);
                if(team.length === 3 ){
                    removeTeammatesList(team[0],team[2].numero);
                    removeTeammatesList(team[1],team[2].numero);
                    removeTeammatesList(team[2],team[0].numero);
                    removeTeammatesList(team[2],team[1].numero);
                }
            }
            //  on supprime le concours lancé si il n'a eu que le tirage qu'on a annulé
            if(nbrDraw - 1 === 0  && competition){
                setCompetition(false)
                setDrawCompetition(false);
                // supprimer le concours lancé avec requéte avec l'id qu'on arécupérer
                setNumberCompetition(false)
                // si eu plusieur tirage ont annule juste le précédent
            }else if (nbrDraw - 1 > 0 && competition){
                // on enléve le tirage enregistrer
                setDrawCompetition(drawCompetition.slice(0,-1))
            }
            // on réinitialise les équipes, les matchs, et on retire un aux nombre de tirage effectué
            setNbrDraw(nbrDraw-1);
            setTeamsFinish([]);
            setMatchs([]);
            setTryTocreated(false);
        }
    }
    useEffect(()=>{
        if(teamsFinish.length > 0 ){
            randomDrawMatchs();
        }
   },[teamsFinish]) // à exécuter à la mise a jours de teamsfinish

    return(
            <Container>
                {contraintsError ? (
                    <h1 className="mb-3 text-danger">{contraintsError} </h1>
                ):(
                <>
                {
                playersAlone.length !== 0 && teamsFinish.length > 0  && matchs.length > 0? (
                <Row className="justify-content-center">
                        <Card  border="danger" className="m-2 w-25 p-0">
                        <Card.Header className="bg-danger fw-bold text-light">Liste  joueur(s) sans équipe possible</Card.Header>
                        <ListGroup variant="">
                    {playersAlone.map((player,index)=>(
                          <ListGroup.Item key={index}>{player.nom} {player.prenom}</ListGroup.Item>
                        ))}
                        </ListGroup>
                      </Card>
                </Row>
                ):('')
                }
                { teamsFinish.length > 0  && matchs.length>0 ?(
                    <>
                    <Row className="justify-content-center mb-3">
                    <h1 className="mb-3">Tirage n°{nbrDraw} : </h1>
                    <MatchCardList matchs={matchs} teamsFinish={teamsFinish}/>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="danger" size="lg" onClick={cancelDraw}>Annuler le tirage en cours</Button>
                        </Col>
                        <Col>
                            <Button variant="warning" size="lg" onClick={deleteDraw}>Passer aux tirage suivant</Button>
                        </Col>
                    </Row>
                    </>
                ):(
                    <Row>
                    {tryTocreated && teamsFinish.length === 0  && matchs.length === 0? (
                        <Co>
                            <h1 className="mb-3 text-danger">Les équipes n'ont pas pu être faites. Veuillez réinitialiser la liste des joueurs.  </h1>
                            <p>Les joueurs ont déjà joué ensemble.</p>
                        </Co>
                    ):(
                        <Col>
                        <Row>
                            <Col>
                            <h1 className="mb-3">Vous n'avez pas encore lancer de tirage.</h1>
                            <p className="mb-3 text-danger">{error} </p>
                            <Button className="m-3 mx-5" variant="primary" size="lg" onClick={createTeams}>{competition ? "Lancer le tirage ":"Tirage d'entraînement" }</Button>
                            </Col>
                        </Row>
                            <BtnTirageConcours createTeams={createTeams}/>
                        </Col>
                    )}
                    </Row>
                )
                }
                </>
                )}
            </Container>
    )

}

export default Tirage;