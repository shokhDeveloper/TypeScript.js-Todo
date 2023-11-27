let elTodosFilterbox = document.querySelector(".hero_todos__filter") as HTMLDivElement;
let elTodoList = document.querySelector(".hero_todos__list") as HTMLUListElement;
let elTemplate: HTMLTemplateElement | null = document.querySelector("template")
let elInput: HTMLInputElement | null = document.querySelector(".hero__input");
let todosLocals: string | null = getItem("todos");
let todos: any[] = todosLocals ? JSON.parse(todosLocals) : [];
interface todo {
    name: string;
    id: string;
    isComplate: boolean;
}
type todoID = {
    id: string | null,
    idx: number | null
}
interface jsonType extends Array<todo> {}

let uuid = generateId;
const handleFilterBox = (arr: jsonType) :void =>  {
    if(arr?.length){
        elTodosFilterbox.classList.remove("d-none")
    }else{
        elTodosFilterbox.classList.add("d-none")   
    }
}
const handleError = (errorText:string) :void => {
   let errorElement = document.createElement("h3") as HTMLHeadingElement;
   errorElement.textContent = errorText
   errorElement.classList.add("text-danger")
   elTodoList.appendChild(errorElement)
}
const handleRenderTodo = (arr: jsonType): void => {
  if (arr?.length) {
    handleFilterBox(arr)
    if(elTemplate){
        elTodoList.innerHTML = ''
        console.log(arr)
        let templateContent = elTemplate.content as DocumentFragment
        for (let i: number = 0; i < arr.length; i++) {
            let clone  = templateContent.cloneNode(true) as DocumentFragment
            let todo = clone.querySelector(".todo") as HTMLLIElement
            if(todo !== null && arr[i].id !== null){
                todo.dataset.id = arr[i].id
            }
            let todoName = clone.querySelector(".todo__name") as HTMLHeadingElement
            if(todoName !== null){
                todoName.textContent = arr[i].name
            }
            let elCheck = clone.querySelector(".todo__check") as HTMLInputElement
            if(elCheck !==  null && arr[i].isComplate ===false || arr[i].isComplate === true){
                elCheck.checked = arr[i].isComplate
            }
            elTodoList.appendChild(clone)
        }
    }
  }else {
    handleFilterBox(todos)
    elTodoList.innerHTML = ''
    handleError("No such todos exist")
}
};
function handleKey(event: KeyboardEvent):void {
  if (event.key === "Enter") {
    let value = (event.target as HTMLInputElement).value;
    let todo: todo = {
      name: value,
      id: uuid(),
      isComplate: false,
    };
    todos = [...todos, todo];
    setItem("todos", todos)
    if(elInput){
        elInput.value = ''
    }
    handleRenderTodo(todos);
  }
}
const handelReturnId = (element: HTMLElement ) :todoID  => {
    let elParentLi:HTMLLIElement | null  = element.closest("li")
    if(elParentLi){
        let id:string | undefined = elParentLi.dataset.id?.toString() || ""
        let idx:number = todos.findIndex((item:todo) => item.id === id)
        return {
            id: id,
            idx
        }
    } else{
        return{
            id: null,
            idx: null
        }
    }
}
const handleClick = (event: Event) :void => {
    let element = (event.target as HTMLElement)
    if(element.matches(".delete__todo")){
        let {id, idx} :todoID = handelReturnId(element)
        if(id !== null && idx !==  null){
            todos.splice(idx, 1)
            console.log(idx)
            handleRenderTodo(todos)
            setItem("todos", todos)
        }
    }else if(element.matches(".edit__todo")){
        let {id, idx} = handelReturnId(element)
        if(id !== null && idx !== null){
            let value:string | null = prompt("Edit-todo !", todos[idx].name)
            todos[idx].name = value
            handleRenderTodo(todos)
            setItem("todos", todos)
        }
    }else if(element.matches(".all__todos")){
        handleRenderTodo(todos)
    }else if(element.matches(".all__complated")){
        let filter:jsonType = todos.filter((item:todo) => item.isComplate === true )
        handleRenderTodo(filter)
    }else if(element.matches(".all__notComplated")){
        let filter:jsonType = todos.filter((item:todo) => item.isComplate === false )
        handleRenderTodo(filter)    
    }
}
const handleChange = (event: Event) :void => {
    let element = (event.target as HTMLElement)
    if(element.matches(".todo__check")){
        let elCheck = (element as HTMLInputElement)
            let {id, idx} = handelReturnId(elCheck) 
            if(id !== null && idx !== null){
                todos[idx].isComplate = elCheck.checked
                handleRenderTodo(todos)
                setItem("todos", todos)
            }
    }
}
window.addEventListener("click", handleClick)
window.addEventListener("change", handleChange)
elInput?.addEventListener("keyup", handleKey);
handleRenderTodo(todos)