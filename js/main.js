const getTodoList = async () => {
    try {
        const response = await fetch('http://localhost:3000/');
        const data = await response.json();
        data.map(todo => makeTodo(todo));
        let itemsCount = data.filter(todo => todo.status === 'false').length;
        document.querySelector('.items-left').textContent = `${itemsCount} items left`;
        mainId = data.length > 0 ? data[0].id + 1 : 1;
    } catch (error) {
        console.log(error);
    }
}

const makeTodo = (todo) => {
    let state =  Array.from(document.querySelectorAll('.change-todos-button')).filter(button => button.classList.contains('activeState'))
    let newTodo = makeNewTodo(todo.id, todo.name,todo.status, state[0].classList[1],'base');
}

getTodoList();

const itemsLeft = document.querySelector('.items-left');

// Changing Color Themes
let theme = "light";
const changeLightButton = document.querySelector('.change-light');
changeLightButton.addEventListener('click', () => {
    if(theme === 'light'){
        document.documentElement.style.setProperty('--veryLightGray', '#161722')
        document.documentElement.style.setProperty('--theme-image', 'url(../images/icon-sun.svg)')
        document.documentElement.style.setProperty('--bg-image', 'url(../images/bg-desktop-dark.jpg)')
        document.documentElement.style.setProperty('--veryLightGrayishBlue', '#25273c')
        document.documentElement.style.setProperty('--lightGrayishBlue', '#4D5067')
        document.documentElement.style.setProperty('--darkGrayishBlue', '#777a92')
        document.documentElement.style.setProperty('--veryDarkGrayishBlue', '#C8CBE7')
        document.documentElement.style.setProperty('--bgWhite', '#25273D')
        document.documentElement.style.setProperty('--boxShadow', 'rgba(0, 0, 0, 0.5)')
        theme = 'dark';
    }else{
        document.documentElement.style.setProperty('--veryLightGray', '#fafafa')
        document.documentElement.style.setProperty('--theme-image', 'url(../images/icon-moon.svg)')
        document.documentElement.style.setProperty('--bg-image', 'url(../images/bg-desktop-light.jpg)')
        document.documentElement.style.setProperty('--veryLightGrayishBlue', '#e4e5f1')
        document.documentElement.style.setProperty('--lightGrayishBlue', '#d2d3db')
        document.documentElement.style.setProperty('--darkGrayishBlue', '#9394a5')
        document.documentElement.style.setProperty('--veryDarkGrayishBlue', '#484b6a')
        document.documentElement.style.setProperty('--bgWhite', '#FFFFFF')
        document.documentElement.style.setProperty('--boxShadow', 'rgba(194, 195, 214, 0.5)')
        theme = 'light';
    }
})

// Adding active class to Check button
const checkButton = document.querySelector('.check')
checkButton.addEventListener('click', () => checkButton.classList.toggle('active'))

// Creating new todo input that can make todo task both completed and active
const newTodoInput = document.querySelector('#create-todo-input');
newTodoInput.addEventListener('keypress', async (event) => {
    if(event.key === 'Enter' && newTodoInput.value.length > 0){
        completed = document.querySelector('.newTodoCheck').checked;
        let state =  Array.from(document.querySelectorAll('.change-todos-button')).filter(button => button.classList.contains('activeState'))
        const response = await fetch('http://localhost:3000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: newTodoInput.value,
                status: completed,
            })
        })
        const data = await response.json();
        makeNewTodo(data[0].id, newTodoInput.value, completed, state[0].classList[1], 'enter');
        newTodoInput.value = '';
        document.querySelector('.newTodoCheck').checked = false
        appearAll();
        appearActive()
        appearCompleted();
        clearCompleted();
        activeParent();
        changeItemsLeft();
    }
})

// Global function of making new todo task
makeNewTodo = (id = null, text, completed, state, where) => {
    const todoList = document.querySelector('.todos-list');
    inputId = '0' + id;
    let todo = `
        <li id='${id === null ? uid : id}' class="todo-item ${completed === 'true' && where === 'base' ? 'completed' : completed && where === 'enter' ? 'completed' : ''}" draggable="true" style="display:${state === 'all' ? 'flex' : state === 'active' && !completed ? 'flex' : completed && state === 'completed' ? 'flex' : 'none'}">
            <input id='${inputId}' onclick="toggleCompleted(this)" class="check" type="checkbox" ${completed === 'true' && where === 'base' ? 'checked' : completed && where === 'enter' ? 'checked' : ''}>
            <label class="todo-item-text" for="${inputId}">${text}</label>
            <img class='delete-todo' onclick="deleteTodo(this)" src='./images/icon-cross.svg' alt='Delete Button'>
        </li>
    `
    todoList.insertAdjacentHTML(`${where === 'base' ? 'beforeend' : 'afterbegin'}`, todo);
}

