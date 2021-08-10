import { useRecoilState } from "recoil";
import { anImage, API_BASE_URL } from "../recoil/images";

export function Header(props) {
  const [anImageRef] = useRecoilState(anImage);

  return (
    <div className="c-header u-pad--20 u-flex u-flex--align-center u-flex--justify-between">
      <div className="c-header-branding u-flex u-flex--align-center">
        <div
          className="home-link u-flex u-cursor--pointer"
          data-target="welcome"
        >
          <img
            className="u-margin--right-20"
            src={API_BASE_URL + anImageRef.path}
            alt={anImageRef.path}
          />
          <h2 className="c-header-title u-margin--bottom-0">{props.title}</h2>
        </div>
      </div>
      <div className="c-header-links">{props.children}</div>
    </div>
  );
}
