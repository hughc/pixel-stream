import "./css/App.scss";
import { Container, Row, Col } from "react-bootstrap";

import { Header } from "./components/Header";
import { Component, Suspense } from "react";
import LinkList from "./components/LinkList";
import { Welcome } from "./components/Welcome";
import ClientConfig from "./components/ClientConfig";
import { RecoilRoot } from "recoil";
import ImagesetConfig from "./components/ImagesetConfig";
import ImageLoader from "./components/ImageLoader";

class App extends Component {
  constructor() {
    super();
    this.state = { currentScreen: "welcome" };
    this.linkClick = this.changeScreen.bind(this);
  }
  render() {
    let mainContent;
    console.log(`this.state.currentScreen: ${this.state.currentScreen}`);
    switch (this.state.currentScreen) {
      case "imagesorter":
        mainContent = <ImagesetConfig />;
        break;
      case "welcome":
        mainContent = <Welcome />;
        break;
      case "clientconfig":
        mainContent = <ClientConfig />;
        break;
      case "imageupload":
        mainContent = <ImageLoader />;
        break;

      default:
        break;
    }
    return (
      <RecoilRoot>
        <div className="App full-height">
          <Container fluid className="c-header-background">
            <Container>
              <Suspense fallback={<div>Loading...</div>}>
                <Header title="Pixel grid admin" homeclick={this.linkClick}>
                  <LinkList
                    onClick={this.linkClick}
                    activeScreen={this.state.currentScreen}
                  />
                </Header>
              </Suspense>
            </Container>
          </Container>
          <Container className="u-h--1">
            <Row className="u-h--1">
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
    this.setState({ currentScreen: e.currentTarget.dataset.target });
  }
}

export default App;
