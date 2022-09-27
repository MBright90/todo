import { formatDistanceStrict, addDays, subMonths } from "date-fns"

const dataMaster = (() => {
    const todoIDLength = 12;
    const projectIDLength = 10;

    // Local storage functions //

    function _retrieveTodoData() {

        function _parseStorageDates(data) {
            data.general?.forEach(todo => {
                todo.dueDate = new Date(todo.dueDate);
            });
            data.projects.forEach(project => {
                project.projectToDos?.forEach(todo => {
                    todo.dueDate = new Date(todo.dueDate);
                });
            });
        };

        let storageData;
        try {
            storageData = JSON.parse(localStorage.getItem("dataset"));
            _parseStorageDates(storageData);
        }
        catch(err) {
            console.log(err);
        };

        if (!storageData) {
            return {
                "general": [

                ],
                "projects": [

                ]
            };
        }
        
        return storageData;
    };

    function _retrieveCompleteData() {

        function parseCompletedDates(data) {
            data.foreach(completedTodo => {
                const dateArr = completedTodo.dueDate.split("-");
                const dateDate = dateArr[2].split("T")[0]
                completedTodo.dueDate = new Date(dateArr[0], dateArr[1]-1, dateDate);
            });
        };

        let completeData;
        try {
            completeData = JSON.parse(localStorage.getItem("complete"));
            parseCompletedDates(completedData);
        }
        catch(err) {
            console.log(err)
        };

        if (!completeData) return new Array();

        return completeData;
    };

    function _retrieveViewMode() {
        let viewMode;
        try {
            viewMode = localStorage.getItem("viewMode");
        }
        catch(err) {
            console.log(err)
            viewMode = "light"
        };
        return viewMode;
    };

    function _saveData() {
        localStorage.setItem("dataset", JSON.stringify(_todoDataset));
    };

    function _saveCompleteData() {
        localStorage.setItem("complete", JSON.stringify(_completeDataset));
    };

    function _saveViewMode(currentMode) {
        localStorage.setItem("viewMode", currentMode)
    };

    function _deleteStorage() {
        localStorage.setItem("dataset", "");
        localStorage.setItem("complete", "");
        // Empty current dataset
        _todoDataset.general?.splice(0, _todoDataset.general.length);
        _todoDataset.projects?.splice(0, _todoDataset.projects.length);
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
            projectToDos: [],
        };
        return projectObject;
    };

    // Data deletion functions

    const _deleteGeneralTodo = (IDtoDelete) => {
        const todoToDelete = _retrieveTodoIndex(IDtoDelete);
        if (_todoDataset.general[todoToDelete]?.toDoID != IDtoDelete) {
            return false;
        } else {;
            _todoDataset.general.splice(todoToDelete, 1);
            _saveData();
            return true;
        };
    };

    const _deleteProjectTodo = (IDtoDelete) => {
        const projectId = _retrieveTodosProjectId(IDtoDelete);
        const projectIndex = _retrieveProjectIndex(projectId);
        const todoIndex = _retrieveTodoIndex(IDtoDelete, projectIndex);
        _todoDataset.projects[projectIndex].projectToDos.splice(todoIndex, 1);
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
        todoObject.complete = false;
        const project = _todoDataset.projects.find(proj => proj.projectID === findProjectID);
        if (!project.projectToDos) {
            project.projectToDos = [];
        };
        project.projectToDos.push(todoObject);
        _saveData();
    };

    const _appendProject = (projectToAppend) => {
        _todoDataset.projects.push(projectToAppend);
        _saveData();
    };

    // Data retrieving functions

    const _retrieveTodoIndex = (todoToFind, projectIndex) => {
        projectIndex = null || projectIndex;
        let todoIndex;
        todoIndex = _todoDataset.general.findIndex(todo => todo.toDoID === todoToFind);

        if (todoIndex === -1) {
            if (projectIndex >= 0) {
                todoIndex = _todoDataset.projects[projectIndex].projectToDos.findIndex(todo => todo.toDoID === todoToFind)
            };              
        };
        return todoIndex;
    };

    function _retrieveTodosProjectId(todoToFind) {
        let projectId;
        _todoDataset.projects.forEach(proj => {
            proj.projectToDos.forEach(todo => {
                if (todo.toDoID === todoToFind) {
                    projectId = proj.projectID
                };
            });
        });  
        return projectId;
    };

    function _retrieveProjectIndex(projectToFind) {
        return _todoDataset.projects.findIndex(project => project.projectID === projectToFind);
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

        } else if (toSortBy === "completed") {
            return _completeDataset;
        } else {
            dataArray = _retrieveAllTodos();
            if (amount) {
                return dataArray.slice(0, amount);
            };
            return _retrieveAllTodos();
        };
    };

    function retrieveDeadlines (daysDifference) {
        let data = retrieveData("date");
        const targetDate = addDays(new Date(), daysDifference);
        return data.filter(todo => 
            parseInt(formatDistanceStrict(todo.dueDate, targetDate, {unit: "day"}).split(" ")[0]) <= daysDifference);
    };

    const retrieveSingleProject = (projectID) => {
        const foundProject = _todoDataset.projects.find(proj => proj.projectID === projectID);
        if (!foundProject) {
            throw new Error(`No Project Found with ID ${projectID}`)
        } else {
            return foundProject;
        };
    };

    function editData (dataId) {
        const todoIndex = _retrieveTodoIndex(dataId);
        console.log(todoIndex);
    };

    function deleteData (IDtoDelete) {
        if (IDtoDelete.length === projectIDLength) {
            _deleteProject(IDtoDelete)
        } else {
            if (!_deleteGeneralTodo(IDtoDelete)) {
                _deleteProjectTodo(IDtoDelete)
            };
        };
    };

    function setComplete(dataId) {
        const todo = _retrieveSingleTodo(dataId);
        _completeDataset.unshift(todo);
        _saveCompleteData();
    };

    function parseNewTodo (projectId) {
        projectId = projectId || null;

        const titleInput = document.querySelector("#title-input");
        const todoTitle = titleInput.value;

        const descriptionInput = document.querySelector("#description-input");
        const todoDescription = descriptionInput.value;

        const dueDateInput = document.querySelector("#due-date-input");
        const dateArray = dueDateInput.value.split("-");
        const dueDate = subMonths(new Date(dateArray[0], dateArray[1], dateArray[2]), 1);

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

    function parseEditTodo() {

    };

    function parseEditProject() {
    
    };

    function checkViewMode() {
        return _retrieveViewMode();
    };

    function saveViewMode(viewMode) {
        _saveViewMode(viewMode);
    };

    function resetSiteData () {
        _deleteStorage();
    };

    // Initiate data from storage
    const _todoDataset = _retrieveTodoData();
    const _completeDataset = _retrieveCompleteData();
    _retrieveViewMode();
    _checkAllOverdue(_todoDataset);

    return {
        retrieveData,
        retrieveDeadlines,
        retrieveSingleProject,

        editData,
        deleteData,
        setComplete,

        parseNewTodo,
        parseNewProject,
        parseEditTodo,
        parseEditProject,

        checkViewMode,
        saveViewMode,
        resetSiteData,
    };

})();

export { dataMaster };