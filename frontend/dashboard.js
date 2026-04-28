const TASK_URL = "http://localhost:3000/api/tasks";
const token = localStorage.getItem("planner_token");

/* =========================
   FETCH ALL TASKS
========================= */
async function fetchTasks() {
  try {
    const response = await fetch(`${TASK_URL}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const tasks = await response.json();

    if (response.ok) {
      renderTasks(tasks);
      updateDashboard(tasks);
      smartSuggestions(tasks);
    } else {
      alert(tasks.message || "Failed to fetch tasks");
    }

  } catch (error) {
    console.error("Fetch task error:", error);
  }
}

/* =========================
   COUNTDOWN LOGIC
========================= */
function getCountdown(deadline) {
  const now = new Date();
  const dueDate = new Date(deadline);
  const diff = dueDate - now;

  if (diff < 0) {
    const hoursLate = Math.floor(Math.abs(diff) / (1000 * 60 * 60));

    return {
      text: `Overdue by ${hoursLate} hour(s)`,
      className: "text-danger"
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  if (days >= 2) {
    return {
      text: `Due in ${days} day(s)`,
      className: "text-success"
    };
  }

  if (days < 2 && hours > 0) {
    return {
      text: `Due in ${hours} hour(s)`,
      className: "text-warning"
    };
  }

  return {
    text: "Urgent",
    className: "text-danger"
  };
}

/* =========================
   RENDER TASKS
========================= */
function renderTasks(tasks) {
  const taskList = document.getElementById("taskList");

  taskList.innerHTML = "";

  tasks.forEach(task => {
    const countdown = getCountdown(task.deadline);

    taskList.innerHTML += `
      <div class="card mb-3 p-3">
        <h4>${task.title}</h4>
        <p>${task.description || ""}</p>
        <p><strong>Priority:</strong> ${task.priority}</p>
        <p class="${countdown.className}">
          <strong>${countdown.text}</strong>
        </p>
      </div>
    `;
  });
}

/* =========================
   DASHBOARD STATS
========================= */
function updateDashboard(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;
  const completionRate = total
    ? Math.round((completed / total) * 100)
    : 0;

  document.getElementById("totalTasks").innerText = total;
  document.getElementById("completedTasks").innerText = completed;
  document.getElementById("pendingTasks").innerText = pending;
  document.getElementById("completionRate").innerText =
    `${completionRate}%`;
}

/* =========================
   SMART SUGGESTIONS
========================= */
function smartSuggestions(tasks) {
  const suggestionBox = document.getElementById("suggestions");

  const pending = tasks.filter(task => !task.completed).length;

  if (pending >= 5) {
    suggestionBox.innerText =
      "You have many pending tasks this week. Prioritize urgent ones.";
  } else if (pending === 0) {
    suggestionBox.innerText =
      "Excellent work! You have completed all tasks.";
  } else {
    suggestionBox.innerText =
      "You are making progress. Stay consistent.";
  }
}



/* =========================
   ADD NEW TASK
========================= */
document.getElementById("taskForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const taskData = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      priority: document.getElementById("priority").value,
      deadline: document.getElementById("deadline").value,
      visibility: "private"
    };

    try {
      const response = await fetch(`${TASK_URL}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Task created successfully!");

        document.getElementById("taskForm").reset();

        fetchTasks(); // refresh dashboard
      } else {
        alert(data.message || "Failed to create task");
      }

    } catch (error) {
      console.error("Add task error:", error);
    }
});
/* =========================
   LOGOUT
========================= */
function logoutUser() {
  localStorage.removeItem("planner_token");
  window.location.href = "index.html";
}

/* =========================
   AUTO LOAD
========================= */
fetchTasks();