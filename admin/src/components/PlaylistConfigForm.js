import { useRecoilState, useSetRecoilState } from "recoil";
import { editorPlaylist, playlistId, playlistsList } from "../recoil/playlists";
import { clientsList } from "../recoil/clients";
import _ from "underscore";
import { Button, Col, Form } from "react-bootstrap";
import { ImageSorter } from "./ImageSorter";
import { ConfirmationModal } from "./ConfirmationModal";
import { useState } from "react";

import { ChromePicker } from "react-color";

import {
  deletePlaylistFromServer,
  saveClientsToServer,
  savePlaylistsToServer,
} from "../utils/Actions";

export function PlaylistConfigForm(props) {
  const [localState, setLocalState] = useRecoilState(editorPlaylist);
  const [playlistListData, playlistListSetter] = useRecoilState(playlistsList);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [getClients, setClients] = useRecoilState(clientsList);
  const setCurrentId = useSetRecoilState(playlistId);

  const handleColorChange = (color) => {
    inputChanged({
      target: { type: "color", name: "backgroundColor", value: color.hex },
    });
  };

  const inputChanged = function (e) {
    let newValue =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    newValue = e.target.type === "number" ? parseInt(newValue) : newValue;
    const newLocalState = _.defaults(
      { [e.target.name]: newValue },
      { ...localState }
    );
    console.log({ newLocalState });
    setLocalState(newLocalState);
  };

  const handleSubmit = (e) => {
    // nothing to gather, just send it
    e.preventDefault();
    // clone it
    const allPlaylistData = playlistListData.slice();
    const oldObject = _.findWhere(allPlaylistData, {
      id: localState.id,
    });
    if (oldObject) {
      const oldPos = allPlaylistData.indexOf(oldObject);
      allPlaylistData.splice(oldPos, 1, localState);
    } else {
      // add to the end
      allPlaylistData.push(localState);
    }

    // update clients

    const savePlaylists = savePlaylistsToServer(allPlaylistData);
    let finalresult = null;
    savePlaylists()
      .then((res) => {
        finalresult = res.json();
        return finalresult;
      })
      .then((res) => {
        finalresult = res;
        console.log({ finalresult });
        if (finalresult.success) {
          playlistListSetter(allPlaylistData);
        }
      });

    const localClientsList = _.map(getClients, (client) => _.clone(client));
    // find only the "client_" values

    const targetClient = _.findWhere(localClientsList, {
      id: localState.targetClientId,
    });
    if (targetClient) {
      targetClient.imagesetId = localState.id;
      const saveClients = saveClientsToServer(targetClient);
      saveClients(clientsList)
        .then((res) => {
          finalresult = res.json();
          return finalresult;
        })
        .then((res) => {
          finalresult = res;
          console.log({ finalresult });
          setClients(localClientsList);
        });
    }
  };

  const deleteCurrentConfig = (e) => {
    const allPlaylistData = playlistListData.slice();
    const oldObject = _.findWhere(allPlaylistData, {
      id: localState.id,
    });
    if (oldObject) {
      const oldPos = allPlaylistData.indexOf(oldObject);
      allPlaylistData.splice(oldPos, 1);
      const call = deletePlaylistFromServer(localState.id);
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
            playlistListSetter(allPlaylistData);
          }
        });
    }
  };

  const imageSelectionChanged = (imageIdList) => {
    setLocalState({ ...localState, images: imageIdList });
  };

  // inject playlist statuses into localState

  const body = !_.isEmpty(localState) ? (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Row>
          <Col lg={2} md={6}>
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
          <Col lg={2} md={6}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                onChange={inputChanged}
                value={localState.name}
              />
            </Form.Group>
          </Col>
          <Col lg={2} md={6}>
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
          <Col lg={2} md={6}>
            <Form.Group controlId="brightness">
              <Form.Label>Pixel brightness</Form.Label>
              <Form.Control
                name="brightness"
                onChange={inputChanged}
                type="number"
                value={localState.brightness}
              />
              <Form.Text className="text-muted">1-255</Form.Text>
            </Form.Group>
          </Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <Form.Group className="sm-3">
              <Form.Label>Assign this playlist to a client:</Form.Label>
              <br />
              <select
                className="u-flex--1"
                onChange={inputChanged}
                name="targetClientId"
                value={localState.targetClientId}
              >
                <option value="">-- none --</option>
                {_.map(getClients, (client) => (
                  <option value={client.id}>{client.name}</option>
                ))}
              </select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="sm-3" controlId="colorPicker">
              <Form.Label>Background colour</Form.Label>
              <ChromePicker
                alpha={false}
                color={localState.backgroundColor || "#000000"}
                onChange={handleColorChange}
              />
            </Form.Group>
          </Col>
        </Form.Row>
        <Form.Row>
          <Col md={6} lg={3}>
            <Form.Group className="sm-3" controlId="save">
              <Button variant="primary" type="submit">
                Save playlist
              </Button>
            </Form.Group>
          </Col>
          <Col md={6} lg={3}>
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
          backgroundColor={localState.backgroundColor || "#000000"}
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
