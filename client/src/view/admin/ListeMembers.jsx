import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import BtnPage from "../../component/BtnPage";

function ListeMembres(){
    const [members, setMembers]= useState([]);
    const [success, setSuccess] = useState('');
    const [erreur, setErreur] = useState('');
    // gestion de la recherche
    const [searchValue, setSearchValue]= useState('');
    // gestion de la pagination
    const [page, setPage]= useState(1);
    const memberPerPage=20;
    const indexLastMember = page * memberPerPage;
    const indexFirstMember = indexLastMember - memberPerPage;
    const membersDisplay = Array.isArray(members) ? members.slice(indexFirstMember, indexLastMember) : members;
    const nbrPage = members.length / memberPerPage;
    // Récupération du token dans le local storage sui il existe
    const token = localStorage.getItem('accessToken');
    // Configuration du headers pour inclure le token JWT
    const headers = {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
    };

    const handleSubmit=(event)=>{
        event.preventDefault();
        // pas necessaire si la recherche se fais dans le useffect 
    }
    const handleChange=(event)=>{
        const results = event.target.value.replace( /[^a-zA-ZÀ-ÖØ-öø-ÿ0-9'-]/g, '');
        setSearchValue(results);
    }

    const handleDelete=async (member)=>{
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce membre ?");

        if(confirmation){
            try {
                const response = await axios.delete("http://localhost:5000/membres/delete",{headers, data: {
                    number:member.numero,
                    name: member.nom,
                    firstName: member.prenom,
                    }
                }
                );
                if(response.status === 201){
                    setErreur('');
                    setSuccess("Membre supprimé avec succès.");
                }else{
                    setErreur("Une erreur est survenue lors de la suppression.")
                }
            } catch (error) {
                console.log('Erreur lors de la suppression du membre:', error);
                setErreur('Une erreur est survenue. Veuillez réessayer.');
            }
        }else{
            setErreur('');
            setSuccess('')
        }
    }
    const getMembers= async()=>{
        try {
            const response = await axios.get("http://localhost:5000/membres",{headers});
            setMembers(response.data);
            setErreur('');
            setSuccess('');
        } catch (error) {
            console.log('Erreur lors de l\'appel API', error);
            if(error.response && error.response === 403){
                setErreur("Vous n'êtes pas connecté.");
            } else {
                setErreur("Erreur lors de la requête API.");
            }
        }
    }

    const getSearch = async (value)=>{
        try {
            const response = await axios.get("http://localhost:5000/membres/search/liste", {
                params: {searchValue : value},
                headers
            });
            console.log(response.data);
            if(response.status === 404){
                setErreur('Aucun membre ne correspond à cette recherche.')
                setMembers([]);
            } else {
                setErreur('');
                setSuccess('');
                setMembers(response.data);
            }
        } catch (error) {
            console.log('Erreur lors de l\'appel API', error);
            setSuccess("");
            setErreur("Erreur survenue lors de la requête API.")
        }
    }

    useEffect(()=>{
        if(!searchValue){
            getMembers();
        }else{
            getSearch(searchValue);
        }
    },[searchValue]);

return(
    <Container>
            <span style={{color:'green'}}>{success}</span>
            <span style={{color:'red'}}>{erreur}</span>
            {membersDisplay.length >0 ? (
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
                                value={searchValue}
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
                                membersDisplay.map((member,index)=>(
                                    <tr key={index}>
                                    <td>{member.numero}</td>
                                    <td>{member.nom}</td>
                                    <td>{member.prenom}</td>
                                    <td>
                                        <Button variant="outline-danger" onClick={()=> handleDelete(member)}>Supprimer</Button>
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
                <BtnPage page={page} setPage={setPage} nbrPage={nbrPage} />
            </>
            )
            :
            (
                <Row className="m-3 justify-content-center">
                    <h1 className="mb-3">Vous n'avez pas pu récupérer les membres. Reconnectez-vous.</h1>
                    <Link to={`/`}>
                        <Button variant="primary" className="mb-3">Retour à la liste des joueurs</Button>
                    </Link>
                </Row>
            )}
    </Container>
)
}
export default ListeMembres;