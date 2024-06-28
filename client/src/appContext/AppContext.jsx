import { createContext, useEffect, useState,useContext } from "react";
import { AuthContext } from "../Auth/AuthContext";
import axios from "axios";

const AppContext = createContext();

const AppProvider = ({children}) => {
    const {getHeaders} = useContext(AuthContext);
    const headers =  getHeaders();
    // Liste des joueurs partcipant aux tirage
    const [players, setPlayers]= useState(()=>{
        const savedPlayers = localStorage.getItem('players');
        return savedPlayers ? JSON.parse(savedPlayers) : [];
    });
    // liste des équipes du tirage
    const [teamsFinish, setTeamsFinish]= useState(()=>{
        const savedTeams = localStorage.getItem('teams');
        return savedTeams ? JSON.parse(savedTeams) : [];
    });
    // liste des oppositions du tirage
    const [matchs, setMatchs]= useState(()=>{
        const savedMatchs = localStorage.getItem('matchs');
        return savedMatchs ? JSON.parse(savedMatchs) : [];
    });
    // numéro du tirage
    const [nbrDraw, setNbrDraw]= useState(()=>{
        const savedNbrDraw = localStorage.getItem('nbrDraw');
        return savedNbrDraw ? JSON.parse(savedNbrDraw) : 0;
    });
    // Pour définir si c'est un tirage concours ou non 
    const [competition, setCompetition]= useState(()=>{
        const savedCompetition = localStorage.getItem('competition');
        return savedCompetition ? JSON.parse(savedCompetition) : false;
    }); 
    // Pour enregistrer les tirage si c'est en compétition
    const [drawCompetition, setDrawCompetition]= useState(()=>{
        const savedDrawCompetition = localStorage.getItem('drawCompetition');
        return savedDrawCompetition ? JSON.parse(savedDrawCompetition) : [];
    });
    // Pour enregistrer le numéro de la compétition en cours
    const [numberCompetition, setNumberCompetition] = useState(()=>{
        const savedNumberCompetition = localStorage.getItem('competitionNumber');
        return savedNumberCompetition ? JSON.parse(savedNumberCompetition): 0;
    });
    // mise a jours du localStorage si changement des valeurs
    useEffect(()=>{
        localStorage.setItem('players',JSON.stringify(players));
        localStorage.setItem('teams',JSON.stringify(teamsFinish));
        localStorage.setItem('matchs',JSON.stringify(matchs));
        localStorage.setItem('nbrDraw',JSON.stringify(nbrDraw));
        localStorage.setItem('drawCompetition',JSON.stringify(drawCompetition));
        localStorage.setItem('competition',JSON.stringify(competition));
        localStorage.setItem('competitionNumber',JSON.stringify(numberCompetition));
    },[players, teamsFinish, matchs, nbrDraw, drawCompetition, competition, numberCompetition])

    const deleteCompetition = (id)=>{
        try {
            // rajouter suppression dans la table participe de toutes les occurences quand id_concours = id avant de supprimer le concours
            const response = axios.delete("http://localhost:5000/competition/delete",{headers,data : {
                id: id,
            }})
        } catch (error) {
            console.log('Erreur lors de la suppression du concours:', error);
        }
    };

    const addAllParticipations = async ()=>{
        for (let player of players){
             addParticipation(player.id_membre, numberCompetition);
        }
    }
    useEffect(()=>{
        if(numberCompetition !== 0){
            addAllParticipations();
        }
    },[numberCompetition]) // Quand un numéro de competition apparait on créer les participations

    const addParticipation= async(id_membre, id_concours)=>{
        try {
            const response = await axios.post("http://localhost:5000/participe/addParticipation",{
                id_membre: id_membre,
                id_concours: id_concours
            },
        {headers})
        } catch (error) {
            console.log('Erreur lors de la création de la participation du membre', error);
            throw error;
        }
    }


    const value = {
        teamsFinish,
        setTeamsFinish,
        nbrDraw, 
        setNbrDraw, 
        players, 
        setPlayers, 
        matchs, 
        setMatchs, 
        drawCompetition, 
        setDrawCompetition, 
        competition, 
        setCompetition,
        numberCompetition,
        setNumberCompetition,
        deleteCompetition,
        addAllParticipations,
    }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export{AppContext, AppProvider};