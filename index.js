"use strict";
let elTodosFilterbox = document.querySelector(".hero_todos__filter");
let elTodoList = document.querySelector(".hero_todos__list");
let elTemplate = document.querySelector("template");
let elInput = document.querySelector(".hero__input");
let todosLocals = getItem("todos");
let todos = todosLocals ? JSON.parse(todosLocals) : [];
let uuid = generateId;
const handleFilterBox = (arr) => {
    if (arr === null || arr === void 0 ? void 0 : arr.length) {
        elTodosFilterbox.classList.remove("d-none");
    }
    else {
        elTodosFilterbox.classList.add("d-none");
    }
};
const handleError = (errorText) => {
    let errorElement = document.createElement("h3");
    errorElement.textContent = errorText;
    errorElement.classList.add("text-danger");
    elTodoList.appendChild(errorElement);
};
const handleRenderTodo = (arr) => {
    if (arr === null || arr === void 0 ? void 0 : arr.length) {
        handleFilterBox(arr);
        if (elTemplate) {
            elTodoList.innerHTML = '';
            console.log(arr);
            let templateContent = elTemplate.content;
            for (let i = 0; i < arr.length; i++) {
                let clone = templateContent.cloneNode(true);
                let todo = clone.querySelector(".todo");
                if (todo !== null && arr[i].id !== null) {
                    todo.dataset.id = arr[i].id;
                }
                let todoName = clone.querySelector(".todo__name");
                if (todoName !== null) {
                    todoName.textContent = arr[i].name;
                }
                let elCheck = clone.querySelector(".todo__check");
                if (elCheck !== null && arr[i].isComplate === false || arr[i].isComplate === true) {
                    elCheck.checked = arr[i].isComplate;
                }
                elTodoList.appendChild(clone);
            }
        }
    }
    else {
        handleFilterBox(todos);
        elTodoList.innerHTML = '';
        handleError("No such todos exist");
    }
};
function handleKey(event) {
    if (event.key === "Enter") {
        let value = event.target.value;
        let todo = {
            name: value,
            id: uuid(),
            isComplate: false,
        };
        todos = [...todos, todo];
        setItem("todos", todos);
        if (elInput) {
            elInput.value = '';
        }
        handleRenderTodo(todos);
    }
}
const handelReturnId = (element) => {
    var _a;
    let elParentLi = element.closest("li");
    if (elParentLi) {
        let id = ((_a = elParentLi.dataset.id) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        let idx = todos.findIndex((item) => item.id === id);
        return {
            id: id,
            idx
        };
    }
    else {
        return {
            id: null,
            idx: null
        };
    }
};
const handleClick = (event) => {
    let element = event.target;
    if (element.matches(".delete__todo")) {
        let { id, idx } = handelReturnId(element);
        if (id !== null && idx !== null) {
            todos.splice(idx, 1);
            console.log(idx);
            handleRenderTodo(todos);
            setItem("todos", todos);
        }
    }
    else if (element.matches(".edit__todo")) {
        let { id, idx } = handelReturnId(element);
        if (id !== null && idx !== null) {
            let value = prompt("Edit-todo !", todos[idx].name);
            todos[idx].name = value;
            handleRenderTodo(todos);
            setItem("todos", todos);
        }
    }
    else if (element.matches(".all__todos")) {
        handleRenderTodo(todos);
    }
    else if (element.matches(".all__complated")) {
        let filter = todos.filter((item) => item.isComplate === true);
        handleRenderTodo(filter);
    }
    else if (element.matches(".all__notComplated")) {
        let filter = todos.filter((item) => item.isComplate === false);
        handleRenderTodo(filter);
    }
};
const handleChange = (event) => {
    let element = event.target;
    if (element.matches(".todo__check")) {
        let elCheck = element;
        let { id, idx } = handelReturnId(elCheck);
        if (id !== null && idx !== null) {
            todos[idx].isComplate = elCheck.checked;
            handleRenderTodo(todos);
            setItem("todos", todos);
        }
    }
};
window.addEventListener("click", handleClick);
window.addEventListener("change", handleChange);
elInput === null || elInput === void 0 ? void 0 : elInput.addEventListener("keyup", handleKey);
handleRenderTodo(todos);
