import axios from "axios";
import { useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";

function UpdateMember() {
    const {numero}=useParams();
    const [member, setMember]=useState([]);
    // requête pour aller cherche toutes les infos du membres et mettre a jour avec setMember

    return(
        <Container>
            <Row>
                <h1>{numero}</h1>
            </Row>
        </Container>
    )
    
}
export default UpdateMember;