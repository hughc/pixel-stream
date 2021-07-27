import { useRecoilValue } from "recoil";
import { clientId } from "../recoil/clients";

export function ClientConfigForm(props) {
  const clientIdGetter = useRecoilValue(clientId);
  return (
    <div>
      clientId: {clientIdGetter}
      <form></form>
    </div>
  );
}
