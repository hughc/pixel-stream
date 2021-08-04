import { IMAGESET_API_URL } from "../recoil/imagesets";

export const saveClientList = (passedState) => async () => {
  const request = new Request(IMAGESET_API_URL, {
    method: "POST",
    body: JSON.stringify(passedState),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const returnedData = await fetch(request).then((res) => res.json());
  if (returnedData.success) {
  }
};
