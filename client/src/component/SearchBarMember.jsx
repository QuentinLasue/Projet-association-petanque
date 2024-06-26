import { Button, Col, Form, InputGroup, } from "react-bootstrap";

function SearchBarMember({searchValue, setSearchValue, erreur, success }){

    const handleSubmit=(event)=>{
        event.preventDefault();
        // pas necessaire comme la recherche se fais dans le useffect a la présence et modif de searchValue
    }
    const handleChange=(event)=>{
        const results = event.target.value.replace( /[^a-zA-ZÀ-ÖØ-öø-ÿ0-9'-]/g, '');
        setSearchValue(results);
    }
return (
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
    <span style={{color:'green'}}>{success}</span>
    <span style={{color:'red'}}>{erreur}</span>
</Col>
)
}
export default SearchBarMember;