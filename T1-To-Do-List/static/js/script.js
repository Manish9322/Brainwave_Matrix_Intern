function toggleTaskStatus(taskId) {
  const taskText = document.getElementById(`taskText-${taskId}`);
  const checkbox = document.getElementById(`checkbox-${taskId}`);

  taskText.classList.toggle("line-through");
  checkbox.checked = !checkbox.checked;
}

document
  .getElementById("taskForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const taskInput = document.getElementById("taskInput");
    const taskValue = taskInput.value;

    if (taskValue.trim() !== "") {
      const formData = new FormData();
      formData.append("task", taskValue);

      fetch("/add_task", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.text())
        .then((data) => {
          console.log("Task added:", data);
          addTaskToList(taskValue, data);
          taskInput.value = "";
        })
        .catch((error) => {
          console.error("Error adding task:", error);
        });
    }
  });

function addTaskToList(taskValue, taskId) {
  const taskList = document.getElementById("taskList");
  const newTask = document.createElement("li");
  newTask.id = `task-${taskId}`;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `checkbox-${taskId}`;

  const taskText = document.createElement("p");
  taskText.textContent = taskValue;
  taskText.id = `taskText-${taskId}`;

  const deleteForm = document.createElement("form");
  deleteForm.method = "post";
  deleteForm.action = "/delete_task";
  deleteForm.style.display = "inline";

  const hiddenInput = document.createElement("input");
  hiddenInput.type = "hidden";
  hiddenInput.name = "task_id";
  hiddenInput.value = taskId;

  const deleteButton = document.createElement("button");
  deleteButton.type = "submit";
  deleteButton.textContent = "Delete";

  deleteForm.appendChild(hiddenInput);
  deleteForm.appendChild(deleteButton);

  newTask.appendChild(checkbox);
  newTask.appendChild(taskText);
  newTask.appendChild(deleteForm);

  taskText.onclick = function () {
    toggleTaskStatus(taskId);
  };

  taskList.insertBefore(newTask, taskList.firstChild);
}

document.querySelectorAll("#taskList li").forEach(function (taskItem) {
  const taskId = taskItem.id.split("-")[1];
  const taskText = taskItem.querySelector("p");
  taskText.addEventListener("click", function () {
    toggleTaskStatus(taskId);
  });
});
