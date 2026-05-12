const theme = document.getElementById("theme");
const icon = document.getElementById("icon");

const input = document.querySelector(".todo-input input");
const addBtn = document.querySelector(".add-btn");

const todoList = document.querySelector(".todo ul");
const completedList = document.querySelector(".finished ul");

loadTasks();
loadTheme();

theme.addEventListener("change", () => {

    if(theme.checked){

        icon.src = "images/white.ico";

        document.querySelectorAll(".delete").forEach((btn) => {
            btn.src = "images/deleteW.svg";
        });

        localStorage.setItem("theme", "dark");

    } else {

        icon.src = "images/black.svg";

        document.querySelectorAll(".delete").forEach((btn) => {
            btn.src = "images/delete.svg";
        });

        localStorage.setItem("theme", "light");

    }

});

function createTask(text, completed = false){

    const li = document.createElement("li");

    li.innerHTML = `
        <div class="task">
            <img class="check" src="${completed ? "images/tick.svg" : "images/circle.svg"}" width="18" height="18" alt="">
            <p>${text}</p>
        </div>

        <img class="delete" src="${theme.checked ? "images/deleteW.svg" : "images/delete.svg"}" width="20" height="20" alt="">
    `;

    if(completed){
        li.classList.add("completed");
        completedList.appendChild(li);
    } else {
        todoList.appendChild(li);
    }

    const checkBtn = li.querySelector(".check");
    const deleteBtn = li.querySelector(".delete");

    checkBtn.addEventListener("click", () => {

        if(li.classList.contains("completed")){

            li.classList.remove("completed");

            checkBtn.src = "images/circle.svg";

            todoList.appendChild(li);

        } else {

            li.classList.add("completed");

            checkBtn.src = "images/tick.svg";

            completedList.appendChild(li);

        }

        saveTasks();

    });

    deleteBtn.addEventListener("click", () => {

        li.remove();

        saveTasks();

    });

    saveTasks();

}

addBtn.addEventListener("click", () => {

    const text = input.value.trim();

    if(text === ""){
        return;
    }

    createTask(text);

    input.value = "";

});

input.addEventListener("keydown", (e) => {

    if(e.key === "Enter"){

        const text = input.value.trim();

        if(text === ""){
            return;
        }

        createTask(text);

        input.value = "";

    }

});

function saveTasks(){

    const tasks = [];

    document.querySelectorAll(".todo li, .finished li").forEach((li) => {

        tasks.push({
            text: li.querySelector("p").textContent,
            completed: li.classList.contains("completed")
        });

    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

function loadTasks(){

    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    todoList.innerHTML = "";
    completedList.innerHTML = "";

    savedTasks.forEach((task) => {
        createTask(task.text, task.completed);
    });

}

function loadTheme(){

    const savedTheme = localStorage.getItem("theme");

    if(savedTheme === "dark"){

        theme.checked = true;

        icon.src = "images/white.ico";

    } else {

        theme.checked = false;

        icon.src = "images/black.svg";

    }

}



if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js");
}

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();

    deferredPrompt = e;

    document.querySelector(".install-btn").style.display = "block";
});

document.querySelector(".install-btn").addEventListener("click", async () => {

    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const result = await deferredPrompt.userChoice;

    console.log(result.outcome);

    deferredPrompt = null;
});