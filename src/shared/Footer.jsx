import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={6}>
            <h5>TrainMate</h5>
            <p>Your fitness journey, smarter and easier.</p>
          </Col>
          <Col md={3}>
            <h6>Links</h6>
            <ul className="list-unstyled">
              <li><a href="/about" className="text-light">About</a></li>
              <li><a href="/contact" className="text-light">Contact</a></li>
              <li><a href="/privacy" className="text-light">Privacy</a></li>
            </ul>
          </Col>
          <Col md={3}>
            <h6>Follow Us</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light">Instagram</a></li>
              <li><a href="#" className="text-light">Twitter</a></li>
              <li><a href="#" className="text-light">Facebook</a></li>
            </ul>
          </Col>
        </Row>
        <hr className="border-secondary" />
        <p className="text-center mb-0">&copy; {new Date().getFullYear()} TrainMate. All rights reserved.</p>
      </Container>
    </footer>
  );
}

export default Footer; 