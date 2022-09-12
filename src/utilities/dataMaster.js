const dataMaster = (() => {
    const _todoDataset = {};

    // Local storage functions //

    const _retrieveLocalData = () => {
        const localData = {

            general: [
                {
                    title: "toDo title",
                    description: "toDo description",
                    dueDate: "25/09/2022",
                    important: true,
                    toDoID: 21862122
                },
                {
                    title: "toDo title two",
                    description: "toDo description two",
                    dueDate: "27/09/2022",
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
                            dueDate: "30/09/2022",
                            important: true,
                            toDoID: 23862122
                        },
                        {
                            title: "project toDo two",
                            description: "project description two",
                            dueDate: "03/10/2022",
                            important: true,
                            toDoID: 22862122
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
                            dueDate: "30/09/2022",
                            important: true,
                        },
                        {
                            title: "project toDo two",
                            description: "project description two",
                            dueDate: "03/10/2022",
                            important: true,
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
            dueDate: todoDueDate,
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
        _todoDataset.projects.find(proj => proj.projectID === findProjectID).projectToDos.push(todoObject);
    };

})();