import { useEffect, useState } from "react";
import { selector, useRecoilValue, useSetRecoilState } from "recoil";
import { clientId, clientSelector } from "../recoil/clients";

export function ClientList(props) {
  const clientFetching = useRecoilValue(clientSelector);
  const clientIdSetter = useSetRecoilState(clientId);

  const selector = (e) => {
    clientIdSetter((oldId) => e.target.dataset.target);
  };

  const renderItem = (item) => {
    return (
      <div key={item.id}>
        <a data-target={item.id} onClick={selector}>
          {item.title}
        </a>
      </div>
    );
  };

  return (
    <div>
      <h3>Client List:</h3>
      {clientFetching.map(renderItem)}
    </div>
  );
}
