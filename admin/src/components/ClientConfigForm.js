import { useRecoilState } from "recoil";
import { clientObject, clientsList, CLIENT_API_URL } from "../recoil/clients";
import _ from "underscore";
import { Button, Col, Form } from "react-bootstrap";
import { imagesetsList } from "../recoil/imagesets";

export function ClientConfigForm(props) {
  const [clientObjectData] = useRecoilState(clientObject);
  const [clientlistData, clientsListSetter] = useRecoilState(clientsList);
  const [imagesets] = useRecoilState(imagesetsList);

  const inputChanged = function (e) {
    const allClientData = clientlistData.slice();

    let newValue =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    newValue = e.target.type === "number" ? parseInt(newValue) : newValue;

    const newClientObject = _.defaults(
      { [e.target.name]: newValue },
      { ...clientObjectData }
    );
    const oldObject = _.findWhere(allClientData, { id: newClientObject.id });
    const oldPos = allClientData.indexOf(oldObject);
    allClientData.splice(oldPos, 1, newClientObject);
    clientsListSetter(allClientData);
  };

  const handleSubmit = async (e) => {
    // nothing to gather, just send it
    e.preventDefault();

    const request = new Request(CLIENT_API_URL, {
      method: "POST",
      body: JSON.stringify(clientObjectData),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const returnedData = await fetch(request).then((res) => res.json());
    console.log(returnedData);
    //setClientSelector(returnedData);
  };

  const body = clientObjectData ? (
    /* "id": "one", 
		"pixelsCount": 1024,
		"width" : 32,
		"height" : 32,
		"direction" : "horizontal",
		"zigzag" : true,
		"start" : "top"  */
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Row>
          <Col sm="6">
            <Form.Group controlId="clientId">
              <Form.Label>Client Name</Form.Label>
              <Form.Control
                name="name"
                onChange={inputChanged}
                type="text"
                value={clientObjectData.name}
              />
            </Form.Group>
          </Col>

          <Col sm="3">
            <Form.Group controlId="clientId">
              <Form.Label>Client ID</Form.Label>
              <Form.Control
                name="id"
                onChange={inputChanged}
                type="text"
                value={clientObjectData.id}
                disabled
              />
              <Form.Text className="text-muted">
                Set in client, locked.
              </Form.Text>
            </Form.Group>
          </Col>
          <Col sm="3">
            <Form.Group controlId="pixelsCount">
              <Form.Label>Pixels count</Form.Label>
              <Form.Control
                name="pixelsCount"
                onChange={inputChanged}
                type="number"
                value={clientObjectData.pixelsCount}
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
            <Form.Group controlId="width">
              <Form.Label>Pixel width</Form.Label>
              <Form.Control
                name="width"
                onChange={inputChanged}
                type="number"
                value={clientObjectData.width}
              />
            </Form.Group>
          </Col>
          <Col sm="2">
            <Form.Group controlId="height">
              <Form.Label>Pixel height</Form.Label>
              <Form.Control
                name="height"
                onChange={inputChanged}
                type="number"
                value={clientObjectData.height}
              />
            </Form.Group>
          </Col>
          <Col sm="4">
            <Form.Group className="sm-3" controlId="direction">
              <Form.Label>Row direction</Form.Label>
              <Form.Control
                as="select"
                name="direction"
                onChange={inputChanged}
              >
                <option>Choose the orientation of rows in the matrix</option>
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col sm="4">
            <Form.Group className="sm-3" controlId="start">
              <Form.Label>Starting point</Form.Label>
              <Form.Control
                as="select"
                name="start"
                value={clientObjectData.start}
                onChange={inputChanged}
              >
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
              <Form.Check
                type="checkbox"
                label="Zigzag rows"
                name="zigzag"
                onChange={inputChanged}
                value={clientObjectData.zigzag}
              />
              <Form.Text className="text-muted">
                Do the rows zigzag? If false, they are assumed to start at the
                same end.
              </Form.Text>
            </Form.Group>
          </Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <Form.Group className="sm-3" controlId="imagesetId">
              <Form.Control
                as="select"
                label="Zigzag rows"
                name="imagesetId"
                onChange={inputChanged}
                value={clientObjectData.imagesetId}
              >
                {imagesets.map((imageset, index) => (
                  <option key={index} value={imageset.id}>
                    {imageset.name}
                  </option>
                ))}
              </Form.Control>
              <Form.Text className="text-muted">
                Do the rows imagesetId? If false, they are assumed to start at
                the same end.
              </Form.Text>
            </Form.Group>
          </Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <Form.Group className="sm-3" controlId="save">
              <Button variant="primary" type="submit">
                Save Config
              </Button>
            </Form.Group>
          </Col>
        </Form.Row>
      </Form>
    </div>
  ) : (
    <div>Choose a client from the list to configure it.</div>
  );

  return <div>{body}</div>;
}