// Deleting todo task function Listener
deleteTodo = (element) => {
    deletedId = +element.parentElement.id;
    fetch(`http://localhost:3000/${deletedId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    element.parentElement.remove();
    changeItemsLeft();
}

// Filter todos and appear all of them
appearAll = () => {
    const todos = document.querySelectorAll('.todo-item');
    const allButton = document.querySelectorAll('.all');
    allButton.forEach(n => n.removeEventListener('click', appearAllListener))
    allButton.forEach(n => n.addEventListener('click', appearAllListener))
}

// Filter todos and appear all of them
appearActive = () => {
    const todos = document.querySelectorAll('.todo-item');
    const activeButton = document.querySelectorAll('.change-todos-button.active');
    activeButton.forEach(n => n.removeEventListener('click', appearActiveListener))
    activeButton.forEach(n => n.addEventListener('click', appearActiveListener))
}

appearCompleted = () => {
    const todos = document.querySelectorAll('.todo-item');
    const activeButton = document.querySelectorAll('.change-todos-button.completed');
    activeButton.forEach(n => n.removeEventListener('click', appearCompletedListener))
    activeButton.forEach(n => n.addEventListener('click', appearCompletedListener))
}

clearCompleted = () => {
    const todos = document.querySelectorAll('.todo-item');
    const clearCompleted = document.querySelector('.clear-completed');
    clearCompleted.removeEventListener('click', clearCompletedListener);
    clearCompleted.addEventListener('click', clearCompletedListener);
    
}

const activeParent = () => {
    const buttons = document.querySelectorAll('.check')

    buttons.forEach(button => button.removeEventListener('change', activeParentListener));
    buttons.forEach(button => button.addEventListener('change', activeParentListener));
}


// Filter todos appear all function Listener
const appearAllListener = (event) => {
    const todos = document.querySelectorAll('.todo-item');
    Array.from(todos).map(todo => todo.style.display = 'flex');
    document.querySelectorAll('.change-todos-button').forEach(button => button.classList.remove('activeState'))
    document.querySelectorAll(`.${event?.target.classList[1]}`).forEach(button => button.classList.add('activeState'))
}

// Filter todos appear active function Listener
const appearActiveListener = (event) => {
    const todos = document.querySelectorAll('.todo-item');
    Array.from(todos).map(todo => {
        todo.classList.contains('completed') ? todo.style.display = 'none' : todo.style.display = 'flex'
    });
    document.querySelectorAll('.change-todos-button').forEach(button => button.classList.remove('activeState'))
    document.querySelectorAll(`.${event?.target.classList[1]}`).forEach(button => button.classList.add('activeState'))

}

// Filter todos appear active function Listener
const appearCompletedListener = (event) => {
    const todos = document.querySelectorAll('.todo-item');
    Array.from(todos).map(todo => {
        todo.classList.contains('completed') ? todo.style.display = 'flex' : todo.style.display = 'none';
    });
    document.querySelectorAll('.change-todos-button').forEach(button => button.classList.remove('activeState'))
    document.querySelectorAll(`.change-todos-button.${event.target.classList[1]}`).forEach(button => button.classList.add('activeState'))
}

const clearCompletedListener = (event) => {
    const todos = document.querySelectorAll('.todo-item.completed');
    let ids = [];
    Array.from(todos).map(todo => {
        ids.push(+todo.id);
        todo.remove();
    });
    ids.forEach(id => {
        fetch(`http://localhost:3000/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
    }) 
}

const activeParentListener = () => {
    const buttons = document.querySelectorAll('.check')
    Array.from(buttons).map(button => {
        if(button.checked){
            button.parentElement.classList.add('completed')
        }else {
            button.parentElement.classList.remove('completed')
        }
        // document.querySelectorAll('.change-todos-button').forEach(button => button.classList.remove('activeState'))
        
    })
}

const toggleCompleted = (element) => {
    let state =  Array.from(document.querySelectorAll('.change-todos-button')).filter(button => button.classList.contains('activeState'))
    state = state[0].classList[1]
    element.parentElement.classList.toggle('completed');
    if(state === 'active' || state === 'completed'){
        element.parentElement.style.display = 'none';
    }
    let todo = {
        name: element.parentElement.querySelector('.todo-item-text').textContent,
        status: element.parentElement.classList.contains('completed'),
    }
    fetch(`http://localhost:3000/${element.parentElement.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
    })
    changeItemsLeft();
}

const changeItemsLeft = () => {
    let itemsCount = Array.from(document.querySelectorAll('.todo-item'));
    const activeItemsCount = itemsCount.filter(item => !item.classList.contains('completed')).length;
    document.querySelector('.items-left').textContent = `${activeItemsCount} items left`;
}

appearActive();
appearAll();
appearCompleted();
clearCompleted();
activeParent();


