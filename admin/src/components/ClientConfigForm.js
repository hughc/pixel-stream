import { useRecoilValue } from "recoil";
import { clientObject } from "../recoil/clients";
import _ from "underscore";
import { Col, Form } from "react-bootstrap";

export function ClientConfigForm(props) {
  const clientGetter = useRecoilValue(clientObject);
  const body = clientGetter ? (
    /* "id": "one",
		"pixelsCount": 1024,
		"width" : 32,
		"height" : 32,
		"direction" : "horizontal",
		"zigzag" : true,
		"start" : "top"  */
    <div>
      <Form>
        <Form.Row>
          <Col>
            <Form.Group className="mb-3" controlId="clientId">
              <Form.Label>Client ID</Form.Label>
              <Form.Control type="text" value={clientGetter.id} disabled />
              <Form.Text className="text-muted">
                Set in client, locked.
              </Form.Text>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="pixelsCount">
              <Form.Label>Pixels count</Form.Label>
              <Form.Control
                type="number"
                value={clientGetter.pixelsCount}
                disabled
              />
              <Form.Text className="text-muted">
                Set in client, locked.
              </Form.Text>
            </Form.Group>
          </Col>
        </Form.Row>
        <Form.Row>
          <Col sm="2">
            <Form.Group className="mb-3" controlId="width">
              <Form.Label>Pixel width</Form.Label>
              <Form.Control type="number" value={clientGetter.width} />
            </Form.Group>
          </Col>
          <Col sm="2">
            <Form.Group className="mb-3" controlId="height">
              <Form.Label>Pixel height</Form.Label>
              <Form.Control type="number" value={clientGetter.height} />
            </Form.Group>
          </Col>
          <Col sm="4">
            <Form.Group className="sm-3" controlId="direction">
              <Form.Label>Row direction</Form.Label>
              <Form.Control as="select">
                <option>Choose the orientation of rows in the matrix</option>
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col sm="4">
            <Form.Group className="sm-3" controlId="start">
              <Form.Label>Starting point</Form.Label>
              <Form.Control as="select">
                <option>location of the first pixel</option>
                <option value="topleft">Top-left</option>
                <option value="topright">Top-right</option>
                <option value="bottomleft">Bottom-left</option>
                <option value="bottomright">Bottom-right</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <Form.Group className="sm-3" controlId="zigzag">
              <Form.Check type="checkbox" label="Zigzag rows" />
              <Form.Text className="text-muted">
                Do the rows zigzag? If false, they are assumed to start at the
                same end.
              </Form.Text>
            </Form.Group>
          </Col>
        </Form.Row>
      </Form>
    </div>
  ) : (
    <div>we do not</div>
  );

  return <div>{body}</div>;
}
