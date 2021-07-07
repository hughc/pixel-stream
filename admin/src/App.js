import './css/App.scss';
import { Container, Row, Col } from 'react-bootstrap';

import ImageTable from './components/ImageTable';

function App() {
  return (
    <div className="App full-height">
      <Container fluid className='full-height'>
        <Row className='full-height'>
          <Col xs={1} className='sidebar u-pad--20'>Links</Col>
          <Col className='u-pad--20'><ImageTable /></Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
