import {
  IMAGESET_API_URL,
  IMAGESET_API_URL_SINGULAR,
} from "../recoil/imagesets";

export const saveImageSetsToServer = (passedState) => async () => {
  const request = new Request(IMAGESET_API_URL, {
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

export const deleteImageSetFromServer = (uid) => async () => {
  const request = new Request(IMAGESET_API_URL_SINGULAR, {
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
