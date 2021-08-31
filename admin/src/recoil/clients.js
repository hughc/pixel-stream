import { atom, selector } from "recoil";
import _ from "underscore";
import { getBaseURL } from "./constants";

export const CLIENT_API_URL = `${getBaseURL()}/clients`;

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

export const clientSelector = selector({
  key: "clientSelector",
  get: async () => {
    const apiData = await fetch(CLIENT_API_URL).then((res) => res.json());
    return apiData;
  },
  set: ({ set }, data) => {
    set(clientsList, data);
  },
});

export const clientsList = atom({
  key: "clientsList",
  default: clientSelector,
});
