import { atom, selector } from "recoil";
import _ from "underscore";
import { API_BASE_URL } from "./constants";

export const IMAGESET_API_URL = `${API_BASE_URL}/imagesets`;
export const IMAGESET_API_URL_SINGULAR = `${API_BASE_URL}/imageset`;

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

export const editorImageset = selector({
  key: "imagesetObject",
  get: ({ get }) => {
    if (!_.isEmpty(get(formImageSet))) return get(formImageSet);
    const imagesetIdValue = get(imagesetId);
    const imagesetListValue = get(imagesetsList);
    if (!imagesetIdValue) return;
    const rData = _.clone(
      _.findWhere(imagesetListValue, { id: imagesetIdValue })
    );
    if (rData) {
      console.log(rData);
      rData.images = rData.images ? rData.images.slice() : [];
      return rData;
    } else {
      return emptyImageSet(imagesetIdValue);
    }
  },
  set: ({ set }, value) => {
    set(formImageSet, value);
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
