const input = document.getElementById("task");
const add = document.getElementById("add");
const ul = document.getElementById("todo-list");
const searchInput = document.getElementById("search");

// Fonction pour mettre à jour la progression
function updateProgress(showMessage = true) {
  const tasks = ul.querySelectorAll("li");
  const total = tasks.length;
  const completed = [...tasks].filter(task => {
    const checkbox = task.querySelector("input[type='checkbox']");
    return checkbox && checkbox.checked;
  }).length;

  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");
  const overlay = document.getElementById("completion-overlay");

  progressBar.style.width = `${percent}%`;
  progressText.textContent = `${percent}% completed`;

  if (showMessage) {
    if (percent === 100 && total > 0) {
      overlay.classList.add("active");
      setTimeout(() => {
        overlay.classList.remove("active");
      }, 4000);
    } else {
      overlay.classList.remove("active");
    }
  } else {
    overlay.classList.remove("active");
  }
}

// Sauvegarder les tâches dans localStorage
function saveTasks() {
  const tasks = [];
  ul.querySelectorAll("li").forEach(li => {
    const checkbox = li.querySelector("input[type='checkbox']");
    const span = li.querySelector("span");
    tasks.push({
      text: span.textContent,
      checked: checkbox.checked
    });
  });
  localStorage.setItem("todoList", JSON.stringify(tasks));
}

// Charger les tâches au chargement de la page
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("todoList")) || [];
  tasks.forEach(task => {
    createTask(task.text, task.checked);
  });
  updateProgress(false);
}

// Créer une tâche (utilisée pour charger et ajouter)
function createTask(text, checked = false) {
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = checked;

  const span = document.createElement("span");
  span.textContent = text;
  
  // Supprimer

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", () => {
    li.remove();
    updateProgress(false);
    saveTasks();
  });

  // Modifier
  span.addEventListener("dblclick", () => {
    const input2 = document.createElement("input");
    input2.type = "text";
    input2.value = span.textContent;
    li.replaceChild(input2, span);
    input2.focus();

    input2.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        span.textContent = input2.value.trim() || span.textContent;
        li.replaceChild(span, input2);
        saveTasks();
      }
    });
  });

  // Cocher/décocher
  checkbox.addEventListener("change", () => {
    li.classList.toggle("checked", checkbox.checked);
    updateProgress();
    saveTasks();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);
  ul.appendChild(li);
}

// Charger les tâches à l'ouverture
window.addEventListener("load", loadTasks);

// Ajouter une tâche
add.addEventListener("click", () => {
  if (input.value.trim() !== '') {
    createTask(input.value.trim(), false);
    input.value = '';
    updateProgress();
    saveTasks();
  }
});

// Ajouter avec "Entrée"
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    add.click();
  }
});

// Recherche
searchInput.addEventListener("keyup", () => {
  const term = searchInput.value.trim().toLowerCase();
  const items = ul.querySelectorAll("li");

  items.forEach(item => {
    const text = item.querySelector("span").textContent.toLowerCase();
    item.style.display = text.includes(term) ? '' : 'none';
  });
});

// Filtres
document.getElementById("toutes").addEventListener("click", () => {
  ul.querySelectorAll("li").forEach(item => {
    item.style.display = '';
  });
});

document.getElementById("en-cours").addEventListener("click", () => {
  ul.querySelectorAll("li").forEach(item => {
    const checkbox = item.querySelector("input[type='checkbox']");
    item.style.display = checkbox && !checkbox.checked ? '' : 'none';
  });
});

document.getElementById("termine").addEventListener("click", () => {
  ul.querySelectorAll("li").forEach(item => {
    const checkbox = item.querySelector("input[type='checkbox']");
    item.style.display = checkbox && checkbox.checked ? '' : 'none';
  });
});

// Boutons actifs
const buttons = {
  all: document.getElementById("toutes"),
  inProgress: document.getElementById("en-cours"),
  completed: document.getElementById("termine"),
};

let currentFilter = "all";

function applyFilter() {
  const items = ul.querySelectorAll("li");
  items.forEach((item) => {
    const checkbox = item.querySelector("input[type='checkbox']");
    switch (currentFilter) {
      case "all":
        item.style.display = "";
        break;
      case "inProgress":
        item.style.display = checkbox && !checkbox.checked ? "" : "none";
        break;
      case "completed":
        item.style.display = checkbox && checkbox.checked ? "" : "none";
        break;
    }
  });
}

function setActiveButton(buttonKey) {
  Object.keys(buttons).forEach((key) => {
    buttons[key].classList.toggle("active", key === buttonKey);
  });
}

buttons.all.addEventListener("click", () => {
  currentFilter = "all";
  setActiveButton("all");
  applyFilter();
});

buttons.inProgress.addEventListener("click", () => {
  currentFilter = "inProgress";
  setActiveButton("inProgress");
  applyFilter();
});

buttons.completed.addEventListener("click", () => {
  currentFilter = "completed";
  setActiveButton("completed");
  applyFilter();
});