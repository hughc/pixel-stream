import React, { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { Draggable } from "./Draggable.jsx";
import { Droppable } from "./Droppable.jsx";
import _ from "underscore";

import { useRecoilState } from "recoil";
import { imagesList } from "../recoil/images.js";
import { API_BASE_URL } from "../recoil/imagesets.js";

export function ImageSorter(props) {
  const [getImages] = useRecoilState(imagesList);

  const [selectedIds, setSelectedIds] = useState([]);
  const [getFilter, setFilter] = useState("");

  useEffect(() => {
    setSelectedIds(props.images);
  }, [props.images]);

  const handleFilter = function (e) {
    setFilter(e.target.value);
  };
  const clearFilter = function (e) {
    setFilter("");
  };

  console.log({ images: props.images });
  console.log({ selectedIds });

  const generateImages = (status) => {
    let source;
    if (status == "selected") {
      source = _.compact(
        _.map(selectedIds, (id) => _.findWhere(getImages, { path: id }))
      );
    } else {
      source = _.filter(
        getImages,
        (image) => selectedIds.indexOf(image.path) == -1
      );
      if (getFilter.length > 2)
        source = _.filter(
          source,
          (item) =>
            item.path.toLowerCase().indexOf(getFilter.toLowerCase()) > -1
        );
    }
    return _.map(source, (image) => {
      return (
        <Draggable
          id={image.path}
          alt={image.path.replace(/.png|.gif|.jpg/g, "")}
        >
          <img
            class="c-draggable-image"
            alt={image.path.replace(/.png|.gif|.jpg/g, "")}
            src={`${API_BASE_URL}${image.path}`}
          />
        </Draggable>
      );
    });
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="c-draggable-list">
        <div className="c-draggable-list-header">
          <div className="c-draggable-list-label">Selected Images</div>
        </div>
        <Droppable dropId="selectedImages" className="drop-zone">
          <div className="c-draggable-list-items">
            {generateImages("selected")}
          </div>
        </Droppable>
      </div>
      <div className="c-draggable-list">
        <div className="c-draggable-list-header">
          <div className="c-draggable-list-label">All Images</div>
          <div className="c-draggable-list-filter">
            Filter:{" "}
            <input type="text" onChange={handleFilter} value={getFilter} />
            <div
              className="c-draggable-list-filter-clear"
              onClick={clearFilter}
            >
              X
            </div>
          </div>
        </div>
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
