import { Component, Suspense } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { PlaylistConfigForm } from "./PlaylistConfigForm";
import { PlaylistList } from "./PlaylistList";

export default class PlaylistConfig extends Component {
  constructor(props) {
    super(props);
    this.state = { userId: 0 };
  }

  onImagesetSelect(e) {
    e.preventDefault();
    this.setState({ userId: e.target.dataset.target });
  }

  render() {
    return (
      <div>
        <div className="u-pad--20">
          <h4>Playlist manager</h4>
        </div>
        <Container fluid className="u-h--1">
          <Row className="u-h--1">
            <Col xs={12} md={2} lg={2} className="sidebar u-pad--20">
              <Suspense fallback={<div>Loading...</div>}>
                <PlaylistList
                  className="u-h--1"
                  onImagesetSelect={this.onImagesetSelect.bind(this)}
                ></PlaylistList>
              </Suspense>
            </Col>
            <Suspense fallback={<div>Loading...</div>}>
              <Col xs={12} md={10} lg={10} className="u-pad--20">
                <PlaylistConfigForm ImagesetId={this.state.userId} />
              </Col>
            </Suspense>
          </Row>
        </Container>
      </div>
    );
  }
}
