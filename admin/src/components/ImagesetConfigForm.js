import { atom, useRecoilState } from "recoil";
import {
  formImageSet,
  imagesetObject,
  imagesetsList,
  IMAGESET_API_URL,
} from "../recoil/imagesets";
import _ from "underscore";
import { Button, Col, Form } from "react-bootstrap";
import { ImageSorter } from "./ImageSorter";
import { useState } from "react";

export function ImagesetConfigForm(props) {
  const [imagesetObjectData] = useRecoilState(imagesetObject);
  const [imagesetlistData, imagesetsListSetter] = useRecoilState(imagesetsList);

  const [localState, setLocalState] = useRecoilState(formImageSet);

  setLocalState((oldState) => {
    return imagesetObjectData;
  });

  const inputChanged = function (e) {
    let newValue =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    newValue = e.target.type === "number" ? parseInt(newValue) : newValue;

    setLocalState(_.defaults({ [e.target.name]: newValue }, { ...localState }));
  };

  const handleSubmit = async (e) => {
    // nothing to gather, just send it
    e.preventDefault();

    const allImagesetData = imagesetlistData.slice();
    const oldObject = _.findWhere(allImagesetData, {
      id: localState.id,
    });
    const oldPos = allImagesetData.indexOf(oldObject);
    allImagesetData.splice(oldPos, 1, localState);
    imagesetsListSetter(allImagesetData);

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
  };

  const imageSelectionChanged = (imageIdList) => {
    setLocalState({ ...localState, images: imageIdList });
  };
  console.log({ localState });

  const body = !_.isEmpty(localState) ? (
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
                value={localState.id}
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
                value={localState.name}
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
                value={localState.duration}
              />
              <Form.Text className="text-muted">
                Time long each image displays for.
              </Form.Text>
            </Form.Group>
          </Col>
        </Form.Row>

        <ImageSorter
          images={localState.images}
          changeCallback={imageSelectionChanged}
        />

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
