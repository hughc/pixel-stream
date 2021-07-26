import { useEffect, useState } from "react";

export function ClientList(props) {
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    props.api.fetchClients();
    return () => {};
  });

  return <div>Client List: {props.status}</div>;
}
