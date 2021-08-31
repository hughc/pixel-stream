import { atom, selector } from "recoil";
import _ from "underscore";
import { getBaseURL } from "./constants";

export const IMAGE_LIST_URL = `${getBaseURL()}/images`;
export const IMAGE_UPLOAD_URL = `${getBaseURL()}/upload`;

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

export const anImage = selector({
  key: "randomImage",
  get: ({ get }) => {
    const allImages = get(imagesList);
    const thisImage =
      allImages[Math.round(Math.random() * 100000) % allImages.length];
    console.log({ thisImage });
    return thisImage;
  },
});
