import { createContext, useEffect, useState } from "react";

const AppContext = createContext();

const AppProvider = ({children}) => {
    const [players, setPlayers]= useState(()=>{
        const savedPlayers = localStorage.getItem('players');
        return savedPlayers ? JSON.parse(savedPlayers) : [];
    });
    const [teamsFinish, setTeamsFinish]= useState(()=>{
        const savedTeams = localStorage.getItem('teams');
        return savedTeams ? JSON.parse(savedTeams) : [];
    });
    const [matchs, setMatchs]= useState(()=>{
        const savedMatchs = localStorage.getItem('matchs');
        return savedMatchs ? JSON.parse(savedMatchs) : [];
    });
    const [nbrDraw, setNbrDraw]= useState(()=>{
        const savedNbrDraw = localStorage.getItem('nbrDraw');
        return savedNbrDraw ? JSON.parse(savedNbrDraw) : 0;
    });
    const [drawCompetition, setDrawCompetition]= useState(()=>{
        const savedDrawCompetition = localStorage.getItem('drawCompetition');
        return savedDrawCompetition ? JSON.parse(savedDrawCompetition) : [];
    });

    useEffect(()=>{
        localStorage.setItem('players',JSON.stringify(players));
        localStorage.setItem('teams',JSON.stringify(teamsFinish));
        localStorage.setItem('matchs',JSON.stringify(matchs));
        localStorage.setItem('nbrDraw',JSON.stringify(nbrDraw));
        localStorage.setItem('drawCompetition',JSON.stringify(drawCompetition));
    },[players, teamsFinish, matchs, nbrDraw, drawCompetition])

    

    return (
        <AppContext.Provider value={{teamsFinish, setTeamsFinish, nbrDraw, setNbrDraw, players, setPlayers, matchs, setMatchs, drawCompetition, setDrawCompetition}}>
            {children}
        </AppContext.Provider>
    )
}

export{AppContext, AppProvider};