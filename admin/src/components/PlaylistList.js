import { Button } from "react-bootstrap";
import { useRecoilValue, useSetRecoilState } from "recoil";
import _ from "underscore";
import { formPlaylist, playlistId, playlistsList } from "../recoil/playlists";

export function PlaylistList(props) {
  const playlists = useRecoilValue(playlistsList);
  const playlistIdSetter = useSetRecoilState(playlistId);
  const setCurrentFormData = useSetRecoilState(formPlaylist);

  const selector = (e) => {
    e.preventDefault();
    // clear existing object
    setCurrentFormData({});
    playlistIdSetter((oldId) => parseInt(e.target.dataset.target));
  };

  const newPlaylist = (e) => {
    const currentHighestId = _.max(_.pluck(playlists, "id"));
    console.log(playlists);
    // clear existing object
    setCurrentFormData({});
    playlistIdSetter((oldId) =>
      currentHighestId > 0 ? currentHighestId + 1 : 1
    );
  };

  const renderItem = (item) => {
    return (
      <div key={item.id} className="c-clients__single">
        <a href="clients-{item-id}" data-target={item.id} onClick={selector}>
          {item.name}
        </a>
      </div>
    );
  };

  return (
    <div className="c-clients">
      <h4>Playlists:</h4>
      <div>{playlists.map(renderItem)}</div>
      <Button
        className="u-margin--top-20"
        onClick={newPlaylist}
        variant="light"
        type="submit"
      >
        New Playlist
      </Button>
    </div>
  );
}
