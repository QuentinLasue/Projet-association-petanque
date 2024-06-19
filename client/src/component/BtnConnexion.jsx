import { useContext } from "react";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth/AuthContext";

function BtnConnexion(){
    const {logout ,isLogged } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const handleClick = ()=>{
        logout();
        navigate('/');
    }
return (
    <>
    {!isLogged? (
        <Link to ="auth/connexion">
            <Button>Connexion</Button>
        </Link>
    ): (
        <Button onClick={handleClick}>Déconnexion</Button>
    )}
    </>
) 
}
export default BtnConnexion;