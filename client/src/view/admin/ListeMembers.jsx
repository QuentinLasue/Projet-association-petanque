import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import BtnPage from "../../component/BtnPage";
import SearchBarMember from "../../component/SearchBarMember";
import { AuthContext } from "../../Auth/AuthContext";

function ListeMembres(){
    const {getHeaders}=useContext(AuthContext);
    const headers = getHeaders();
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
    // Récupération du token dans le local storage si il existe
    const token = localStorage.getItem('accessToken');

    const handleDelete=async (member)=>{
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce membre ?");

        if(confirmation){
            try {
                const response = await axios.delete("http://localhost:5000/membres/delete",{headers, data: {
                    id_membre: member.id_membre,
                    }
                }
                );
                if(response.status === 201){
                    setErreur('');
                    setSuccess("Membre supprimé avec succès.");
                    setMembers(members.filter(m=>m.numero !== member.numero))
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
            if(error.response && error.response.status === 403){
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
                setErreur('');
                setSuccess('');
                setMembers(response.data);
        } catch (error) {
            if(error.response && error.response.status === 404){
                setErreur('Aucun membre ne correspond à cette recherche.')
                setMembers([]);
            }else{
                console.log('Erreur lors de l\'appel API', error);
                setSuccess("");
                setErreur("Erreur survenue lors de la requête API.");
            }
        }
    }

    useEffect(()=>{
        if(!searchValue){
            setPage(1);
            getMembers();
        }else{
            setPage(1);
            getSearch(searchValue);
        }
    },[searchValue]);

return(
    <Container>
            {token ? (
                <>
                <Row className="mb-3">
                    <h1 className="mb-3">Liste des membres :</h1>
                </Row>
                <Row className="mb-3">
                    <SearchBarMember searchValue={searchValue} setSearchValue={setSearchValue} erreur={erreur} success={success} />
                    <Col>
                    <Link to="/admin/ajoutJoueur">
                        <Button variant="warning">Ajouter un nouveau membre</Button>
                    </Link>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table striped bordered hover responsive size='sm'>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nom</th>
                                    <th>Prénom</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {membersDisplay.length>0 ? (
                                    <>
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
                                    </>
                                ):(
                                    <>
                                    <tr>
                                    <td>#</td>
                                    <td>Aucun</td>
                                    <td>Membre</td>
                                    <td>
                                        <Button variant="outline-secondary" disabled>Supprimer</Button>
                                        <Button variant="outline-secondary" disabled className="ms-2">Modifier</Button>
                                    </td>
                                </tr>
                                    </>
                                )}
                            </tbody>
                        </Table>
                    </Col>
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