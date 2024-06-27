import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Button, Container, Row, Table, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import FormNumberPlayer from "../component/FromNumberPlayer";
import { AppContext } from "../appContext/AppContext";
function Entrainement(){
    const[numberPlayer, setNumberPlayer] = useState('');
    // variable ou l'on stock les joueurs de la partie
    const{players, setPlayers, setMatchs, setNbrDraw, setTeamsFinish, setDrawCompetition, setNumberCompetition, setCompetition} = useContext(AppContext);
    // variable pour affichage d'un message d'erreur et de succes
    const [success, setSuccess] = useState('');
    const [erreur, setErreur] = useState('');

        const handleDelete = (numero)=>{
            // demande de confirmation de suppression
            const confirmation = window.confirm("Êtes-vous sûr de vouloir retirer ce joueur ?");

            if(confirmation){
                // Créations d'un nouveau tableau en excluant celui qui a le numero reçu
                const updatePlayers = players.filter((player)=> player.numero !== numero);
                setPlayers(updatePlayers);
                setErreur('');
                setSuccess("Le joueur à été retiré.");
            }else{
                setErreur("");
                setSuccess("");
            }
        }
        const handleDeleteAll = ()=>{
            const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer toutes la liste de joueurs ?");
            // on reset tout a leurs valeurs par default
            if(confirmation){
                setPlayers([]);
                setMatchs([]);
                setNbrDraw(0);
                setTeamsFinish([]);
                setDrawCompetition([]);
                setCompetition(false);
                setNumberCompetition(false)
                setErreur("");
                setSuccess("Liste effacée.");
            }else{
                setErreur("");
                setSuccess("");
            }
        }
        useEffect(()=>{
            const getPlayer = async ()=>{
                if(numberPlayer !== ""){
                    try{
                        // Variable pour vérifier que le joueurs n'est pas  déjà dans la liste
                        const playerExist = players.find((player)=>player.numero == numberPlayer);
                        if(!playerExist){
                            // On va cherche le nouveau joueurs 
                            const response = await axios.get(`http://localhost:5000/membres/${numberPlayer}`);
                            // On ajoute un champs  pour contenir les équipiers du jours
                            const newPlayer = {...response.data[0], teammates:[response.data[0].numero]}
                            // On met a jours la variable qui contient tous le groupe + le nouveau joueurs
                            setPlayers([...players, newPlayer]);
                            localStorage.setItem('players', JSON.stringify(players))
                            setNumberPlayer("");
                            setErreur("");
                            setSuccess(` ${response.data[0].numero} ${response.data[0].nom} ${response.data[0].prenom} ajouté.`)
                        }else{
                            setSuccess("");
                            setErreur("Joueurs déjà présent.")
                        }
                    }catch (error){
                        console.log("Erreur recherche joueur: ", error);
                        setErreur("Numéro de joueur inconue.");
                        setSuccess('');
                    }
                }                
            }
            getPlayer();
        },[numberPlayer])

    return (
        <Container>
            <FormNumberPlayer setNumberPlayer={setNumberPlayer} erreur={erreur} setErreur={setErreur} success={success}  setSuccess={setSuccess}  />
            <Row className="mb-5">
                <Col>
                    <h3>Nombre(s) de joueur(s) : {players.length}</h3>
                </Col>
                <Col>
                    <Button variant="danger" onClick={handleDeleteAll}>Supprimer tous les joueurs</Button>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Link to={`/tirage`}>
                        <Button variant="warning">Aller au tirage des équipes</Button>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h2>Liste des joueurs inscrits :</h2>
                    <Table striped bordered hover size='sm' responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nom</th>
                                <th>Prénom</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (players.length >=1)?(
                                    players.map((player,index)=>(
                                        <tr key={index}>
                                        <td>{player.numero}</td>
                                        <td>{player.nom}</td>
                                        <td>{player.prenom}</td>
                                        <td><Button variant="outline-danger" onClick={()=>handleDelete(player.numero)}>Supprimer</Button></td>
                                    </tr>
                            ))
                        ):(
                            <tr>
                                    <td>#</td>
                                    <td>Aucun</td>
                                    <td>joueur</td>
                                    <td><Button variant ="outline-secondary" disabled>Supprimer</Button></td>
                                </tr>
                            )
                        }
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    )
}

export default Entrainement;