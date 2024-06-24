import { useState, useEffect} from "react";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

function Tirage(){
    // const { numberPlayerTeam } = useParams();
    // taille des équipe en fonction de la valeur reçu
    // const teamSize = numberPlayerTeam === "true" ? 3:2;
    const teamSize = 2;
    const [players, setPlayers] = useState(JSON.parse(localStorage.getItem('players'))||[]);
    const [teamsFinish, setTeamsFinish] = useState(JSON.parse(localStorage.getItem('teams')) || []);
    let teams = [];
    const [tryTocreated, setTryTocreated] = useState(false)
    // stock la liste des matchs
    const [matchs, setMatchs]= useState(JSON.parse(localStorage.getItem('matchs')) || []);
    let newMatch=[];
    // Pour stocker les joueurs qui ne peuvent être avec personne
    const [playersAlone, setPlayersAlone] = useState([]);
    // Pour stocker les joueurs non-attribuer a une équipes pour éviter les doublons
    const remainingPlayers = new Set(players);
    // Pour afficher un msg d'erreur si les équipes ne peuvent pu être créer a cause des contraintes
    const [contraintsError, setConstraintsError]= useState("");
    const[error, setError]=useState("");
    let currentTeam = [];
    // protection boucle trop grande 
    let permutationLimit = 50;
    // Pour ne pas tirer plus de partie que l'entrainement demande
    const [nbrDraw, setNbrDraw]= useState(JSON.parse(localStorage.getItem('nbrDraw')) || 0)
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
                // On  parcours les équipe pour trouver une équipe valide
                    // const indexRandom = Math.floor(Math.random()*teams.length);
                    // const randomTeam = teams[indexRandom];
                    //  // si il ne peut pas on relance pour trouver une autre équipe. 
                    // }else {
                    //     selectRandomPlayer(player);
                    // }
            }else if(teams.length>0 && teams.some(team => team.length === 2)){
                // si pas de joueurs possible restant, on parcours les équipes à la recherche d'un joueurs possible
                for(const team of teams) {

                    if(permutationLimit <= 0){
                        setPlayersAlone([...playersAlone, player]);
                        remainingPlayers.delete(player);
                        setConstraintsError("La formation des équipes est impossible en respecatant les contraintes de coéquipiers. Vous pouvez réinitialiser la liste d'équipes.");
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
                    team1: teamsFinish.indexOf(team),
                    team2: teamsFinish.indexOf(team2),
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
        if(players.length>=4){
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
            setError("Il faut 4 joueurs minimum pour former des équipes.")
        }
    }   
    const deleteDraw = ()=> {
        setMatchs([]);
        setTeamsFinish([]);
        setTryTocreated(false);
        setPlayersAlone([]);
        createTeams();
    }
    useEffect(()=>{
        if(teamsFinish.length > 0){
            randomDrawMatchs();
        }
   },[teamsFinish]) // à exécuter à la mise a jours de teamsfinish

   useEffect(()=>{
    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('matchs', JSON.stringify(matchs));
    localStorage.setItem('teams', JSON.stringify(teamsFinish));
    localStorage.setItem('nbrDraw', JSON.stringify(nbrDraw));
    },[players, matchs, teamsFinish ,nbrDraw])
    return(
        <>
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
                    <h1 className="mb-3">Tirage des équipes : </h1>
                    {
                    matchs.map((match,index)=>(
                        <Row className="justify-content-center mb-3" key={index}>
                            <Card  border="primary" className="m-2 w-25 p-0">
                                <Card.Header className="bg-primary fw-bold text-light">Equipe n°{match.team1 +1}</Card.Header>
                                <ListGroup variant="">
                                    {teamsFinish[match.team1].map((player,idx)=>(
                                        <ListGroup.Item key={idx}>{player.nom} {player.prenom}</ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card>
                                <Col md={1} className="d-flex align-items-center justify-content-center">
                                    <h2 className="fw-bold fst-italic">Vs</h2>
                                </Col>
                            <Card  border="primary" className="m-2 w-25 p-0">
                                <Card.Header className="bg-primary fw-bold text-light">Equipe n°{match.team2 +1}</Card.Header>
                                <ListGroup variant="">
                                    {teamsFinish[match.team2].map((player,idx)=>(
                                        <ListGroup.Item key={idx}>{player.nom} {player.prenom}</ListGroup.Item>
                                        ))}
                                </ListGroup>
                            </Card>
                        </Row>
                    ))}
                    <Button variant="warning" size="lg" onClick={deleteDraw}>Passer aux tirage suivant</Button>
                    </>
                ):(
                    <>
                    {tryTocreated && teamsFinish.length === 0  && matchs.length === 0? (
                        <>
                        <h1 className="mb-3 text-danger">Les équipes n'ont pas pu être faites. Veuillez réinitialiser la liste des joueurs.  </h1>
                        <p>Les joueurs ont déjà joué ensemble.</p>
                        </>
                    ):(
                        <>
                        <h1 className="mb-3">Vous n'avez pas encore lancer le tirage.</h1>
                        <Button variant="warning" size="lg" onClick={createTeams}>Lancer le tirage</Button>
                        <p className="mb-3 text-danger">{error} </p>
                        </>
                    )}
                    </>
                )
                }
                </>
                )}
            </Container>
        </>
    )

}

export default Tirage;