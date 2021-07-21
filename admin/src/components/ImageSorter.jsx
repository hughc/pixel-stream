import React, {useState} from "react";
import { DndContext } from "@dnd-kit/core";

import { Draggable } from "./Draggable.jsx";
import { Droppable } from "./Droppable.jsx";

export function ImageSorter() {
    const [isDropped, setIsDropped] = useState(false);
    const draggableMarkup = <Draggable>Drag me</Draggable>

    return (
      <DndContext onDragEnd={handleDragEnd}>
        {!isDropped ? draggableMarkup : null}
        <Droppable className='drop-zone'>{isDropped ? draggableMarkup : "Drop here"}</Droppable>
      </DndContext>
    );

    function handleDragEnd(event) {
      if (event.over && event.over.id === "droppable") {
        setIsDropped(true);
      }
    }
}
