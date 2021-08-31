import React, { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { Draggable } from "./Draggable.jsx";
import { Droppable } from "./Droppable.jsx";
import _ from "underscore";

import { useRecoilState } from "recoil";
import { imagesList } from "../recoil/images.js";
import { getBaseURL } from "../recoil/constants";
import { Button, ToggleButtonGroup } from "react-bootstrap";

export function ImageSorter(props) {
  const [getImages] = useRecoilState(imagesList);

  const [selectedIds, setSelectedIds] = useState([]);
  const [getFilter, setFilter] = useState("");

  useEffect(() => {
    setSelectedIds(_.uniq(props.selectedImageIds));
  }, [props.selectedImageIds]);

  const handleFilter = function (e) {
    setFilter(e.target.value);
  };
  const clearFilter = function (e) {
    setFilter("");
  };

  console.log(`using props.selectedImageIds: ${props.selectedImageIds}`);
  // console.log({ selectedIds });

  const generateImages = (status) => {
    let source;
    const uniqueSelected = _.uniq(selectedIds);
    if (status === "selected") {
      source = _.compact(
        _.map(uniqueSelected, (id) => _.findWhere(getImages, { id }))
      );
    } else {
      source = _.filter(
        getImages,
        (image) => uniqueSelected.indexOf(image.id) === -1
      );
      if (getFilter.length > 2)
        source = _.filter(
          source,
          (item) => item.id.toLowerCase().indexOf(getFilter.toLowerCase()) > -1
        );
    }
    return _.map(source, (image) => {
      return (
        <Draggable
          id={image.id}
          alt={image.id.replace(/.png|.gif|.jpg/g, "")}
          key={image.id}
        >
          <img
            className="c-draggable-image"
            alt={image.id.replace(/.png|.gif|.jpg/g, "")}
            src={`${getBaseURL()}${image.path}`}
          />
        </Draggable>
      );
    });
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <ToggleButtonGroup className="mb-2">
        <Button>Add &amp; Remove</Button>
        <Button>Re-Order</Button>
      </ToggleButtonGroup>
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
    let hasUpdated = false;
    let newImageList;
    if (event.over && event.over.id === "selectedImages") {
      const draggedId = event.active.id;
      const alreadySelected = _.contains(selectedIds, draggedId);
      if (alreadySelected) return;
      newImageList = selectedIds.slice();
      newImageList.push(draggedId);
      //   setSelectedIds(newImageList);
      hasUpdated = true;
    }
    if (event.over && event.over.id === "allImages") {
      console.log({ event });
      const draggedId = event.active.id;
      const alreadySelected = _.contains(selectedIds, draggedId);
      if (!alreadySelected) return;
      newImageList = _.clone(selectedIds);
      newImageList.splice(selectedIds.indexOf(draggedId), 1);
      //  setSelectedIds(newImageList);
      hasUpdated = true;
    }
    if (hasUpdated) {
      props.changeCallback(newImageList);
    }
  }
}
