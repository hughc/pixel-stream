import { atom, selector } from "recoil";
import _ from "underscore";

const API_BASE_URL = "http://localhost:3001";
const IMAGE_LIST_URL = `${API_BASE_URL}/images`;
const CLIENT_LIST_URL = `${API_BASE_URL}/clients`;

export const clientFetching = atom({
  key: "clientFetching",
  default: false,
});

export const clientId = atom({
  key: "clientId",
  default: 0,
});

export const clientObject = selector({
  key: "clientObject",
  get: ({ get }) => {
    const clientIdValue = get(clientId);
    const clientListValue = get(clientsList);
    if (!clientIdValue) return;
    return _.findWhere(clientListValue, { id: clientIdValue });
  },
});

const clientSelector = selector({
  key: "clientSelector",
  get: async () => {
    const apiData = await fetch(CLIENT_LIST_URL).then((res) => res.json());
    return apiData;
  },
});

export const clientsList = atom({
  key: "clientsList",
  default: clientSelector,
});
