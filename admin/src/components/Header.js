import { Col, Row } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { getBaseURL } from "../recoil/constants";
import { anImage } from "../recoil/images";

export function Header(props) {
  const [anImageRef] = useRecoilState(anImage);

  return (
    <div className="c-header u-pad--20 u-flex u-flex--align-center u-flex--justify-between">
      <Row className="u-w--1">
        <Col xs={12} md={6} className="u-margin--bottom-20">
          <div className="c-header-branding u-flex u-flex--align-center">
            <div
              className="home-link u-flex u-cursor--pointer"
              data-target="welcome"
            >
              <img
                className="u-margin--right-20"
                src={getBaseURL() + anImageRef.path}
                alt={anImageRef.path}
              />
              <h2 className="c-header-title u-margin--bottom-0">
                {props.title}
              </h2>
            </div>
          </div>
        </Col>
        <Col xs={12} md={6}>
          <div className="c-header-links sm-3 col-xs-12">{props.children}</div>
        </Col>
      </Row>
    </div>
  );
}
