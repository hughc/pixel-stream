import { useRecoilState, useSetRecoilState } from "recoil";
import { CLIENT_API_URL } from "../recoil/clients";

export const saveClientList = (data) => async () => {
  const form_data = new FormData();

  for (var key in data) {
    form_data.append(key, data[key]);
  }

  const request = new Request(CLIENT_API_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const apiData = await fetch(request).then((res) => res.json());
  return apiData;
};
