import { createContext, useState } from "react";

// création d'un context pour gérer l'état de connection
const AuthContext = createContext();

const AuthProvider= ({children})=>{
    const [loggedIn, setLoggedIn]= useState(false);

    const isLogged = ()=>{
        let token = localStorage.getItem('accessToken');
        setLoggedIn(!!token);
        return !!token;
    };

    const logout = ()=>{
        localStorage.removeItem('accessToken');
        setLoggedIn(false);
    }
    return (
        <AuthContext.Provider value ={{isLogged, logout, loggedIn}}>
            {children}
        </AuthContext.Provider>
    )
}
export { AuthContext,AuthProvider };