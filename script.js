// Save todo to localStorage and return its ID
function saveTodoToLocal(taskText, completed = false) {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  const newTodo = {
    id: Date.now(), // unique ID
    text: taskText,
    completed
  };
  todos.push(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
  return newTodo.id; // ✅ return the ID
}

// Remove todo from localStorage using ID
function removeTodoFromLocal(id) {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos = todos.filter(todo => todo.id !== id);
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Toggle todo completion in localStorage using ID
function toggleTodoInLocal(id) {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  const todo = todos.find(todo => todo.id === id);
  if (todo) todo.completed = !todo.completed;
  localStorage.setItem("todos", JSON.stringify(todos));
}

const todoInput = document.querySelector("[data-todo-input]");
const todoForm = document.querySelector("[data-todo-form]");
const activeTaskSection = document.querySelector("[data-active-task] [data-listed-task]");
const completedTaskSection = document.querySelector("[data-completed-task] [data-checked-task]");

function createTaskElement(taskText, completed = false, id = Date.now()) {
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  todoDiv.dataset.id = id; // attach ID to DOM

  const todoLi = document.createElement("li");
  todoLi.innerText = taskText;
  todoLi.classList.add("todo-item");
  todoDiv.appendChild(todoLi);

  const buttonsDiv = document.createElement("div");
  buttonsDiv.classList.add("todo-buttons");

  const completeBtn = document.createElement("button");
  completeBtn.innerHTML = "✓";
  completeBtn.classList.add("complete-btn");
  buttonsDiv.appendChild(completeBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "✗";
  deleteBtn.classList.add("trash-btn");
  buttonsDiv.appendChild(deleteBtn);

  todoDiv.appendChild(buttonsDiv);

  if (completed) {
    completedTaskSection.appendChild(todoDiv);
  } else {
    activeTaskSection.appendChild(todoDiv);
  }
}

// Load todos on page load
document.addEventListener("DOMContentLoaded", () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.forEach(todo => createTaskElement(todo.text, todo.completed, todo.id));
});

// Add new task
todoForm.addEventListener("submit", e => {
  e.preventDefault();
  const taskText = todoInput.value.trim();
  if (!taskText) return;

  const taskId = saveTodoToLocal(taskText); // save and get unique ID
  createTaskElement(taskText, false, taskId);
  todoInput.value = "";
});

// Handle complete & delete buttons (event delegation)
[activeTaskSection, completedTaskSection].forEach(section => {
  section.addEventListener("click", e => {
    const target = e.target;
    const todoDiv = target.closest(".todo");
    if (!todoDiv) return;

    const id = Number(todoDiv.dataset.id);

    // Delete
    if (target.classList.contains("trash-btn")) {
      todoDiv.remove();
      removeTodoFromLocal(id);
    }

    // Complete toggle
    if (target.classList.contains("complete-btn")) {
      const isActive = todoDiv.parentElement === activeTaskSection;
      if (isActive) {
        completedTaskSection.appendChild(todoDiv);
      } else {
        activeTaskSection.appendChild(todoDiv);
      }
      todoDiv.classList.toggle("completed");
      toggleTodoInLocal(id);
    }
  });
});
