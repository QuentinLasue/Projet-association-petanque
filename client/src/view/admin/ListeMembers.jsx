import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

function ListeMembres(){
    const [members, setMembers]= useState([]);
    const [success, setSuccess] = useState('');
    const [erreur, setErreur] = useState('');
    const[searchValue, setSearchValue]= useState('');
    // Récupération du token dans le local storage sui il existe
    const token = localStorage.getItem('accessToken');
    // Configuration du headers pour inclure le token JWT
    const headers = {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
    };

    const handleSubmit=()=>{

    }
    const handleChange=()=>{

    }

    const handleDelete=(number)=>{

    }


    useEffect(()=>{
        const getMembers= async()=>{
            try {
                const response = await axios.get("http://localhost:5000/membres",{headers});
                setMembers(response.data);
                setErreur('');
            } catch (error) {
                console.log('Erreur lors de l\'appel API', error);
                if(error.response && error.response === 403){
                    setErreur("Vous n'êtes pas connecté.");
                } else {
                    setErreur("Erreur lors de la requête API.");
                }
            }
        }
        getMembers();
    },[members]);

return(
    <Container>
        
            <span style={{color:'red'}}>{erreur}</span>
            {members.length >0 ? (
                <>
                <Row className="mb-3">
                    <h1 className="mb-3">Liste des membres :</h1>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <Form onSubmit={handleSubmit}>
                            <InputGroup className="mb-3">
                                <Form.Control
                                placeholder="Recherche par nom ou numéro ..."
                                aria-label="recherche joueur"
                                aria-describedby="namePlayer"
                                required
                                onChange={handleChange}
                                />
                                <Button variant="outline-primary" id="button-namePlayer" type="submit">
                                    Rechercher
                                </Button>
                            </InputGroup>
                        </Form>
                    </Col>
                    <Col>
                    <Link to="/admin/ajoutJoueur">
                        <Button variant="warning">Ajouter un nouveau membre</Button>
                    </Link>
                    </Col>
                </Row>
                <Row>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Numéro</th>
                                <th>Nom</th>
                                <th>Prénom</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                members.map((member,index)=>(
                                    <tr key={index}>
                                    <td>{member.numero}</td>
                                    <td>{member.nom}</td>
                                    <td>{member.prenom}</td>
                                    <td>
                                        <Button variant="outline-danger" onClick={()=> handleDelete(member.numero)}>Supprimer</Button>
                                        <Link to={`/admin/modifier/${member.numero}`}>
                                            <Button variant="outline-primary" className="ms-2">Modifier</Button>
                                        </Link>
                                    </td>
                                </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Row>
            </>
            )
            :
            (
                <Row className="m-3 justify-content-center">
                    <h1 className="mb-3">Vous n'avez pas pu récupérer les membres.</h1>
                    <Link to={`/`}>
                        <Button variant="primary" className="mb-3">Retour à la liste des joueurs</Button>
                    </Link>
                </Row>
            )}
    </Container>
)
}
export default ListeMembres;