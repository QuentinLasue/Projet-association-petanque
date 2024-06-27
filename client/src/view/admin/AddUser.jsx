import axios from "axios";
import { useContext, useState } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import { AuthContext } from "../../Auth/AuthContext";

function AddUser(){
    const {getHeaders}= useContext(AuthContext);
    const headers = getHeaders();
    const [error, setError]= useState('');
    const [success, setSuccess]= useState('');
    const [newUser, setNewUser] = useState({
        userName:'',
        password:'',
        confirmPassword:''
    });
   

    const handleChange=(event)=>{
        setNewUser({
            ...newUser,
            [event.target.name]:event.target.value
        })
    }
    const validateInput=()=>{
        // on vérifie les différentes contraintes
        if(newUser.userName ==='' || newUser.password ==='' || newUser.confirmPassword ===''){
            setError("Les 3 champs sont obligatoires.");
            return false;
        }
        if(newUser.password !== newUser.confirmPassword ){
            setError("Erreur lors de la confirmation du mot de passe.");
            return false;
        }
        if (!/^[a-zA-Z]*$/.test(newUser.userName)|| newUser.userName<5) {
            setError("L'identifiant ne doit comporter que des lettres et avoir une taille de 5 caractères minimum.");
            return false;
        }
        if(!/^[a-zA-Z0-9]*$/.test(newUser.password)  || newUser.password.length<5 ){
            setError("Le mot de passe ne doit comporter que des lettres ou des chiffres et avoir une taille de 5 caractères minimum.");
            return false;
        }
        setError('');
        return true;
    }
    const handleSubmit = async (event)=>{
        event.preventDefault();
        setError('');
        setSuccess('');

        if(validateInput()){
            try {
                // on vérifie si le nom utilisateurs existe déja 
                const response = await axios.get(`http://localhost:5000/users/name/${newUser.userName}`)
                if(response.status === 200 && response.data.exists === false){
                    try {
                        const createResponse = await axios.post(`http://localhost:5000/users`,{
                            name: newUser.userName,
                            password: newUser.password,
                        },
                    {headers}); 
                        if(createResponse.status === 201){
                            setSuccess("Utilisateur ajouté.");
                            setError('');
                        }else{
                            setError('Une erreur est survenue lors de la création de l\'utilisateur.')
                        }
                    } catch (e) {
                        console.log('Erreur lors de la création de l\'utilisateur:', e);
                        setError('Une erreur est survenue lors de la création de l\'utilisateur.');
                    }
                }else {
                    //si il n'existe pas on crée un nouvel utilisateurs
                    setError("L'identifiants existe déjà.")
                }
            } catch (error) {
                console.log("Erreur lors de la vérification ou de la création de l'utilisateur:", error);
                setError('Une erreur est survenue. Veuillez réessayer.');
            }
        }

    }
    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={6}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Identifiant</Form.Label>
                        <Form.Control type="text" placeholder="Nom d'utilisateur" name="userName" required value={newUser.userName} onChange={handleChange}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Mot de passe </Form.Label>
                        <Form.Control type="password" placeholder="Mot de passe" name="password" required value={newUser.password} onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                        <Form.Label>Confirmez le mot de passe</Form.Label>
                        <Form.Control type="password" placeholder="Mot de passe" name="confirmPassword"  requiredvalue={newUser.confirmPassword} onChange={handleChange}/>
                    </Form.Group>
                    {error && <p style={{ color: 'red' }} className="mb-3">{error}</p>}
                    {success && <p style={{ color: 'green' }} className="mb-3">{success}</p>}
                    <Button variant="primary" type="submit">
                        Créer
                    </Button>
                </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default AddUser;
