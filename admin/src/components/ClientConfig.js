import { Component, Suspense } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { ClientConfigForm } from "./ClientConfigForm";
import { ClientList } from "./ClientList";

export default class ClientConfig extends Component {
  constructor(props) {
    super(props);
    this.state = { userId: 0 };
  }

  onClientSelect(e) {
    e.preventDefault();
    this.setState({ userId: e.target.dataset.target });
  }

  render() {
    return (
      <div>
        <div className="u-pad--20">Client config manager</div>
        <Container fluid className="u-h--1">
          <Row className="u-h--1">
            <Col xs={1} className="sidebar u-pad--20">
              <Suspense fallback={<div>Loading...</div>}>
                <ClientList
                  onClientSelect={this.onClientSelect.bind(this)}
                ></ClientList>
              </Suspense>
            </Col>
            <Suspense fallback={<div>Loading...</div>}>
              <Col className="u-pad--20">
                <ClientConfigForm clientId={this.state.userId} />
              </Col>
            </Suspense>
          </Row>
        </Container>
      </div>
    );
  }
}
