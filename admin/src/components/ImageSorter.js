import React, { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { Draggable } from "./Draggable.jsx";
import { Droppable } from "./Droppable.jsx";
import _ from "underscore";

import { useRecoilState } from "recoil";
import { imagesList } from "../recoil/images.js";
import { getBaseURL } from "../recoil/constants";
import { Row, Tab, Tabs } from "react-bootstrap";

export function ImageSorter(props) {
  const [getImages] = useRecoilState(imagesList);

  const [selectedIds, setSelectedIds] = useState([]);
  const [getFilter, setFilter] = useState("");
  const [getFolderFilter, setFolderFilter] = useState("");
  const [setMode] = useState("");

  useEffect(() => {
    setSelectedIds(_.uniq(props.selectedImageIds));
  }, [props.selectedImageIds]);

  const handleFilter = function (e) {
    setFilter(e.target.value);
  };
  const clearFilter = function (e) {
    setFilter("");
  };

  const generateFolderList = () =>
    _.compact(
      _.uniq(
        _.map(getImages, (name) =>
          name.id.split("/").length === 1 ? false : name.id.split("/")[0]
        )
      )
    );

  const handleFolderFilter = function (e) {
    setFolderFilter(e.target.value);
  };
  const clearFolderFilter = function (e) {
    setFolderFilter("");
  };

  //console.log(`using props.selectedImageIds: ${props.selectedImageIds}`);
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
      if (getFolderFilter !== "")
        source = _.filter(
          source,
          (item) => item.id.indexOf(getFolderFilter) > -1
        );
    }
    return _.map(source, (image) => {
      return (
        <Draggable
          id={image.id}
          alt={image.id.replace(/.png|.gif|.jpg/g, "")}
          key={image.id}
        >
          <div style={{ backgroundColor: props.backgroundColor }}>
            <img
              className="c-draggable-image"
              alt={image.id.replace(/.png|.gif|.jpg/g, "")}
              src={`${getBaseURL()}${image.path}`}
            />
          </div>
        </Draggable>
      );
    });
  };

  const setOperationMode = function (choice) {
    setMode(choice);
  };

  const folders = generateFolderList();

  return (
    <Tabs defaultActiveKey="add-remove" id="uncontrolled-tab-example">
      <Tab eventKey="add-remove" title="Add / Remove">
        <DndContext onDragEnd={handleDragEnd}>
          {/* slected images */}
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
          {/* all images */}
          <div className="c-draggable-list">
            <div className="c-draggable-list-header">
              <Row>
                <div className="c-draggable-list-label col-sm-12">
                  All Images
                </div>
              </Row>
              <Row>
                <div className="c-draggable-list-filter col-sm-12 col-md-6">
                  Subdir:{" "}
                  <select
                    className="u-flex--1"
                    onChange={handleFolderFilter}
                    value={getFolderFilter}
                  >
                    <option value="">-- all --</option>
                    {_.map(folders, (folder) => (
                      <option value={folder}>{folder}</option>
                    ))}
                  </select>
                  <div
                    className="c-draggable-list-filter-clear"
                    onClick={clearFolderFilter}
                  >
                    X
                  </div>
                </div>
                <div className="c-draggable-list-filter col-sm-12 col-md-6">
                  Filter:{" "}
                  <input
                    type="text"
                    onChange={handleFilter}
                    value={getFilter}
                    className="u-flex--1"
                  />
                  <div
                    className="c-draggable-list-filter-clear"
                    onClick={clearFilter}
                  >
                    X
                  </div>
                </div>
              </Row>
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
      </Tab>
      <Tab eventKey="reorder" title="Re-Order">
        <p>This feature not implemented yet</p>
      </Tab>
    </Tabs>
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
