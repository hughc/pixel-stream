import { atom, selector } from "recoil";
import _ from "underscore";

export const API_BASE_URL = "http://localhost:3001";
export const IMAGE_LIST_URL = `${API_BASE_URL}/images`;

export const imageFetching = atom({
  key: "imageFetching",
  default: false,
});

export const imageId = atom({
  key: "imageId",
  default: 0,
});

export const imageObject = selector({
  key: "imageObject",
  get: ({ get }) => {
    const imageIdValue = get(imageId);
    const imageListValue = get(imagesList);
    if (!imageIdValue) return;
    return (
      _.findWhere(imageListValue, { id: imageIdValue }) || {
        id: imageIdValue,
        name: "",
        duration: 10,
        images: [],
      }
    );
  },
});

export const imageSelector = selector({
  key: "imageSelector",
  get: async () => {
    const apiData = await fetch(IMAGE_LIST_URL).then((res) => res.json());
    return apiData;
  },
  set: ({ set }, data) => {
    set(imagesList, data);
  },
});

export const imagesList = atom({
  key: "imagesList",
  default: imageSelector,
});
