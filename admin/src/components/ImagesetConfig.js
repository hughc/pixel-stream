import { Component, Suspense } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { DragDropTest } from "./DragDropTest";
import { ImagesetConfigForm } from "./ImagesetConfigForm";
import { ImagesetList } from "./ImagesetList";

export default class ImagesetConfig extends Component {
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
          <h4>Imageset config manager</h4>
        </div>
        <Container fluid className="u-h--1">
          <Row className="u-h--1">
            <Col xs={2} className="sidebar u-pad--20">
              <Suspense fallback={<div>Loading...</div>}>
                <ImagesetList
                  className="u-h--1"
                  onImagesetSelect={this.onImagesetSelect.bind(this)}
                ></ImagesetList>
              </Suspense>
            </Col>
            <Suspense fallback={<div>Loading...</div>}>
              <Col className="u-pad--20">
                <ImagesetConfigForm ImagesetId={this.state.userId} />
              </Col>
            </Suspense>
          </Row>
        </Container>
      </div>
    );
  }
}
