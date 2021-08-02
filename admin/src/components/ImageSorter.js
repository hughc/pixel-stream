import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { Draggable } from "./Draggable.jsx";
import { Droppable } from "./Droppable.jsx";
import _ from "underscore";

import { useRecoilState } from "recoil";
import { imagesList } from "../recoil/images.js";
import { API_BASE_URL } from "../recoil/imagesets.js";

export function ImageSorter(props) {
  const [getImages] = useRecoilState(imagesList);

  const [selectedIds, setSelectedIds] = useState(props.images);

  const generateImages = (status) => {
    let source;
    if (status == "selected") {
      source = _.filter(
        getImages,
        (image) => selectedIds.indexOf(image.path) > -1
      );
    } else {
      source = _.filter(
        getImages,
        (image) => selectedIds.indexOf(image.path) == -1
      );
    }
    return _.map(source, (image) => {
      return (
        <Draggable id={image.path}>
          <img
            class="c-draggable-image"
            alt={image.img.replace(/.png|.gif|.jpg/g, "")}
            src={`${API_BASE_URL}${image.path}`}
          />
        </Draggable>
      );
    });
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="c-draggable-list">
        <div className="c-draggable-list-label">Selected Images</div>
        <Droppable dropId="selectedImages" className="drop-zone">
          <div className="c-draggable-list-items">
            {generateImages("selected")}
          </div>
        </Droppable>
      </div>
      <div className="c-draggable-list">
        <div className="c-draggable-list-label">All Images</div>
        <Droppable dropId="allImages" className="drop-zone">
          <div className="c-draggable-list-items">
            {generateImages("unselected")}
          </div>
        </Droppable>
      </div>
      {/*  <Droppable dropId="allImages" className="drop-zone">
        {generateImages("unselected")}
      </Droppable> */}
    </DndContext>
  );

  function handleDragEnd(event) {
    var hasUpdated = false;
    if (event.over && event.over.id === "selectedImages") {
      console.log({ event });
      const draggedId = event.active.id;
      const alreadySelected = _.contains(selectedIds, draggedId);
      if (alreadySelected) return;
      const newImageList = selectedIds.slice();
      newImageList.push(draggedId);
      setSelectedIds(newImageList);
      hasUpdated = true;
    }
    if (event.over && event.over.id === "allImages") {
      console.log({ event });
      const draggedId = event.active.id;
      const alreadySelected = _.contains(selectedIds, draggedId);
      if (!alreadySelected) return;
      const newImageList = _.clone(selectedIds);
      newImageList.splice(selectedIds.indexOf(draggedId), 1);
      setSelectedIds(newImageList);
      hasUpdated = true;
    }
    if (hasUpdated) props.changeCallback(selectedIds);
  }
}
