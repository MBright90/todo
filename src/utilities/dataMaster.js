// eslint-disable-next-line import/no-extraneous-dependencies
import { formatDistanceStrict, addDays, subMonths } from 'date-fns';

const dataMaster = (() => {
  const todoIDLength = 12;
  const projectIDLength = 10;

  // ********************************************* //
  // *********** Retrieve stored data ************ //
  // ********************************************* //

  function retrieveTodoData() {
    function parseStorageDates(data) {
      data.general?.forEach((todo) => {
        todo.dueDate = new Date(todo.dueDate);
      });
      data.projects.forEach((project) => {
        project.projectToDos?.forEach((todo) => {
          todo.dueDate = new Date(todo.dueDate);
        });
      });
    }

    let storageData;
    try {
      storageData = JSON.parse(localStorage.getItem('dataset'));
      parseStorageDates(storageData);
    } catch (err) {
      console.log(err);
    }

    if (!storageData) {
      return {
        general: [

        ],
        projects: [

        ],
      };
    }

    return storageData;
  }

  function retrieveCompleteData() {
    let completeData;
    try {
      completeData = JSON.parse(localStorage.getItem('complete'));
    } catch (err) {
      console.log(err);
    }

    if (!completeData) return [];

    return completeData;
  }

  // Initiate data from storage
  const todoDataset = retrieveTodoData();
  const completeDataset = retrieveCompleteData();

  // ********************************************* //
  // ********* Local storage functions *********** //
  // ********************************************* //

  function retrieveViewMode() {
    let viewMode;
    try {
      viewMode = localStorage.getItem('viewMode');
    } catch (err) {
      console.log(err);
      viewMode = 'light';
    }
    return viewMode;
  }

  function saveData() {
    localStorage.setItem('dataset', JSON.stringify(todoDataset));
  }

  function saveCompleteData() {
    localStorage.setItem('complete', JSON.stringify(completeDataset));
  }

  function addViewToStorage(currentMode) {
    localStorage.setItem('viewMode', currentMode);
  }

  function deleteStorage() {
    localStorage.setItem('dataset', '');
    localStorage.setItem('complete', '');
    // Empty current dataset
    todoDataset.general?.splice(0, todoDataset.general.length);
    todoDataset.projects?.splice(0, todoDataset.projects.length);
  }

  const checkAllOverdue = () => {
    const checkGeneralOverdue = (date) => {
      todoDataset.general.forEach((todo) => {
        if (todo.dueDate < date) {
          todo.overdue = true;
        } else {
          todo.overdue = false;
        }
      });
    };

    const checkProjectsOverdue = (date) => {
      todoDataset.projects.forEach((proj) => {
        proj.projectToDos?.forEach((todo) => {
          if (todo.dueDate < date) {
            todo.overdue = true;
          } else {
            todo.overdue = false;
          }
        });
      });
    };

    const today = new Date();
    checkGeneralOverdue(today);
    checkProjectsOverdue(today);
  };

  // ********************************************* //
  // ********* Data creation functions *********** //
  // ********************************************* //

  const createTodoID = () => {
    const date = new Date();
    const newID = `${date.getSeconds()}${date.getHours()}${date.getFullYear()}${date.getMilliseconds()}`;
    return newID.padStart(todoIDLength, '0');
  };

  const createProjectID = () => {
    const date = new Date();
    const newID = `${date.getMilliseconds()}${date.getSeconds()}${date.getMinutes()}${date.getMonth()}`;
    return newID.padStart(projectIDLength, '1');
  };

  const createTodoObject = (todoTitle, todoDescription, todoDueDate, isImportant) => {
    const todoObject = {
      title: todoTitle,
      description: todoDescription,
      dueDate: todoDueDate,
      important: isImportant,
      toDoID: createTodoID(),
      isComplete: false,
    };
    return todoObject;
  };

  const createProjectObject = (newProjectTitle, newProjectDescription, newProjectImage) => {
    const projectObject = {
      projectTitle: newProjectTitle,
      projectImage: newProjectImage || null,
      projectDescription: newProjectDescription,
      projectID: createProjectID(),
      projectToDos: [],
    };
    return projectObject;
  };

  // ********************************************* //
  // ******* Dataset appending functions ********* //
  // ********************************************* //

  const appendGeneralTodo = (todoObject) => {
    todoDataset.general.push(todoObject);
    saveData();
  };

  const appendProjectTodo = (todoObject, findProjectID) => {
    todoObject.complete = false;
    const project = todoDataset.projects.find((proj) => proj.projectID === findProjectID);
    if (!project.projectToDos) {
      project.projectToDos = [];
    }
    project.projectToDos.push(todoObject);
    saveData();
  };

  const appendProject = (projectToAppend) => {
    todoDataset.projects.push(projectToAppend);
    saveData();
  };

  function editTodo(todo, title, description, dueDate) {
    todo.title = title;
    todo.description = description;
    todo.dueDate = dueDate;

    saveData();
  }

  // ********************************************* //
  // ********* Data retrieval functions ********** //
  // ********************************************* //

  const retrieveTodoIndex = (todoToFind, projectIndex) => {
    projectIndex = null || projectIndex;
    let todoIndex;
    todoIndex = todoDataset.general.findIndex((todo) => todo.toDoID === todoToFind);

    if (todoIndex === -1) {
      if (projectIndex >= 0) {
        const project = todoDataset.projects[projectIndex];
        todoIndex = project.projectToDos.findIndex((todo) => todo.toDoID === todoToFind);
      }
    }
    return todoIndex;
  };

  function retrieveTodosProjectId(todoToFind) {
    let projectId;
    todoDataset.projects.forEach((proj) => {
      proj.projectToDos.forEach((todo) => {
        if (todo.toDoID === todoToFind) {
          projectId = proj.projectID;
        }
      });
    });
    return projectId;
  }

  function retrieveProjectIndex(projectToFind) {
    return todoDataset.projects.findIndex((project) => project.projectID === projectToFind);
  }

  const retrieveAllTodos = () => {
    const allToDos = [...todoDataset.general];
    todoDataset.projects.forEach((project) => {
      project.projectToDos?.forEach((toDo) => {
        allToDos.push(toDo);
      });
    });
    return allToDos;
  };

  const retrieveTodo = (todoID) => {
    let foundTodo = todoDataset.general.find((todo) => todo.toDoID === todoID);
    if (!foundTodo) {
      todoDataset.projects.forEach((proj) => {
        proj.projectToDos.forEach((projToDo) => {
          if (projToDo.toDoID === todoID) foundTodo = projToDo;
        });
      });
    }
    console.log(foundTodo);
    return foundTodo;
  };

  const retrieveDateOrdered = () => {
    const allToDos = retrieveAllTodos();
    const sortedByDate = allToDos.sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1));
    return sortedByDate;
  };

  // ********************************************* //
  // ************ New data functions ************* //
  // ********************************************* //

  const addNewTodo = (title, description, dueDate, projectID) => {
    projectID = projectID || null;
    const newTodo = createTodoObject(title, description, dueDate);
    if (!projectID) {
      appendGeneralTodo(newTodo);
    } else {
      appendProjectTodo(newTodo, projectID);
    }
  };

  function addNewProject(title, description, imageURL) {
    imageURL = imageURL || null;
    const newProject = createProjectObject(title, description, imageURL);
    appendProject(newProject);
  }

  // ********************************************* //
  // ********* Data deletion functions *********** //
  // ********************************************* //

  const deleteGeneralTodo = (IDtoDelete) => {
    const todoToDelete = retrieveTodoIndex(IDtoDelete);
    if (todoDataset.general[todoToDelete]?.toDoID !== IDtoDelete) {
      return false;
    }
    todoDataset.general.splice(todoToDelete, 1);
    saveData();
    return true;
  };

  const deleteProjectTodo = (IDtoDelete) => {
    const projectId = retrieveTodosProjectId(IDtoDelete);
    const projectIndex = retrieveProjectIndex(projectId);
    const todoIndex = retrieveTodoIndex(IDtoDelete, projectIndex);
    todoDataset.projects[projectIndex].projectToDos.splice(todoIndex, 1);
    saveData();
  };

  const deleteProject = (projectToDelete) => {
    const projectIndex = retrieveProjectIndex(projectToDelete);
    todoDataset.projects.splice(projectIndex, 1);
    saveData();
  };

  // ********************************************* //
  // ************** Return functions ************* //
  // ********************************************* //

  function retrieveData(toSortBy, amount) {
    // Pass in "date" to retrieve all todos sorted in date order.
    // Use "projects" to return all projects.
    // Use "general" to return all general (non-project) todos.
    toSortBy = toSortBy || null;
    amount = amount || null;

    let dataArray = [];

    if (toSortBy === 'date') {
      dataArray = retrieveDateOrdered();
      if (amount) {
        return dataArray.slice(0, amount);
      }
      return dataArray;
    } if (toSortBy === 'projects') {
      dataArray = todoDataset.projects;
      if (amount) {
        return dataArray.slice(0, amount);
      }
      return dataArray;
    } if (toSortBy === 'general') {
      dataArray = todoDataset.general;
      if (amount) {
        return dataArray.slice(0, amount);
      }
      return todoDataset.general;
    } if (toSortBy === 'completed') {
      return completeDataset;
    }
    dataArray = retrieveAllTodos();
    if (amount) {
      return dataArray.slice(0, amount);
    }
    return retrieveAllTodos();
  }

  function retrieveDeadlines(daysDifference) {
    const data = retrieveData('date');
    const targetDate = addDays(new Date(), daysDifference);
    return data.filter((todo) => parseInt(formatDistanceStrict(todo.dueDate, targetDate, { unit: 'day' }).split(' ')[0], 10) <= daysDifference);
  }

  const retrieveSingleProject = (projectID) => {
    const foundProject = todoDataset.projects.find((proj) => proj.projectID === projectID);
    if (!foundProject) {
      throw new Error(`No Project Found with ID ${projectID}`);
    } else {
      return foundProject;
    }
  };

  const retrieveSingleTodo = (todoId) => retrieveTodo(todoId);

  function editData(dataId) {
    const todoIndex = retrieveTodoIndex(dataId);
    console.log(todoIndex);
  }

  function deleteData(IDtoDelete) {
    if (IDtoDelete.length === projectIDLength) {
      deleteProject(IDtoDelete);
    } else if (!deleteGeneralTodo(IDtoDelete)) {
      deleteProjectTodo(IDtoDelete);
    }
  }

  function setComplete(dataId) {
    const todo = retrieveTodo(dataId);
    completeDataset.unshift(todo);
    saveCompleteData();
  }

  function parseNewTodo(projectId) {
    projectId = projectId || null;

    const titleInput = document.querySelector('#title-input');
    const todoTitle = titleInput.value;

    const descriptionInput = document.querySelector('#description-input');
    const todoDescription = descriptionInput.value;

    const dueDateInput = document.querySelector('#due-date-input');
    const dateArray = dueDateInput.value.split('-');
    const dueDate = subMonths(new Date(dateArray[0], dateArray[1], dateArray[2]), 1);

    addNewTodo(todoTitle, todoDescription, dueDate, projectId);
  }

  function parseNewProject() {
    const projectTitleInput = document.querySelector('#project-title-input');
    const projectTitle = projectTitleInput.value;

    const projectDescriptionInput = document.querySelector('#project-description-input');
    const projectDescription = projectDescriptionInput.value;

    const projectImageInput = document.querySelector('#image-input');
    const projectImageURL = projectImageInput.value;

    addNewProject(projectTitle, projectDescription, projectImageURL);
  }

  function parseEditTodo(todoId, projectId) {
    projectId = projectId || null;

    const todo = retrieveTodo(todoId);

    const titleInput = document.querySelector('#title-input');
    const todoTitle = titleInput.value;

    const descriptionInput = document.querySelector('#description-input');
    const todoDescription = descriptionInput.value;

    const dueDateInput = document.querySelector('#due-date-input');
    const dateArray = dueDateInput.value.split('-');
    const dueDate = subMonths(new Date(dateArray[0], dateArray[1], dateArray[2]), 1);

    editTodo(todo, todoTitle, todoDescription, dueDate, projectId);
  }

  function checkViewMode() {
    return retrieveViewMode();
  }

  function saveViewMode(viewMode) {
    addViewToStorage(viewMode);
  }

  function resetSiteData() {
    deleteStorage();
  }

  retrieveViewMode();
  checkAllOverdue(todoDataset);

  return {
    retrieveData,
    retrieveDeadlines,
    retrieveSingleTodo,
    retrieveSingleProject,

    editData,
    deleteData,
    setComplete,

    parseNewTodo,
    parseNewProject,
    parseEditTodo,

    checkViewMode,
    saveViewMode,
    resetSiteData,
  };
})();

export default dataMaster;
