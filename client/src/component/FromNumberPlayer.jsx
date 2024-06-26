import { useEffect, useState } from "react";
import { Button, Form, InputGroup, Row } from "react-bootstrap";

function FormNumberPlayer({setNumberPlayer, erreur, setErreur, success, setSuccess}){
    // variable de l'input pour empécher de rentrer autres chose que des nombres
    const[inputValue, setInputValue] = useState('');
    const [isSticky, setSticky] = useState(false);

    // si on entre autre chose qu'un chiffre on l'efface
    const handleInput = (event)=>{
        const results = event.target.value.replace(/\D/g,'');
        setInputValue(results);
    }
    
    const handleSubmit = (event)=>{
        // empéche le rechargement de la page
        event.preventDefault()
        // vérifie si c'est un nombre et qu'ils n'est pas vide
        if(!isNaN(inputValue) && inputValue!== ''){
            setNumberPlayer(inputValue);
            setInputValue('');
            setErreur('');
        }else {
            setErreur("La valeur rentré n'est pas un numéro.");
            setSuccess('');
        }
    }
    const handleScroll = () => {
        const offset = window.scrollY;
        const formTop = document.getElementById('scroll-form').offsetTop;
        if (offset > formTop) {
            setSticky(true);
        } else {
            setSticky(false);
        }
    };
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
return (
    <Row className={`mb-3 form-container ${isSticky ? 'sticky' : ''}`} id="scroll-form">
            <Form onSubmit={handleSubmit}>
                <InputGroup className="mb-3">
                    <Form.Control
                        placeholder="Numéro du joueur"
                        aria-label="Numéro du joueur"
                        aria-describedby="numberPlayer"
                        pattern="[0-9]*"
                        value={inputValue}
                        onChange={handleInput}
                        onSubmit={handleSubmit}
                        required
                        />
                    <Button variant="outline-primary" id="button-numberPlayer" type="submit">
                            Ajouter
                    </Button>
                </InputGroup>
            </Form>
        <span style={{color:'red'}}>{erreur}</span>
        <span style={{color:'green'}}>{success}</span>
    </Row>
)
}

export default FormNumberPlayer;