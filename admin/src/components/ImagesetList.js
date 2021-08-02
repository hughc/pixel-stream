import { Button } from "react-bootstrap";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import _ from "underscore";
import {
  formImageSet,
  imagesetId,
  imagesetObject,
  imagesetsList,
} from "../recoil/imagesets";

export function ImagesetList(props) {
  const imagesets = useRecoilValue(imagesetsList);
  const imagesetIdSetter = useSetRecoilState(imagesetId);
  const [imagesetObjectData] = useRecoilState(imagesetObject);

  const selector = (e) => {
    e.preventDefault();
    imagesetIdSetter((oldId) => parseInt(e.target.dataset.target));
  };

  const newImageset = (e) => {
    const currentHighestId = _.max(_.pluck(imagesets, "id"));
    console.log(imagesets);
    //  debugger;
    imagesetIdSetter((oldId) =>
      currentHighestId > 0 ? currentHighestId + 1 : 1
    );
  };

  const renderItem = (item) => {
    return (
      <div key={item.id} className="c-clients__single">
        <a href="clients-{item-id}" data-target={item.id} onClick={selector}>
          {item.name}
        </a>
      </div>
    );
  };

  return (
    <div className="c-clients">
      <h4>Image Sets List:</h4>
      <div>{imagesets.map(renderItem)}</div>
      <Button onClick={newImageset} variant="primary" type="submit">
        New Imageset
      </Button>
    </div>
  );
}
