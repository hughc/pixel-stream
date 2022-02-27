import { atom, selector } from "recoil";
import _ from "underscore";
import { getBaseURL } from "./constants";

export const PLAYLIST_API_URL = `${getBaseURL()}/imagesets`;
export const PLAYLIST_API_URL_SINGULAR = `${getBaseURL()}/imageset`;

export const playlistFetching = atom({
  key: "playlistFetching",
  default: false,
});

export const playlistId = atom({
  key: "playlistId",
  default: 0,
});

export const formPlaylist = atom({
  key: "formPlaylist",
  default: {},
});

export const editorPlaylist = selector({
  key: "playlistObject",
  get: ({ get }) => {
    if (!_.isEmpty(get(formPlaylist))) return get(formPlaylist);
    const playlistIdValue = get(playlistId);
    const playlistsListValue = get(playlistsList);
    if (!playlistIdValue) return;
    const rData = _.clone(
      _.findWhere(playlistsListValue, { id: playlistIdValue })
    );
    if (rData) {
      rData.images = rData.images ? rData.images.slice() : [];
      return rData;
    } else {
      return emptyPlaylist(playlistIdValue);
    }
  },
  set: ({ set }, value) => {
    set(formPlaylist, value);
  },
});

export const emptyPlaylist = (idValue) => {
  return {
    id: idValue,
    name: "",
    duration: 10,
    images: [],
  };
};

export const playlistSelector = selector({
  key: "playlistSelector",
  get: async () => {
    const apiData = await fetch(PLAYLIST_API_URL).then((res) => res.json());
    return apiData;
  },
  set: ({ set }, data) => {
    set(playlistsList, data);
  },
});

export const playlistsList = atom({
  key: "PlaylistList",
  default: playlistSelector,
});
