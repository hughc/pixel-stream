import { useRecoilState } from "recoil";
import {
  editorImageset,
  imagesetsList,
  IMAGESET_API_URL,
} from "../recoil/imagesets";
import _ from "underscore";
import { Button, Col, Form } from "react-bootstrap";
import { ImageSorter } from "./ImageSorter";
import { ConfirmationModal } from "./ConfirmationModal";
import { useState } from "react";
import { saveClientList } from "../utils/Actions";

export function ImagesetConfigForm(props) {
  const [localState, setLocalState] = useRecoilState(editorImageset);
  const [imagesetlistData, imagesetsListSetter] = useRecoilState(imagesetsList);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const inputChanged = function (e) {
    let newValue =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    newValue = e.target.type === "number" ? parseInt(newValue) : newValue;
    const newLocalState = _.defaults(
      { [e.target.name]: newValue },
      { ...localState }
    );
    setLocalState(newLocalState);
  };

  const handleSubmit = (e) => async () => {
    // nothing to gather, just send it
    e.preventDefault();
    const allImagesetData = imagesetlistData.slice();
    const oldObject = _.findWhere(allImagesetData, {
      id: localState.id,
    });
    if (oldObject) {
      const oldPos = allImagesetData.indexOf(oldObject);
      allImagesetData.splice(oldPos, 1, localState);
    } else {
      // add to the end
      allImagesetData.push(localState);
    }

    imagesetsListSetter(allImagesetData);
    saveClientList(allImagesetData);
  };

  const deleteCurrentConfig = (e) => async () => {
    const allImagesetData = imagesetlistData.slice();
    const oldObject = _.findWhere(allImagesetData, {
      id: localState.id,
    });
    debugger;
    if (oldObject) {
      const oldPos = allImagesetData.indexOf(oldObject);
      allImagesetData.splice(oldPos, 1);
      imagesetsListSetter(allImagesetData);
      saveClientList(allImagesetData);
    }
  };

  const imageSelectionChanged = (imageIdList) => {
    setLocalState({ ...localState, images: imageIdList });
  };

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
          selectedImageIds={localState.images}
          changeCallback={imageSelectionChanged}
        />

        <Form.Row>
          <Col>
            <Form.Group className="sm-3" controlId="save">
              <Button variant="primary" type="submit">
                Save Config
              </Button>
              <Button
                variant=""
                onClick={(e) => {
                  e.preventDefault();
                  setConfirmModalVisible(true);
                }}
              >
                Delete Config
              </Button>
            </Form.Group>
          </Col>
        </Form.Row>
      </Form>
      <ConfirmationModal
        show={confirmModalVisible}
        onAccept={(e) => {
          setConfirmModalVisible(false);
          deleteCurrentConfig();
        }}
        onDecline={() => setConfirmModalVisible(false)}
        title={localState.name}
      />{" "}
    </div>
  ) : (
    <div>Choose a imageset from the list to configure it.</div>
  );

  return <div>{body}</div>;
}
