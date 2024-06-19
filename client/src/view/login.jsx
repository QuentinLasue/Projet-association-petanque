import axios from "axios";
import { useContext, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { AuthContext } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";

function Login(){
    const [error,setError]=useState('');
    const [credentials, setCredentials]= useState({
        userName:'',
        password:'',
    });
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
        setError('');
        if(credentials.userName !=='' && credentials.password !==''){
            if(/^[a-zA-Z0-9]*$/.test(credentials.password) && /^[a-zA-Z]*$/.test(credentials.userName) ){
                try {
                    const response = await axios.post(`http://localhost:5000/login`, {
                        name : credentials.userName,
                        password : credentials.password,
                    });
                    const { accessToken }= response.data
                    localStorage.setItem('accessToken', accessToken);
                    navigate('/admin')
                } catch (error) {
                    // Gérer les erreurs
                    if (error.response) {
                        // Réponse du serveur avec un code d'état non 2xx
                        setError(error.response.data.error);
                    } else if (error.request) {
                        // La requête a été faite mais aucune réponse n'a été reçue
                        setError('Erreur de connexion au serveur');
                    } else {
                        // Quelque chose s'est passé en configurant la requête qui a déclenché une erreur
                        setError('Erreur inconnue');
                    }
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