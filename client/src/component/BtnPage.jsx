import { Button, Col, Row } from "react-bootstrap";

function BtnPage({ page, setPage, nbrPage }) {
  const nextPage = () => {
    if (page < nbrPage) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behaviour: "smooth" });
    }
  };

  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <Row>
      <Col className="text-center">
        <Button variant="primary" onClick={previousPage} id="btnPrevious">
          Page Précédente
        </Button>
      </Col>
      <Col className="text-center">
        <Button variant="primary" onClick={nextPage} id="btnNext">
          Page suivante
        </Button>
      </Col>
    </Row>
  );
}
export default BtnPage;
