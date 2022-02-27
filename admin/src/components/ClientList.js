import { useRecoilValue, useSetRecoilState } from "recoil";
import { clientId, clientsList } from "../recoil/clients";

export function ClientList(props) {
  const clientLists = useRecoilValue(clientsList);
  const clientIdSetter = useSetRecoilState(clientId);

  const selector = (e) => {
    e.preventDefault();
    clientIdSetter((oldId) => e.target.dataset.target);
  };

  const renderItem = (item) => {
    return (
      <div key={item.id} className="c-clients__single">
        <a href="clients-{item-id}" data-target={item.id} onClick={selector}>
          {item.name} ({item.id})
        </a>
      </div>
    );
  };

  return (
    <div className="c-clients">
      <h4>Client List:</h4>
      {clientLists.map(renderItem)}
    </div>
  );
}
