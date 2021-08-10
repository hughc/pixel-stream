import { Button, ButtonGroup } from "react-bootstrap";

export default function LinkList(props) {
  return (
    <ButtonGroup className="c-link-list" aria-label="First group">
      <Button
        variant="light"
        className={props.activeScreen === "imageupload" ? "is-active" : ""}
        data-target="imageupload"
        onClick={props.onClick}
      >
        Images
      </Button>
      <Button
        variant="light"
        className={props.activeScreen === "clientconfig" ? "is-active" : ""}
        data-target="clientconfig"
        onClick={props.onClick}
      >
        Clients
      </Button>
      <Button
        variant="light"
        className={props.activeScreen === "imagesorter" ? "is-active" : ""}
        data-target="imagesorter"
        onClick={props.onClick}
      >
        Playlists
      </Button>
    </ButtonGroup>
  );
}
