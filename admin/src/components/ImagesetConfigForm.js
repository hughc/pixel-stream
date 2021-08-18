import { useRecoilState, useSetRecoilState } from "recoil";
import {
  editorImageset,
  imagesetId,
  imagesetsList,
  IMAGESET_API_URL,
} from "../recoil/imagesets";
import _ from "underscore";
import { Button, Col, Form } from "react-bootstrap";
import { ImageSorter } from "./ImageSorter";
import { ConfirmationModal } from "./ConfirmationModal";
import { useState } from "react";
import {
  deleteImageSetFromServer,
  saveImageSetsToServer,
} from "../utils/Actions";
import { clientsList } from "../recoil/clients";

export function ImagesetConfigForm(props) {
  const [localState, setLocalState] = useRecoilState(editorImageset);
  const [imagesetlistData, imagesetsListSetter] = useRecoilState(imagesetsList);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [getClients, setClients] = useRecoilState(clientsList);
  const setCurrentId = useSetRecoilState(imagesetId);
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

  const handleSubmit = (e) => {
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
    console.log({ saveImageSetsToServer });
    saveImageSetsToServer(allImagesetData);

    const call = saveImageSetsToServer(allImagesetData);
    let finalresult = null;
    call()
      .then((res) => {
        finalresult = res.json();
        return finalresult;
      })
      .then((res) => {
        finalresult = res;
        console.log({ finalresult });
        if (finalresult.success) {
          imagesetsListSetter(allImagesetData);
        }
      });
  };

  const deleteCurrentConfig = (e) => {
    const allImagesetData = imagesetlistData.slice();
    const oldObject = _.findWhere(allImagesetData, {
      id: localState.id,
    });
    if (oldObject) {
      const oldPos = allImagesetData.indexOf(oldObject);
      allImagesetData.splice(oldPos, 1);
      const call = deleteImageSetFromServer(localState.id);
      let finalresult = null;
      call()
        .then((res) => {
          finalresult = res.json();
          return finalresult;
        })
        .then((res) => {
          finalresult = res;
          console.log({ finalresult });
          if (finalresult.success) {
            setCurrentId(0);
            imagesetsListSetter(allImagesetData);
          }
        });
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
          <Col sm="6">
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
                Time each image displays for.
              </Form.Text>
            </Form.Group>
          </Col>
          <Col sm="2">
            <Form.Group controlId="brightness">
              <Form.Label>Pixel brightness</Form.Label>
              <Form.Control
                name="brightness"
                onChange={inputChanged}
                type="number"
                value={localState.brightness}
              />
              <Form.Text className="text-muted">
                Time each image displays for.
              </Form.Text>
            </Form.Group>
          </Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <Form.Group className="sm-3" controlId="selectedClient">
              <Form.Label>Show this playlist on these clients:</Form.Label>
              {getClients.map((client) => (
                <Form.Check
                  type="checkbox"
                  label={client.name}
                  name="selectedClient"
                  onChange={inputChanged}
                  value={client.id}
                />
              ))}
            </Form.Group>
          </Col>
        </Form.Row>
        <Form.Row>
          <Col sm="2">
            <Form.Group className="sm-3" controlId="save">
              <Button variant="primary" type="submit">
                Save playlist
              </Button>
            </Form.Group>
          </Col>
          <Col sm="2">
            <Form.Group>
              <Button
                variant="warning"
                onClick={(e) => {
                  e.preventDefault();
                  setConfirmModalVisible(true);
                }}
              >
                Delete playlist
              </Button>
            </Form.Group>
          </Col>
        </Form.Row>

        <ImageSorter
          selectedImageIds={localState.images}
          changeCallback={imageSelectionChanged}
        />
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
