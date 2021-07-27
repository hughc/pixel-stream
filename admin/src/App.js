import "./css/App.scss";
import { Container, Row, Col } from "react-bootstrap";

//import ImageTable from './components/ImageTable';
import { ImageSorter } from "./components/ImageSorter";
import Header from "./components/Header";
import { Component } from "react";
import LinkList from "./components/LinkList";
import { Welcome } from "./components/Welcome";
import ClientConfig from "./components/ClientConfig";
import { RecoilRoot } from "recoil";

class App extends Component {
  constructor() {
    super();
    this.state = { currentScreen: "welcome" };
    this.linkClick = this.changeScreen.bind(this);
  }
  render() {
    let mainContent;
    switch (this.state.currentScreen) {
      case "imagesorter":
        mainContent = <ImageSorter />;
        break;
      case "welcome":
        mainContent = <Welcome />;
        break;
      case "clientconfig":
        mainContent = <ClientConfig />;
        break;

      default:
        break;
    }
    return (
      <RecoilRoot>
        <div className="App full-height">
          <Header title="Pixel grid admin" />
          <Container fluid className="u-h--1">
            <Row className="u-h--1">
              <Col xs={1} className="sidebar u-pad--20">
                <LinkList
                  onClick={this.linkClick}
                  activeScreen={this.state.currentScreen}
                />
              </Col>
              <Col className="u-pad--20">{mainContent}</Col>
            </Row>
          </Container>
        </div>
      </RecoilRoot>
    );
  }

  changeScreen(e) {
    console.log(e);
    e.preventDefault();
    this.setState({ currentScreen: e.target.dataset.target });
  }
}

export default App;
