import axios from "axios";
import { useContext, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import bcrypt from "bcryptjs-react"
import { AuthContext } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";

function Login(){
    const [error,setError]=useState('');
    const [credentials, setCredentials]= useState({
        userName:'',
        password:'',
    });
    const { login }= useContext(AuthContext);
    const navigate = useNavigate();
    const handleChange=(event)=>{
        // on reprend l'état du state et modifie grace au nom des inputs
        setCredentials({
            ...credentials,
            [event.target.name]:event.target.value
        })
    }

    const handleSubmit = async (event)=>{
        event.preventDefault();
        if(credentials.userName !=='' && credentials.password !==''){
            if(/^[a-zA-Z0-9]*$/.test(credentials.password) && /^[a-zA-Z]*$/.test(credentials.userName) ){
                try {
                    const response = await axios.get(`http://localhost:5000/users/name/${credentials.userName}`);
                    const passwordMatch = await bcrypt.compare(credentials.password, response.data[0].password);
                    if(passwordMatch){
                        // connecté l'utilisateur
                        login();
                        // rediriger 
                        navigate('/admin/nouvelleUtilisateur')
                    }else {
                        setError("Mot de passe incorrect.")
                    }
                } catch (error) {
                    console.log("Erreur recherche utilisateur : ", error);
                    setError('Identifiant inconu.');
                }

            }else{
                setError("Identifiants ou mot de passe incorect. l'identifiants ne doit contenir que des lettres. et le mot de passe que des lettres ou des chiffres")
            }
        }else{
            setError("L'identifiant et le mot de passe sont requis")
        }
    }

return(
    <Container>
        <Row className="justify-content-center">
            <Col md={6} className="m-4 border rounded-5 border-3 border-primary-subtle p-5">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Identifiant</Form.Label>
                        <Form.Control type="text" placeholder="Nom d'utilisateur" name="userName" value={credentials.userName} onChange={handleChange} required/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Mot de passe </Form.Label>
                        <Form.Control type="password" placeholder="Mot de passe" name="password" value={credentials.password} onChange={handleChange} required/>
                    </Form.Group>
                    {error && <p style={{ color: 'red' }} className="mb-3">{error}</p>}
                    <Button variant="primary" type="submit">
                        Se connecter
                    </Button>
                </Form>
            </Col>
        </Row>
    </Container>
)
}

export default Login;