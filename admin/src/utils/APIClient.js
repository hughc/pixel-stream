import { Component } from "react";
import { useSetRecoilState } from "recoil";
import { clientFetching } from "../recoil/clients";
import { API_BASE_URL } from "../recoil/constants";

const IMAGE_LIST_URL = `${API_BASE_URL}/images`;
const CLIENT_LIST_URL = `${API_BASE_URL}/clients`;

export function ApiClientWrapper() {
  const clientFetchingSetter = useSetRecoilState(clientFetching);

  return <APIClient clientFetching={clientFetchingSetter} />;
}

export class APIClient extends Component {
  render() {
    return <div></div>;
  }
  fetchImages = () => {
    this.setState({ isFetching: true });
    fetch(IMAGE_LIST_URL)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        this.setState({ isFetching: false });
      })
      .catch((e) => {
        console.log(e);
        this.setState({ isFetching: false });
      });
  };

  fetchClients = () => {
    //this.setState({ isFetching: true });
    this.clientFetching((oldValue) => true);
    fetch(CLIENT_LIST_URL)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        this.clientFetching((oldValue) => true);
        //      this.setState({ clients: result, isFetching: false });
      })
      .catch((e) => {
        console.log(e);
        this.clientFetching((oldValue) => false);
      });
  };
}
