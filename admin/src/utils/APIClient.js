import { Component } from "react";
import _ from "underscore";
const API_BASE_URL = "http://localhost:3001";
const IMAGE_LIST_URL = `${API_BASE_URL}/images`;
const CLIENT_LIST_URL = `${API_BASE_URL}/clients`;

export default class APIClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      images: [],
      clients: [],
    };
  }

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
    this.setState({ isFetching: true });
    fetch(CLIENT_LIST_URL)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        this.setState({ clients: result, isFetching: false });
      })
      .catch((e) => {
        console.log(e);
        this.setState({ isFetching: false });
      });
  };
}
