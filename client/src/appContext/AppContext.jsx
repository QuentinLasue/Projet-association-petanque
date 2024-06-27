import { createContext, useEffect, useState } from "react";

const AppContext = createContext();

const AppProvider = ({children}) => {
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
    // mise a jours du localStorage si changement des valeurs
    useEffect(()=>{
        localStorage.setItem('players',JSON.stringify(players));
        localStorage.setItem('teams',JSON.stringify(teamsFinish));
        localStorage.setItem('matchs',JSON.stringify(matchs));
        localStorage.setItem('nbrDraw',JSON.stringify(nbrDraw));
        localStorage.setItem('drawCompetition',JSON.stringify(drawCompetition));
        localStorage.setItem('competition',JSON.stringify(competition));
    },[players, teamsFinish, matchs, nbrDraw, drawCompetition, competition])

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
        setCompetition
    }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export{AppContext, AppProvider};