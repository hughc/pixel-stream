import { Component } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { ClientList } from "./ClientList";

export default class ClientConfig extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="u-pad--20">Client config manager</div>
        <Container fluid className="u-h--1">
          <Row className="u-h--1">
            <Col xs={1} className="sidebar u-pad--20">
              <ClientList
                api={this.props.api}
                status={this.props.api.isFetching ? "fetching" : "idle"}
                items={this.props.api.ClientList}
              ></ClientList>
            </Col>
            <Col className="u-pad--20">CLient Config Form here</Col>
          </Row>
        </Container>
      </div>
    );
  }
}
