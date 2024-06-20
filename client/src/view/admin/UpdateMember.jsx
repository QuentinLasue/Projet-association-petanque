import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

function UpdateMember() {
    const {numero}=useParams();
    const [member, setMember]=useState([]);
    const[error, setError]= useState('');
    const[success, setSuccess]= useState('');
    const [errorFetch,setErrorFetch]=useState(true);
    // Récupération du token dans le local storage sui il existe
    const token = localStorage.getItem('accessToken');
    // Configuration du headers pour inclure le token JWT
    const headers = {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
    const validateInput = ()=>{
        setError('')
        if(member.nom ==='' || member.prenom === ''|| member.numero===''){
            setError('Les trois champs sont ogligatoires.');
            return false;
        }
        if(!/^[0-9]*$/.test(member.numero)){
            setError("Le numéro ne peut comporter que des chiffres");
            return false;
        }
        if(!/^(?=.*[a-zA-ZÀ-ÖØ-öø-ÿ])[a-zA-ZÀ-ÖØ-öø-ÿ'-]*$/.test(member.nom)){
            setError("Le nom ne doit contenir que des lettres avec un apostrophe ou un tiret.");
            return false;
        }
        if(!/^(?=.*[a-zA-ZÀ-ÖØ-öø-ÿ])[a-zA-ZÀ-ÖØ-öø-ÿ'-]*$/.test(member.prenom)){
            setError("Le prénom ne doit contenir que des lettres avec un apostrophe ou un tiret.");
            return false;
        }
        return true;
    }
    const updateMember = async (member)=>{
        try {
            const response = await axios.post('http://localhost:5000/membres/updateMember',{
                nom: member.nom,
                prenom: member.prenom,
                numero: member.numero,
                oldNumero : numero,
                },
                {headers}
            );
            if(response.status === 201){
                setError("");
                setSuccess("Membre modifié avec succès.");
            }else{
                setError("Une erreur est survenue lors de la modification du membre.")
            }

        } catch (error) {
            console.log('Erreur lors de la modification du membre:', error);
            setError('Une erreur est survenue. Veuillez réessayer.');
        }        
    }
    const handleSubmit=(event)=>{
        event.preventDefault();
        setError('');
        setSuccess('');
        if(validateInput()){
            updateMember(member);
        }
    }
    const handleChange=(event)=>{
        setMember({...member,
            [event.target.name]:event.target.value
        })
    }
    // requête pour aller cherche toutes les infos du membres et mettre a jour avec setMember
    useEffect(()=>{
        const getMember = async()=>{
            try {
                const response = await axios.get(`http://localhost:5000/membres/${numero}`);
                setMember(response.data[0]);
                setErrorFetch(false);
            } catch (error) {
                setErrorFetch(true);
                console.log("Erreur lors de la récupération du membre:",error);
            }
        }
        getMember();
    },[])

    return(
        <Container>
            {!errorFetch? (
        <>
                <Link to={`/admin`}>
                    <Button variant="primary" className="mb-3">Retour à la liste des membres</Button>
                </Link>
            <Row className="justify-content-center">
                <Col md={10} className="m-4 border rounded-5 border-3 border-primary-subtle p-5">
                    <h3 className="mb-3">Modification de {member.nom} {member.prenom}</h3>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control type="text" placeholder="Nom" name="nom"  required onChange={handleChange} value={member.nom}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicFirstName">
                            <Form.Label>Prénom</Form.Label>
                            <Form.Control type="text" placeholder="Prénom" name="prenom"  required onChange={handleChange} value={member.prenom}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicFirstName">
                            <Form.Label>Numéro</Form.Label>
                            <Form.Control 
                            type="number" 
                            placeholder="Numéro"
                            name="numero"
                            required
                            pattern="[0-9]*"
                            onChange={handleChange}
                            value={member.numero}
                            />
                        </Form.Group>

                        {error && <p style={{ color: 'red' }} className="mb-3">{error}</p>}
                        {success && <p style={{ color: 'green' }} className="mb-3">{success}</p>}
                        <Button variant="primary" type="submit">
                            Modifier
                        </Button>
                    </Form>
                </Col>
            </Row>
        </>
            ):(
                <Row>
                    <h1 className="mb-3 text-danger">Le membre n°{numero} n'a pas été trouvé.</h1>
                    <Link to={`/admin`}>
                        <Button variant="primary" className="mb-3">Retour à la liste des membres</Button>
                    </Link>
                </Row>
            )}
        </Container>
    )
    
}
export default UpdateMember;