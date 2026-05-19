const createId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const dataModel = {
  users: [
    {
      id: "user-1",
      name: "Default User",
    },
  ],
  boards: [
    {
      id: "board-1",
      name: "Default Board",
      ownerUserId: "user-1",
    },
  ],
  lists: [
    {
      id: "list-1",
      boardId: "board-1",
      name: "To Do",
      taskIds: ["task-1"],
    },
    {
      id: "list-2",
      boardId: "board-1",
      name: "Doing",
      taskIds: [],
    },
    {
      id: "list-3",
      boardId: "board-1",
      name: "Done",
      taskIds: [],
    },
  ],
  tasks: [
    {
      id: "task-1",
      boardId: "board-1",
      listId: "list-1",
      name: "Set up kanban project",
      description: "Create boards, lists, and tasks data model.",
    },
  ],
};

let selectedBoardId = dataModel.boards[0]?.id ?? null;

const boardSelect = document.getElementById("board-select");
const addListForm = document.getElementById("add-list-form");
const addTaskForm = document.getElementById("add-task-form");
const taskListSelect = document.getElementById("task-list-select");
const listsRoot = document.getElementById("lists-root");

const getBoardLists = (boardId) => dataModel.lists.filter((list) => list.boardId === boardId);
const getTaskById = (taskId) => dataModel.tasks.find((task) => task.id === taskId);

const populateBoardSelect = () => {
  boardSelect.innerHTML = "";

  dataModel.boards.forEach((board) => {
    const option = document.createElement("option");
    option.value = board.id;
    option.textContent = board.name;

    if (board.id === selectedBoardId) {
      option.selected = true;
    }

    boardSelect.appendChild(option);
  });
};

const populateTaskListSelect = () => {
  taskListSelect.innerHTML = "";
  const lists = getBoardLists(selectedBoardId);

  lists.forEach((list) => {
    const option = document.createElement("option");
    option.value = list.id;
    option.textContent = list.name;
    taskListSelect.appendChild(option);
  });
};

const moveTask = (taskId, targetListId) => {
  const task = getTaskById(taskId);
  const targetList = dataModel.lists.find((list) => list.id === targetListId);

  if (!task || !targetList || task.boardId !== selectedBoardId || targetList.boardId !== selectedBoardId) {
    return;
  }

  const sourceList = dataModel.lists.find((list) => list.id === task.listId);

  if (sourceList) {
    sourceList.taskIds = sourceList.taskIds.filter((id) => id !== task.id);
  }

  task.listId = targetList.id;
  targetList.taskIds.push(task.id);
};

const renderLists = () => {
  listsRoot.innerHTML = "";
  const lists = getBoardLists(selectedBoardId);

  if (lists.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No lists yet.";
    listsRoot.appendChild(empty);
    return;
  }

  lists.forEach((list) => {
    const listSection = document.createElement("section");
    const listTitle = document.createElement("h3");
    listTitle.textContent = list.name;
    listSection.appendChild(listTitle);

    if (list.taskIds.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "No tasks in this list.";
      listSection.appendChild(empty);
      listsRoot.appendChild(listSection);
      return;
    }

    list.taskIds.forEach((taskId) => {
      const task = getTaskById(taskId);
      if (!task) {
        return;
      }

      const taskCard = document.createElement("article");
      const taskName = document.createElement("h4");
      taskName.textContent = task.name;

      const taskDescription = document.createElement("p");
      taskDescription.textContent = task.description;

      const moveForm = document.createElement("form");
      const moveLabel = document.createElement("label");
      const moveSelect = document.createElement("select");
      const moveButton = document.createElement("button");

      moveLabel.textContent = "Move to list";
      moveLabel.htmlFor = `move-${task.id}`;
      moveSelect.id = `move-${task.id}`;
      moveButton.type = "submit";
      moveButton.textContent = "Move";

      getBoardLists(selectedBoardId).forEach((boardList) => {
        const option = document.createElement("option");
        option.value = boardList.id;
        option.textContent = boardList.name;
        option.selected = boardList.id === task.listId;
        moveSelect.appendChild(option);
      });

      moveForm.addEventListener("submit", (event) => {
        event.preventDefault();
        moveTask(task.id, moveSelect.value);
        renderAll();
      });

      moveForm.appendChild(moveLabel);
      moveForm.appendChild(moveSelect);
      moveForm.appendChild(moveButton);

      taskCard.appendChild(taskName);
      taskCard.appendChild(taskDescription);
      taskCard.appendChild(moveForm);
      listSection.appendChild(taskCard);
    });

    listsRoot.appendChild(listSection);
  });
};

const renderAll = () => {
  populateBoardSelect();
  populateTaskListSelect();
  renderLists();
};

boardSelect.addEventListener("change", (event) => {
  selectedBoardId = event.target.value;
  renderAll();
});

addListForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(addListForm);
  const listName = `${formData.get("listName") || ""}`.trim();

  if (!listName || !selectedBoardId) {
    return;
  }

  dataModel.lists.push({
    id: createId(),
    boardId: selectedBoardId,
    name: listName,
    taskIds: [],
  });

  addListForm.reset();
  renderAll();
});

addTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(addTaskForm);
  const listId = `${formData.get("listId") || ""}`.trim();
  const taskName = `${formData.get("taskName") || ""}`.trim();
  const taskDescription = `${formData.get("taskDescription") || ""}`.trim();

  if (!listId || !taskName || !taskDescription || !selectedBoardId) {
    return;
  }

  const list = dataModel.lists.find(
    (currentList) => currentList.id === listId && currentList.boardId === selectedBoardId,
  );

  if (!list) {
    return;
  }

  const task = {
    id: createId(),
    boardId: selectedBoardId,
    listId,
    name: taskName,
    description: taskDescription,
  };

  dataModel.tasks.push(task);
  list.taskIds.push(task.id);

  addTaskForm.reset();
  renderAll();
});

renderAll();
