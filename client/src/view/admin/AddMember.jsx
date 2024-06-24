import axios from "axios";
import { useState } from "react";
import { Container, Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function AddMember(){
    const [error, setError]=useState('');
    const [success, setSuccess]=useState('');
    const[newMember, setNewMember]=(useState({
        name:'',
        firstName:'',
        number:''
    }));
    // Récupération du token dans le local storage sui il existe
    const token = localStorage.getItem('accessToken');
    // Configuration du headers pour inclure le token JWT
    const headers = {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
    };

    const handleChange=(event)=>{
        setNewMember({
            ...newMember,
            [event.target.name]:event.target.value
        })
    }
    const validateInput=()=>{
        setError('')
        if(newMember.name ==='' || newMember.firstName === ''|| newMember.number===''){
            setError('Les trois champs sont ogligatoires.');
            return false;
        }
        if(!/^[0-9]*$/.test(newMember.number)){
            setError("Le numéro ne peut comporter que des chiffres");
            return false;
        }
        if(!/^(?=.*[a-zA-ZÀ-ÖØ-öø-ÿ])[a-zA-ZÀ-ÖØ-öø-ÿ'-]*$/.test(newMember.name)){
            setError("Le nom ne doit contenir que des lettres avec un apostrophe ou un tiret.");
            return false;
        }
        if(!/^(?=.*[a-zA-ZÀ-ÖØ-öø-ÿ])[a-zA-ZÀ-ÖØ-öø-ÿ'-]*$/.test(newMember.firstName)){
            setError("Le prénom ne doit contenir que des lettres avec un apostrophe ou un tiret.");
            return false;
        }
        return true;
    }
    const handleSubmit=(event)=>{
        event.preventDefault();
        setError('');
        setSuccess('');
        if(validateInput()){
                addMember(newMember);            
        }
    }

    const addMember = async (newMember)=>{
        try {
            const response = await axios.post(`http://localhost:5000/membres/addMember`,{
                name: newMember.name,
                firstName: newMember.firstName,
                number: newMember.number,
            },
            { headers }
            );
            if(response.status===201){
                setSuccess("Membre ajouté avec succès.");
                setError("");
            }else{
                setError("Une erreur est survenue lors de la création du nouveau membres.");
            }
        } catch (error) {
            console.log('Erreur lors de la création du membre:', error);
            if(error.response && error.response.data.error){
                setError(error.response.data.error);
            }else{
                setError('Une erreur est survenue. Veuillez réessayer.');
            }
        }
    }

    return (
        <Container>
            <Link to={`/admin`}>
                <Button variant="primary" className="mb-3">Retour à la liste des membres</Button>
            </Link>
            <Row className="justify-content-center">
                <Col md={10} className="m-4 border rounded-5 border-3 border-primary-subtle p-5">
                    <h3 className="mb-3">Ajout d'un nouveau membre</h3>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control type="text" placeholder="Nom" name="name"  required onChange={handleChange}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicFirstName">
                            <Form.Label>Prénom</Form.Label>
                            <Form.Control type="text" placeholder="Prénom" name="firstName"  required onChange={handleChange}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicFirstName">
                            <Form.Label>Numéro</Form.Label>
                            <Form.Control 
                            type="number" 
                            placeholder="Numéro"
                            name="number"
                            required
                            pattern="[0-9]*"
                            onChange={handleChange}
                            />
                        </Form.Group>

                        {error && <p style={{ color: 'red' }} className="mb-3">{error}</p>}
                        {success && <p style={{ color: 'green' }} className="mb-3">{success}</p>}
                        <Button variant="primary" type="submit">
                            Ajouter
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default AddMember;