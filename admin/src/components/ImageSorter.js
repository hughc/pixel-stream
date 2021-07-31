import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { Draggable } from "./Draggable.jsx";
import { Droppable } from "./Droppable.jsx";
import _ from "underscore";

import { useRecoilState } from "recoil";
import { imagesList } from "../recoil/images.js";
import { API_BASE_URL } from "../recoil/imagesets.js";

export function ImageSorter() {
  const [isDropped, setIsDropped] = useState(false);
  const [getImages, setImages] = useRecoilState(imagesList);

  const generateImages = () => {
    console.log({ getImages });
    return _.map(getImages, (image) => {
      return (
        <Draggable className="c-draggable" id={image.path}>
          <img
            class="c-draggable-image"
            alt={image.img.replace(/.png|.gif|.jpg/g, "")}
            src={`${API_BASE_URL}${image.path}`}
          />
        </Draggable>
      );
    });
  };

  const draggableMarkup = <Draggable>Drag me</Draggable>;

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="c-draggable-list">{generateImages()}</div>
      <Droppable className="drop-zone">
        {isDropped ? draggableMarkup : "Drop here"}
      </Droppable>
    </DndContext>
  );

  function handleDragEnd(event) {
    if (event.over && event.over.id === "droppable") {
      console.log(event);
      //        setIsDropped(true);
    }
  }
}
