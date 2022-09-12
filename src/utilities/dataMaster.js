const dataMaster = (() => {
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
                    projectID: 219621,
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
                    projectID: 249621,
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
        return parseInt(newID);
    };

    const _createProjectID = () => {
        const date = new Date();
        const newID = `${date.getMilliseconds()}${date.getSeconds()}${date.getMinutes()}${date.getMonth()}`
        return parseInt(newID);
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
        const todoToDelete = _todoDataset.general.find(todo => todo.todoID === IDtoDelete);
        if (!todoToDelete) {
            throw new Error("No toDo found with that ID");
        } else {
        const index = _todoDataset.general.findIndex(todoToDelete);
        _todoDataset.splice(index, 1);
        };
    };

    const _deleteProjectTodo = (projectID, IDtoDelete) => {

    };

    const _deleteProject = (projectToDelete) => {

    };

    // Dataset appending functions

    const _appendGeneralTodo = (todoObject) => {
        _todoDataset.general.push(todoObject);
    };

    const _appendProjectTodo = (todoObject, findProjectID) => {
        todoObject.complete = False;
        _todoDataset.projects.find(proj => proj.projectID === findProjectID).projectToDos.push(todoObject);
    };

    // Data retrieving functions

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
    };

    // Functions to return

    const addNewTodo = (title, description, dueDate) => {
        const newTodo = _createTodoObject(title, description, dueDate);
        _appendGeneralTodo(newTodo);
    };

    return {
        addNewTodo,

    };

})();

export { dataMaster };