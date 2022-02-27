import {
  PLAYLIST_API_URL,
  PLAYLIST_API_URL_SINGULAR,
} from "../recoil/playlists";
import { CLIENT_PLAYLIST_API_URL, CLIENT_API_URL } from "../recoil/clients";

export const saveClientsToServer = (clientObjectData) => async () => {
  const request = new Request(CLIENT_API_URL, {
    method: "POST",
    body: JSON.stringify(clientObjectData),
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const promise = await fetch(request);
  if (promise.success) {
    console.log({ promise: promise });
  }
  return promise;
};

export const updateClientPlayListsToServer = (allClientData) => async () => {
  const request = new Request(CLIENT_PLAYLIST_API_URL, {
    method: "POST",
    body: JSON.stringify(allClientData),
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const promise = await fetch(request);
  if (promise.success) {
    console.log({ promise: promise });
  }
  return promise;
};

export const savePlaylistsToServer = (passedState) => async () => {
  const request = new Request(PLAYLIST_API_URL, {
    method: "POST",
    body: JSON.stringify(passedState),
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log({ request });

  const promise = await fetch(request);
  if (promise.success) {
    console.log({ promise: promise });
  }
  return promise;
};

export const deletePlaylistFromServer = (uid) => async () => {
  const request = new Request(PLAYLIST_API_URL_SINGULAR, {
    method: "delete",
    body: JSON.stringify({ uid }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const promise = await fetch(request);
  if (promise.success) {
    console.log("image deleted OK");
  }
  return promise;
};
