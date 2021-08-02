import { atom, selector } from "recoil";
import _ from "underscore";

export const API_BASE_URL = "http://localhost:3001";
export const IMAGE_LIST_URL = `${API_BASE_URL}/images`;
export const IMAGESET_API_URL = `${API_BASE_URL}/imagesets`;

export const imagesetFetching = atom({
  key: "imagesetFetching",
  default: false,
});

export const imagesetId = atom({
  key: "imagesetId",
  default: 0,
});

export const formImageSet = atom({
  key: "imageFormState",
  default: {},
});

export const imagesetObject = selector({
  key: "imagesetObject",
  get: ({ get }) => {
    const imagesetIdValue = get(imagesetId);
    const imagesetListValue = get(imagesetsList);
    if (!imagesetIdValue) return;
    return (
      _.findWhere(imagesetListValue, { id: imagesetIdValue }) ||
      emptyImageSet(imagesetIdValue)
    );
  },
});

export const emptyImageSet = (idValue) => {
  return {
    id: idValue,
    name: "",
    duration: 10,
    images: [],
  };
};

export const imagesetSelector = selector({
  key: "imagesetSelector",
  get: async () => {
    const apiData = await fetch(IMAGESET_API_URL).then((res) => res.json());
    return apiData;
  },
  set: ({ set }, data) => {
    set(imagesetsList, data);
  },
});

export const imagesetsList = atom({
  key: "imagesetsList",
  default: imagesetSelector,
});
