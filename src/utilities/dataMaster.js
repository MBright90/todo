import { format } from "date-fns"
format(new Date())

const dataMaster = (() => {
    todoIDLength = 8;
    projectIDLength = 10;

    const _todoDataset = {
        general : [],
        projects: [],
    };

    // Local storage functions //

    const _retrieveLocalData = () => {
        const localData = {
            general: [
                {
                    title: "toDo title",
                    description: "toDo description",
                    dueDate: new Date(2022, 09, 25),
                    important: true,
                    toDoID: 21862122
                },
                {
                    title: "toDo title two",
                    description: "toDo description two",
                    dueDate: new Date(2022, 09, 27),
                    important: false,
                    toDoID: 24862122
                }
            ],
            projects: [
                {
                    projectTitle: "project one title",
                    projectImage: "",
                    projectID: 1111219621,
                    projectToDos: [
                        {
                            title: "project toDo one",
                            description: "project description one",
                            dueDate: new Date(30/09/2022, 9, 11),
                            important: true,
                            toDoID: 23862122,
                            complete: False,
                        },
                        {
                            title: "project toDo two",
                            description: "project description two",
                            dueDate: new Date(2022, 10, 3),
                            important: true,
                            toDoID: 22862122,
                            complete: false,
                        },
                    ]
                },
                {
                    projectTitle: "project two title",
                    projectImage: "",
                    projectID: 1111249621,
                    projectToDos: [
                        {
                            title: "project toDo one",
                            description: "project description one",
                            dueDate: new Date(2022, 9, 30),
                            important: true,
                            toDoID: 21827281,
                            complete: false,
                        },
                        {
                            title: "project toDo two",
                            description: "project description two",
                            dueDate: new Date(2022, 10, 22),
                            important: true,
                            toDoID: 2167125,
                            complete: true,
                        },
                    ]
                },
            ]
        };

        return localData;
    };

    // const saveLocalData = () => {};

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
            dueDate: new Date(todoDueDate),
            important: isImportant,
            toDoID: _createTodoID(),
        };
        return todoObject;
    };

    const _createProjectObject = (newProjectTitle, newProjectImage) => {
        const projectObject = {
            projectTitle: newProjectTitle,
            projectImage: newProjectImage || null,
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
    };

    const _deleteProjectTodo = (projectID, IDtoDelete) => {
        const projectIndex = _retrieveProjectIndex(projectID);
        const todoIndex = _retrieveTodoIndex(IDtoDelete);
        _todoDataset.projects[projectIndex].projectToDos.splice[todoIndex, 1];
    };

    const _deleteProject = (projectToDelete) => {
        const projectIndex = _retrieveProjectIndex(projectToDelete);
        _todoDataset.projects.splice(projectIndex, 1);
    };

    // Dataset appending functions

    const _appendGeneralTodo = (todoObject) => {
        _todoDataset.general.push(todoObject);
    };

    const _appendProjectTodo = (todoObject, findProjectID) => {
        todoObject.complete = False;
        _todoDataset.projects.find(proj => proj.projectID === findProjectID).projectToDos.push(todoObject);
    };

    const _appendProject = (projectToAppend) => {
        _todoDataset.projects.push(projectToAppend);
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

    const _retrieveProject = (projectID) => {
        const foundProject = _todoDataset.projects.find(proj => proj.projectID === projectID);
        if (!foundProject) {
            throw new Error `No Project Found with ID ${projectID}`
        } else {
            return foundProject;
        };
    };

    const _retrieveAllTodos = () => {
        const allToDos = _todoDataset.general;
        _todoDataset.projects.forEach(project => {
            project.projectToDos.forEach(toDo => {
                allToDos.push(toDo);
            });
        });
        return allToDos;
    };

    const _retrieveDateOrdered = () => {
        const allToDos = _retrieveAllTodos();
        const sortedByDate = allToDos.sort((a, b) => a.dueDate < b.dueDate);
        return sortedByDate;
    };

    // Functions to return

    const addNewTodo = (title, description, dueDate, projectID) => {
        projectID = projectID || null; 
        const newTodo = _createTodoObject(title, description, dueDate);
        if(!projectID) {
            _appendGeneralTodo(newTodo);
        } else {
            _appendProjectTodo(newToDo, projectID);
        };
    };

    const addNewProject = (title, imageURL) => {
        imageURL = imageURL || null;
        const newProject = _createProjectObject(title, imageURL);
        _appendProject(newProject);
    };

    const retrieveData = (sortBy) => {
        const sortBy = sortBy || null;
        if (sortBy === "date") {
            return _retrieveDateOrdered();
        } else if (sortBy === "projects") {
            return _todoDataset.projects;
        } else {
            return _retrieveAllTodos();
        };
    };

    const deleteData = (IDtoDelete) => {
        if (IDtoDelete.length === projectIDLength) {
            _deleteProject(IDtoDelete)
        } else if (IDtoDelete.length === todoIDlength) {
            if (!_deleteGeneralTodo(IDtoDelete)) {
                _deleteProjectTodo(IDtoDelete)
            };
        };
    };

    return {
        addNewTodo,
        addNewProject,
        retrieveData,
        deleteData,
    };

})();

export { dataMaster };