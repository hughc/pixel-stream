export default function LinkList(props) {
  return (
    <ul className="c-link-list">
      <li>
        <a
          href="#clients"
          className={props.activeScreen === "clientconfig" ? "is-active" : ""}
          data-target="clientconfig"
          onClick={props.onClick}
        >
          Clients
        </a>
      </li>
      <li>
        <a
          href="#imagesets"
          className={props.activeScreen === "imagesorter" ? "is-active" : ""}
          data-target="imagesorter"
          onClick={props.onClick}
        >
          Image Sets
        </a>
      </li>
    </ul>
  );
}
