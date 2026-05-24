import React, { useState } from "react";
// Note: Use '@hello-pangea/dnd' instead of 'react-beautiful-dnd' for modern React support
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

interface TaskState {
  todo: string[];
  done: string[];
}

export function KanbanBoard() {
  const [columns, setColumns] = useState<TaskState>({
    todo: ["Task 1: Set up project", "Task 2: Design UIComponents"],
    done: ["Task 3: Refactor State Store"],
  });

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Dropped outside of a valid drop zone
    if (!destination) return;

    // Dropped in the exact same spot it started
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumnId = source.droppableId as keyof TaskState;
    const destColumnId = destination.droppableId as keyof TaskState;

    const sourceList = [...columns[sourceColumnId]];
    const destList = [...columns[destColumnId]];

    // Remove item from source
    const [movedItem] = sourceList.splice(source.index, 1);

    if (sourceColumnId === destColumnId) {
      // Scenario A: Reordering within the same list
      sourceList.splice(destination.index, 0, movedItem);
      setColumns({
        ...columns,
        [sourceColumnId]: sourceList,
      });
    } else {
      // Scenario B: Moving to a different list
      destList.splice(destination.index, 0, movedItem);
      setColumns({
        ...columns,
        [sourceColumnId]: sourceList,
        [destColumnId]: destList,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
        {(Object.keys(columns) as Array<keyof TaskState>).map((columnId) => (
          <div
            key={columnId}
            style={{
              background: "#f4f5f7",
              padding: "16px",
              width: "250px",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ textTransform: "capitalize", marginTop: 0 }}>
              {columnId}
            </h3>

            <Droppable droppableId={columnId}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    background: snapshot.isDraggingOver
                      ? "#e2e4e6"
                      : "transparent",
                    padding: "4px",
                    minHeight: "200px",
                    transition: "background 0.2s ease",
                  }}
                >
                  {columns[columnId].map((item, index) => (
                    // The draggableId must be a completely unique string across the entire context
                    <Draggable key={item} draggableId={item} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            userSelect: "none",
                            padding: "16px",
                            margin: "0 0 8px 0",
                            borderRadius: "4px",
                            background: snapshot.isDragging
                              ? "#263B4E"
                              : "#ffffff",
                            color: snapshot.isDragging ? "#white" : "#333333",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                            ...provided.draggableProps.style, // Crucial to preserve library positioning math
                          }}
                        >
                          {item}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {/* The placeholder reserves the layout space while an item is being dragged out */}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
