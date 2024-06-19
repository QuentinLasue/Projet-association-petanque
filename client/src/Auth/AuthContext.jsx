import { createContext } from "react";

// création d'un context pour gérer l'état de connection
const AuthContext = createContext();

const AuthProvider= ({children})=>{
    
    const isLogged = ()=>{
        let token = localStorage.getItem('accessToken');

        return !!token;
    };

    const logout = ()=>{
        localStorage.removeItem('accessToken');
    }
    return (
        <AuthContext.Provider value ={{isLogged, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
export { AuthContext,AuthProvider };