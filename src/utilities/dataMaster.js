import { addDays } from "date-fns"

const dataMaster = (() => {
    const todoIDLength = 12;
    const projectIDLength = 10;

    // Local storage functions //

    function _retrieveLocalData() {

        function parseStorageDates(data) {
            data.general?.forEach(todo => {
                todo.dueDate = new Date(todo.dueDate);
            });
            data.projects.forEach(project => {
                project.projectToDos?.forEach(todo => {
                    todo.dueDate = new Date(todo.dueDate);
                });
            });
        };

        let storageData = JSON.parse(localStorage.getItem("dataset"));
        if (!storageData) {
            return {
                general: [
                    {
                        title: "toDo title",
                        description: "toDo description",
                        dueDate: new Date(2022, 7, 25),
                        important: true,
                        toDoID: '012342143567',
                        overdue: true,
                    },
                    {
                        title: "toDo title two",
                        description: "toDo description two",
                        dueDate: new Date(2022, 9, 27),
                        important: false,
                        toDoID: '0123454321672',
                    }
                ],
                projects: [
                    {
                        projectTitle: "project one title",
                        projectImage: "https://media.istockphoto.com/photos/delivering-quality-construction-for-a-quality-lifestyle-picture-id1297780288?b=1&k=20&m=1297780288&s=170667a&w=0&h=NDdDs9BBGULLwYUDUt1AjIOroHuwmFY9N6ZEDAYV7sE=",
                        projectDescription: "A description about my project.",
                        projectID: '1234512345',
                        projectToDos: [
                            {
                                title: "project 1 toDo 1",
                                description: "project description one",
                                dueDate: new Date(2022, 9, 11),
                                important: true,
                                toDoID: '092837261526',
                                complete: false,
                            },
                            {
                                title: "project 1 toDo 2",
                                description: "project description two",
                                dueDate: new Date(2022, 10, 3),
                                important: true,
                                toDoID: '064736251673',
                                complete: false,
                            },
                        ]
                    },
                    {
                        projectTitle: "project two title",
                        projectImage: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGxhcHRvcHxlbnwwfHwwfHw%3D&w=1000&q=80",
                        projectDescription: "Another description about a new project.",
                        projectID: '1234512346',
                        projectToDos: [
                            {
                                title: "project 2 toDo 1",
                                description: "project description one",
                                dueDate: new Date(2022, 9, 30),
                                important: true,
                                toDoID: '218272816354',
                                complete: false,
                            },
                            {
                                title: "project 2 toDo 2",
                                description: "project description two",
                                dueDate: new Date(2022, 10, 22),
                                important: false,
                                toDoID: '216712525362',
                                complete: true,
                            },
                        ]
                    }
                ]
            };
        };
        parseStorageDates(storageData);
        return storageData;
    };

    function _saveData() {
        localStorage.setItem('dataset', JSON.stringify(_todoDataset));
    };

    // Data creation functions

    const _createTodoID = () => {
        const date = new Date();
        const newID = `${date.getSeconds()}${date.getHours()}${date.getFullYear()}${date.getMilliseconds()}`;
        return newID.padStart(todoIDLength, "0");
    };

    const _createProjectID = () => {
        const date = new Date();
        const newID = `${date.getMilliseconds()}${date.getSeconds()}${date.getMinutes()}${date.getMonth()}`
        return newID.padStart(projectIDLength, "1");
    };

    const _createTodoObject = (todoTitle, todoDescription, todoDueDate, isImportant) => {
        const todoObject = {
            title: todoTitle,
            description: todoDescription,
            dueDate: todoDueDate,
            important: isImportant,
            toDoID: _createTodoID(),
            isComplete: false,
        };
        return todoObject;
    };

    const _createProjectObject = (newProjectTitle, newProjectDescription, newProjectImage) => {
        const projectObject = {
            projectTitle: newProjectTitle,
            projectImage: newProjectImage || null,
            projectDescription: newProjectDescription,
            projectID: _createProjectID(),
        };
        return projectObject;
    };

    // Data deletion functions

    const _deleteGeneralTodo = (IDtoDelete) => {
        const todoToDelete = _retrieveTodoIndex(IDtoDelete);
        if (!todoToDelete) {
            console.log("No toDo found with that ID");
            return false;
        } else {;
            _todoDataset.general.splice(todoToDelete, 1);
        };
        _saveData();
    };

    const _deleteProjectTodo = (projectID, IDtoDelete) => {
        const projectIndex = _retrieveProjectIndex(projectID);
        const todoIndex = _retrieveTodoIndex(IDtoDelete);
        _todoDataset.projects[projectIndex].projectToDos.splice[todoIndex, 1];
        _saveData();
    };

    const _deleteProject = (projectToDelete) => {
        const projectIndex = _retrieveProjectIndex(projectToDelete);
        _todoDataset.projects.splice(projectIndex, 1);
        _saveData();
    };

    // Dataset appending functions

    const _appendGeneralTodo = (todoObject) => {
        _todoDataset.general.push(todoObject);
        _saveData();
    };

    const _appendProjectTodo = (todoObject, findProjectID) => {
        todoObject.complete = False;
        _todoDataset.projects.find(proj => proj.projectID === findProjectID).projectToDos.push(todoObject);
        _saveData();
    };

    const _appendProject = (projectToAppend) => {
        _todoDataset.projects.push(projectToAppend);
        _saveData();
    };

    // Data retrieving functions

    const _retrieveTodoIndex = (todoToFind) => {
        return _todoDataset.general.findIndex(todo => todo.todoID === todoToFind) ||
            _todoDataset.projects.forEach(proj => {
                proj.projectToDos.forEach(projTodo => projTodo.toDoID === todoToFind);
            }
        );
    };

    const _retrieveProjectIndex = (projectToFind) => {
        return _todoDataset.projects.findIndex(proj => proj.projectID === projectToFind);
    };

    const _retrieveAllTodos = () => {
        const allToDos = [..._todoDataset.general];
        _todoDataset.projects.forEach(project => {
            project.projectToDos?.forEach(toDo => {
                allToDos.push(toDo);
            });
        });
        return allToDos;
    };

    const _retrieveSingleTodo = (todoID) => {
        const foundTodo = _todoDataset.general.find(todo => todo.toDoID === todoID);
        if (!foundTodo) {
            _todoDataset.projects.forEach(proj => {
                proj.projectToDos.forEach(projToDo => {
                    if (projToDo.todoID === todoID) return projToDo
                });
            });
        };
        return foundTodo; 
    };

    const _retrieveDateOrdered = () => {
        const allToDos = _retrieveAllTodos();
        const sortedByDate = allToDos.sort((a, b) => {
            return a.dueDate > b.dueDate ? 1 : -1;
            }
        );
        return sortedByDate;
    };

    const _retrieveTimeTodos = (daysAhead) => {
        const allToDos = _retrieveAllTodos();
        const dateTarget = addDays(new Date(), daysAhead)
        return allToDos.filter(todo => todo.dueDate < dateTarget)
    };

    const _checkGeneralOverdue = (date) => {
        _todoDataset.general.forEach(todo => {
            if (todo.dueDate < date) {
                todo.overdue = true;
            };
        });
    };

    const _checkProjectsOverdue = (date) => {
        _todoDataset.projects.forEach(proj => {
            proj.projectToDos?.forEach(todo => {
                if (todo.dueDate < date) {
                    todo.overdue = true;
                };
            });
        });
    };

    const _checkAllOverdue = () => {
        const today = new Date();
        _checkGeneralOverdue(today);
        _checkProjectsOverdue(today)
    };

    // Data adding functions

    const _addNewTodo = (title, description, dueDate, projectID) => {
        projectID = projectID || null; 
        const newTodo = _createTodoObject(title, description, dueDate);
        if(!projectID) {
            _appendGeneralTodo(newTodo);
        } else {
            _appendProjectTodo(newTodo, projectID);
        };
    };

    function _addNewProject (title, description, imageURL) {
        imageURL = imageURL || null;
        const newProject = _createProjectObject(title, description, imageURL);
        _appendProject(newProject);
    };

    // Functions to return

    function retrieveData (toSortBy, amount) {
        // Pass in "date" to retrieve all todos sorted in date order. 
        // Use "projects" to return all projects.
        // Use "general" to return all general (non-project) todos.
        toSortBy = toSortBy || null;
        amount = amount || null;

        let dataArray = [];

        if (toSortBy === "date") {
            dataArray = _retrieveDateOrdered(); 
            if (amount) {
                return dataArray.slice(0, amount);
            };
            return dataArray;

        } else if (toSortBy === "projects") {
            dataArray = _todoDataset.projects; 
            if (amount) {
                return dataArray.slice(0, amount);
            };
            return dataArray;

        } else if (toSortBy === "general") {
            dataArray = _todoDataset.general;
            if (amount) {
                return dataArray.slice(0, amount);
            };
            return _todoDataset.general;

        } else {
            dataArray = _retrieveAllTodos();
            if (amount) {
                return dataArray.slice(0, amount);
            };
            return _retrieveAllTodos();
        };
    };

    const retrieveSingleProject = (projectID) => {
        const foundProject = _todoDataset.projects.find(proj => proj.projectID === projectID);
        if (!foundProject) {
            throw new Error `No Project Found with ID ${projectID}`
        } else {
            return foundProject;
        };
    };

    function deleteData (IDtoDelete) {
        if (IDtoDelete.length === projectIDLength) {
            _deleteProject(IDtoDelete)
        } else if (IDtoDelete.length === todoIDLength) {
            if (!_deleteGeneralTodo(IDtoDelete)) {
                _deleteProjectTodo(IDtoDelete)
            };
        };
    };

    function parseNewTodo (projectId) {
        projectId = projectId || null;

        const titleInput = document.querySelector("#title-input");
        const todoTitle = titleInput.value;

        const descriptionInput = document.querySelector("#description-input");
        const todoDescription = descriptionInput.value;

        const dueDateInput = document.querySelector("#due-date-input");
        const dateArray = dueDateInput.value.split("-");
        const dueDate = new Date(dateArray[0], dateArray[1], dateArray[2]);

        _addNewTodo(todoTitle, todoDescription, dueDate, projectId)
    };

    function parseNewProject () {
        const projectTitleInput = document.querySelector("#project-title-input");
        const projectTitle = projectTitleInput.value;

        const projectDescriptionInput = document.querySelector("#project-description-input");
        const projectDescription = projectDescriptionInput.value;

        const projectImageInput = document.querySelector("#image-input");
        const projectImageURL = projectImageInput.value;

        _addNewProject(projectTitle, projectDescription, projectImageURL);
    };

    // Initiate data from storage
    const _todoDataset = _retrieveLocalData();
    _checkAllOverdue(_todoDataset);

    return {
        retrieveData,
        retrieveSingleProject,
        deleteData,
        parseNewTodo,
        parseNewProject,
    };

})();

export { dataMaster };