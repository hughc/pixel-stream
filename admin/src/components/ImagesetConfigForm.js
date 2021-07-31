import { useRecoilState } from "recoil";
import {
  imagesetObject,
  imagesetsList,
  IMAGESET_API_URL,
} from "../recoil/imagesets";
import _ from "underscore";
import { Button, Col, Form } from "react-bootstrap";
import { ImageSorter } from "./ImageSorter";

export function ImagesetConfigForm(props) {
  const [imagesetObjectData] = useRecoilState(imagesetObject);
  const [imagesetlistData, imagesetsListSetter] = useRecoilState(imagesetsList);

  const inputChanged = function (e) {
    const allImagesetData = imagesetlistData.slice();
    let newValue =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    newValue = e.target.type === "number" ? parseInt(newValue) : newValue;

    const newImagesetObject = _.defaults(
      { [e.target.name]: newValue },
      { ...imagesetObjectData }
    );
    const oldObject = _.findWhere(allImagesetData, {
      id: newImagesetObject.id,
    });
    const oldPos = allImagesetData.indexOf(oldObject);
    allImagesetData.splice(oldPos, 1, newImagesetObject);
    imagesetsListSetter(allImagesetData);
  };

  const handleSubmit = async (e) => {
    // nothing to gather, just send it
    e.preventDefault();

    const request = new Request(IMAGESET_API_URL, {
      method: "POST",
      body: JSON.stringify(imagesetObjectData),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const returnedData = await fetch(request).then((res) => res.json());
    console.log(returnedData);
    if (returnedData.success) {
    }
    console.log({ imagesetlistData });
  };
  const body = imagesetObjectData ? (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Row>
          <Col sm="2">
            <Form.Group controlId="imagesetId">
              <Form.Label>Imageset ID</Form.Label>
              <Form.Control
                name="id"
                onChange={inputChanged}
                type="text"
                value={imagesetObjectData.id}
                disabled
              />
              <Form.Text className="text-muted">
                squential counter, locked.
              </Form.Text>
            </Form.Group>
          </Col>
          <Col sm="8">
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                onChange={inputChanged}
                value={imagesetObjectData.name}
              />
            </Form.Group>
          </Col>
          <Col sm="2">
            <Form.Group controlId="duration">
              <Form.Label>Pixel duration</Form.Label>
              <Form.Control
                name="duration"
                onChange={inputChanged}
                type="number"
                value={imagesetObjectData.duration}
              />
              <Form.Text className="text-muted">
                Time long each image displays for.
              </Form.Text>
            </Form.Group>
          </Col>
        </Form.Row>

        <ImageSorter />

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
    <div>Choose a imageset from the list to configure it.</div>
  );

  return <div>{body}</div>;
}
