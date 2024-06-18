import { Route, Routes } from "react-router-dom";
import Login from "../view/login";
import Error from "../view/Error";

function AuthRouter (){
    return (
        <Routes>
            <Route index path="/connexion" element={<Login/>}/>
            <Route path="*" element={<Error/>}></Route> 
        </Routes>
    );
};

export default AuthRouter;