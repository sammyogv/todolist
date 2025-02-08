
// DOM Elements
const newTodo = document.getElementById('new-todo');
const section1 = document.getElementById('section1');
const theme = document.getElementById('theme');
const inputContainer = document.getElementById('input-container');
const all = document.querySelector('.all');
const active = document.querySelector('.active');
const completed = document.querySelector('.completed');
const itemsLeft = document.getElementById('itemsLeft');
const clearing = document.getElementById('clear');

// Theme state and tab state
let themeLight = false;
let activeTab = 'all';

// Utility Functions
const updateTheme = () => {
  const lightThemeStyles = {
    backgroundColor: 'hsl(236, 33%, 92%)',
    backgroundImage: 'url(images/bg-desktop-light.jpg)',
    headerColor: 'hsl(235, 100%, 97.8%)',
    inputBackground: 'hsl(0, 0%, 98%)',
    inputColor: 'hsl(240, 7.3%, 8%)',
    todoBackground: 'hsl(0, 0%, 98%)',
    todolistcolor: 'hsl(235, 19%, 35%)',
    todolisthovercolor: 'hsl(235, 93.40%, 12.00%)',
    border: '1px solid hsl(0, 0.00%, 83.10%)',
  };

  const darkThemeStyles = {
    backgroundColor: 'hsl(0, 0%, 0%)',
    backgroundImage: 'url(images/bg-desktop-dark.jpg)',
    headerColor: 'hsl(0, 0%, 0%)',
    inputBackground: 'hsl(0, 0%, 0%)',
    inputColor: 'hsl(0, 0%, 100%)',
    todoBackground: 'hsl(235, 24%, 19%)',
    todolistcolor: 'hsl(234, 39%, 85%)',
    todolisthovercolor: 'hsl(0, 0%, 100%)',
    border: '1px solid hsl(237, 14%, 26%)',
  };

  const styles = themeLight ? lightThemeStyles : darkThemeStyles;

  document.body.style.backgroundColor = styles.backgroundColor;
  document.body.style.backgroundImage = styles.backgroundImage;
  document.querySelector('.header h1').style.color = styles.headerColor;
  inputContainer.style.backgroundColor = styles.inputBackground;
  newTodo.style.color = styles.inputColor;

  document.querySelectorAll('.todo-list').forEach(todo => {
    todo.style.backgroundColor = styles.todoBackground;
    todo.style.color = styles.todolistcolor;
    todo.style.borderBottom = styles.border;
  });
};

const updateTabColors = () => {
  const tabs = { all, active, completed };
  Object.keys(tabs).forEach(tab => {
    tabs[tab].style.color = tab === activeTab ? 'hsl(220, 98%, 61%)' : 'hsl(234, 11%, 52%)';
  });
};

const updateSection=()=>{
  const todos = section1.querySelectorAll('.todo-list');
  todos.forEach(todo => {
    const checkbox = todo.querySelector('input[type="checkbox"]');
    switch (activeTab) {
      case 'all':
        todo.style.display = 'flex';
        break;
      case 'active':
        todo.style.display = checkbox.checked ? 'none' : 'flex';
        break;
      case 'completed':
        todo.style.display = checkbox.checked ? 'flex' : 'none';
        break;
    }
  });
}

const createTodoElement = text => {
  const todo = document.createElement('div');
  todo.classList.add('todo-list');
  todo.id = `todos-${section1.children.length + 1}`;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = `todo-${section1.children.length + 1}`;

  const label = document.createElement('label');
  label.classList.add('label1');
  label.htmlFor = checkbox.id;

  const img = document.createElement('img');
  img.src = 'images/icon-check.svg';
  img.alt = 'Check';
  img.classList.add('check-icon');
  label.appendChild(img);

  const span = document.createElement('span');
  span.innerText = text;

  todo.append(checkbox, label, span);
  section1.appendChild(todo);

  itemsLeft.textContent = `${section1.children.length} items left`;

  updateTheme();
};

// Event Listeners
theme.addEventListener('click', () => {
  themeLight = !themeLight;
  theme.src = themeLight ? 'images/icon-moon.svg' : 'images/icon-sun.svg';
  updateTheme();
});

newTodo.addEventListener('keydown', event => {
  if (event.key === 'Enter' && newTodo.value.trim()) {
    createTodoElement(newTodo.value.trim());
    newTodo.value = '';
    enableDragAndDrop();
  } else if (event.key === 'Enter') {
    alert('Please enter a valid todo');
  }
});

[all, active, completed].forEach(tab => {
  tab.addEventListener('click', () => {
    activeTab = tab.className;
    updateTabColors();
    updateSection();
  });
});

clearing.addEventListener('click', () => {
  const todos = section1.querySelectorAll('.todo-list');
  todos.forEach(todo => {
    const checkbox = todo.querySelector('input[type="checkbox"]');
    if (checkbox.checked) {
      section1.removeChild(todo);
    }
  });
  itemsLeft.textContent = `${section1.children.length} items left`;
});

// Add drag-and-drop functionality to todo-list items
const enableDragAndDrop = () => {
  const todos = section1.querySelectorAll('.todo-list');

  todos.forEach(todo => {
    // Make each item draggable
    todo.draggable = true;

    // Add event listeners for drag-and-drop
    todo.addEventListener('dragstart', event => {
      event.dataTransfer.setData('text/plain', todo.id);
      todo.classList.add('dragging');
    });

    todo.addEventListener('dragend', () => {
      todo.classList.remove('dragging');
    });
  });

  // Add dragover event to the section1 container
  section1.addEventListener('dragover', event => {
    event.preventDefault();
    const draggingElement = document.querySelector('.dragging');
    const afterElement = getDragAfterElement(section1, event.clientY);
    if (afterElement == null) {
      section1.appendChild(draggingElement);
    } else {
      section1.insertBefore(draggingElement, afterElement);
    }
  });
};

// Helper function to determine the position of the dragged item
const getDragAfterElement = (container, y) => {
  const draggableElements = [...container.querySelectorAll('.todo-list:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
};

// Initialize drag-and-drop
enableDragAndDrop();

// Initial Setup
updateTheme();
updateTabColors();

