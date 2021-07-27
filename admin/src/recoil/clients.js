import { atom, selector } from "recoil";

export const clientFetching = atom({
  key: "clientFetching",
  default: false,
});

export const clientsList = atom({
  key: "clientsList",
  default: [],
});

export const clientId = atom({
  key: "clientId",
  default: [],
});

export const clientSelector = selector({
  key: "clientList",
  get: async () => {
    const apiData = await fetch(
      "https://jsonplaceholder.typicode.com/todos/"
    ).then((res) => res.json());
    return apiData;
  },
});
