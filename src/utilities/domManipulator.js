import { format, formatDistanceStrict, addDays, subMonths } from 'date-fns';

// *********** Overarching utility functions ************* //

function createElementClass(element, ...args) {
    const newElement = document.createElement(element);
    args.forEach(arg => {
        newElement.classList.add(arg);
    });
    return newElement;
};

function createElementText(element, text) {
    const newElement = document.createElement(element);
    try {
        newElement.textContent = text;
    }
    catch(err) {
        console.log("No text can be added to this element");
    };
    return newElement;
};

function appendChildren(element, ...args) {
    args.forEach(arg => {
        element.appendChild(arg);
    });
};

function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key])
    };
};

// ********************************************* //
// ************** Dom Manipulator ************** //
// ********************************************* //

const domManipulator = (() => {

    const body = document.body;
    const mainLayout = createElementClass("div", "main-layout");

    /* Utility functions */

    function  _createListedLinks(listContainer, linkArr) {
        linkArr.forEach(link => {
            const li = document.createElement("li");
            const liLink = createElementText("a", link);
            li.appendChild(liLink)
            listContainer.appendChild(li);
        });
    };

    const _createProjectCard = (project) => {
        const projectCard = createElementClass("div", "project-card");
        projectCard.dataset.projectId = project.projectID;
        
        const projectImage = createElementClass("div", "project-image");
        if (project.projectImage) {
            projectImage.style.backgroundImage = `url('${project.projectImage}')`;
        };

        const projectTitle = createElementClass("div", "project-title");
        projectTitle.textContent = project.projectTitle;

        const projectDescription = createElementClass("div", "project-description");
        projectDescription.textContent = project.projectDescription;

        appendChildren(projectCard, projectImage, projectTitle, projectDescription);
        return projectCard;
    };

    const _createProjectGrid = (projects) => {
        const projectGrid = createElementClass("div", "project-grid");
        projects.forEach(project => {
            projectGrid.appendChild(_createProjectCard(project));
        });
        return projectGrid;
    }

    function _createAlert(alertString) {
        const alertContainer = createElementClass("div", "alert-container");
        const alertPara = createElementText("p", alertString);
        const confirmButton = createElementText("button", "Ok");
        appendChildren(alertContainer, alertPara, confirmButton)
        return alertContainer;
    };

    function _createConfirm(confirmString) {
        const confirmContainer = createElementClass("div", "confirm-container");
        const confirmPara = createElementText("p", confirmString);
        const continuePara = createElementText("p", "Are you sure you would like to continue?")
        const buttonContainer = createElementClass("div", "confirm-buttons");
        const confirmButton = createElementText("button", "Continue");
        const cancelButton = createElementText("button", "Cancel");

        appendChildren(buttonContainer, confirmButton, cancelButton);
        appendChildren(confirmContainer, confirmPara, continuePara, buttonContainer);
        return confirmContainer;
    };

    /* Table functions */

    const _createTableHeaders = (...headers) => {
        const tableHeaders = document.createElement("tr");
        headers.forEach(heading => {
            const headingCell = createElementText("th", heading);
            tableHeaders.appendChild(headingCell);
        });
        return tableHeaders
    };

    const _createInteractiveCell = () => {
        const newCell = createElementClass("td", "interactive");

        const tick = createElementClass("a", "complete-icon");
        const tickIcon = createElementClass("i", "fa-solid", "fa-check");
        tick.appendChild(tickIcon);

        const edit = createElementClass("a", "edit-icon");
        const editIcon = createElementClass("i", "fa-regular", "fa-pen-to-square");
        edit.appendChild(editIcon);

        const trash = createElementClass("a", "trash-icon");
        const trashIcon = createElementClass("i", "fa-solid", "fa-trash");
        trash.appendChild(trashIcon);

        appendChildren(newCell, tick, edit, trash);
        return newCell;
    };

    const _appendTableData = (tableElement, tableRowArr) => {
        tableRowArr.forEach(tableRow => {
            tableElement.appendChild(tableRow);
        });
    };

    function _createTodoTable (toDoList) {

        const _createTableRow = (toDo) => {
            const currentRow = document.createElement("tr");
            currentRow.dataset.todoId = toDo.toDoID;

            const toDoTitle = createElementText("td", toDo.title);
            const toDoDetails = createElementText("td", toDo.description);

            let date = toDo.dueDate.getDate();
            if (date < 10) date = `0${date}`;

            let month = toDo.dueDate.getMonth() + 1;
            if (month < 10) month = `0${month}`;

            const toDoDue = createElementText("td", `${date}/${month}/${toDo.dueDate.getFullYear()}`);
            toDoDue.classList.add("date-col");
            const toDoInteractive = _createInteractiveCell();

            if (toDo.overdue) {
                currentRow.classList.add("overdue")
            };

            appendChildren(currentRow, toDoTitle, toDoDetails, toDoDue, toDoInteractive);
            return currentRow;
        };

        const _createTableData = (toDoData) => {
            const tableArr = [];
            toDoData?.forEach(toDoItem => {
                const newRow = _createTableRow(toDoItem);
                tableArr.push(newRow)
            });
            return tableArr;
        };
        const homeListTable = createElementClass("table", "todo-table");
        homeListTable.appendChild(_createTableHeaders("ToDo", "Details", "Due Date", ""))
        _appendTableData(homeListTable, _createTableData(toDoList));
        return homeListTable;
    };

    function _createUpcomingTable(upcomingDeadlines, includeDescription, isInteractive) {
        includeDescription = includeDescription || false;
        isInteractive = isInteractive || false;

        const _createDeadlineRow = (deadline) => {
            const daysUntilDue = formatDistanceStrict(new Date(), deadline.dueDate, {unit: "day"});

            const deadlineRow = document.createElement("tr");
            deadlineRow.dataset.todoId = deadline.toDoID;
            const deadlineTitle = createElementText("td", deadline.title);
            let deadlineDueDate;

            if (deadline.overdue) {
                deadlineRow.classList.add("overdue")
                deadlineDueDate = createElementText("td", `Overdue: ${daysUntilDue}`);
            } else {
                deadlineDueDate = createElementText("td", daysUntilDue);
            };
            deadlineDueDate.classList.add("date-col");

            if (includeDescription) {
                const deadlineDescription = createElementText("td", deadline.description)
                if (isInteractive) {
                    const interactiveCell = _createInteractiveCell();
                    appendChildren(deadlineRow, deadlineTitle, deadlineDescription, deadlineDueDate, interactiveCell);
                } else {
                    appendChildren(deadlineRow, deadlineTitle, deadlineDescription, deadlineDueDate);
                };
            } else {
                if (isInteractive) {
                    const interactiveCell = _createInteractiveCell();
                    appendChildren(deadlineRow, deadlineTitle, deadlineDueDate, interactiveCell);
                } else {
                    appendChildren(deadlineRow, deadlineTitle, deadlineDueDate);
                };
            }
            
            return deadlineRow
        };

        const deadlinesTable = createElementClass("table", "deadlines-table");
        if (includeDescription) {
            if (isInteractive) {
                deadlinesTable.appendChild(_createTableHeaders("ToDo","Description", "Days Until Due", ""));
            } else {
                deadlinesTable.appendChild(_createTableHeaders("ToDo", "Description", "Days Until Due"));
            };
        } else {
            if (isInteractive) {
                deadlinesTable.appendChild(_createTableHeaders("ToDo","Days Until Due", ""));
            } else {
                deadlinesTable.appendChild(_createTableHeaders("ToDo", "Days Until Due"));
            };
        };

        upcomingDeadlines.forEach(deadline => {
            deadlinesTable.appendChild(_createDeadlineRow(deadline));
        });

        return deadlinesTable;
    };

    function _createCompletedTable(completedData) {
        const _createTableRow = (toDo) => {
            const currentRow = document.createElement("tr");

            const toDoTitle = createElementText("td", toDo.title);
            const toDoDetails = createElementText("td", toDo.description);

            appendChildren(currentRow, toDoTitle, toDoDetails);
            return currentRow;
        };

        const _createTableData = (toDoData) => {
            const tableArr = [];
            toDoData?.forEach(toDoItem => {
                const newRow = _createTableRow(toDoItem);
                tableArr.push(newRow)
            });
            return tableArr;
        };

        const homeListTable = createElementClass("table", "todo-table");
        homeListTable.appendChild(_createTableHeaders("ToDo", "Details"));
        _appendTableData(homeListTable, _createTableData(completedData));
        return homeListTable;
    };

    /* Manipulation functions */

    const _appendToMain = (...elements) => {
        if (!document.querySelector("main")) {
            throw new Error("No 'main' element found");
        } else {
            const main = document.querySelector("main");
            elements.forEach(element => {
                main.appendChild(element);
            })
        };
    };

    const _appendToMainLayout = (...elements) => {
        if (!document.querySelector(".main-layout")) {
            throw new Error("No 'main-layout' element found");
        } else {
            elements.forEach(element => {
                mainLayout.appendChild(element);
            })
        };
    };

    const _initMain = () => {
        const main = document.createElement("main");
        return main;
    };

    const _noDataMessage = (headingMessage, ...paraStrings) => {
        // Pass in strings for an 'h1' element and arbitrary amount of 'p' elements in order to display.
        const noProjectContainer = createElementClass("div", "empty-container");
        const noProjectMessage = document.createElement("div");
        noProjectContainer.appendChild(noProjectMessage);

        const noProjectHeading = createElementText("h1", headingMessage);
        noProjectMessage.appendChild(noProjectHeading);

        paraStrings.forEach(string => {
            noProjectMessage.appendChild(createElementText("p", string));
        });

        return noProjectContainer;
    };

    const _createHeader = () => {
        const header = document.createElement("header");

        const dropLink = createElementClass("a", "drop-link");
        const dropLinkIcon = createElementClass("i", "fa-solid", "fa-bars");
        dropLink.appendChild(dropLinkIcon);

        const headerLogo = createElementText("h1", "You Do ToDo");

        const addItemLink = createElementClass("a", "new-icon");
        const addItemIcon = createElementClass("i", "fa-solid", "fa-plus");
        addItemLink.appendChild(addItemIcon);

        appendChildren(header, dropLink, headerLogo, addItemLink);
        return header;
    };

    const _createNav = () => {
        const nav = document.createElement("nav");

        const homeHeader = document.createElement("h1");
        const homeHeaderLink = createElementText("a", "Home");
        homeHeaderLink.classList.add("home-link");
        homeHeader.appendChild(homeHeaderLink);

        const dateUl = createElementClass("ul", "date-links");
        _createListedLinks(dateUl, ["Upcoming", "Today", "This Week", "This Month"])

        const projectHeader = createElementText("h1", "Projects");
        projectHeader.classList.add("projects-link")
        const projectUl = createElementClass("ul", "project-links");
        _createListedLinks(projectUl, ["New Project", "Project Overview"])

        const extraUl = createElementClass("ul", "extra-links");
        _createListedLinks(extraUl, ["Completed", "Settings", "Contact Us", "About"]);

        appendChildren(nav, homeHeader, dateUl, projectHeader, projectUl, extraUl);
        return nav;  
    };

    const _createHomeList = (todoList) => {

        const homeListContainer = createElementClass("div", "todo-list-home", "todo-table-container");
        const homeListHeader = createElementText("h1", "Your ToDo List");

        const homeListTable = _createTodoTable(todoList)
        const allLink = createElementText("a", "See all");
        if (todoList.length < 1) {
            const noDataMessage = _noDataMessage(
                "Oh No!",
                "You currently have no ToDos",
                "Add a ToDo and begin working towards your goals"
            );
            appendChildren(homeListContainer, homeListHeader, homeListTable,noDataMessage, allLink)
        } else {;
            appendChildren(homeListContainer, homeListHeader, homeListTable, allLink);
        };
        return homeListContainer;
    };

    const _createHomeProjects = (topProjectList) => {

        const homeProjectContainer = createElementClass("div", "project-list-home");
        const homeProjectHeading = createElementText("h1", "Projects");
        if (topProjectList.length < 1) {
            const messageContainer = _noDataMessage(
                "Oh No!",
                "You have no current projects",
                "Create a new project from the sidebar"
            );
            appendChildren(homeProjectContainer, homeProjectHeading, messageContainer);
            return homeProjectContainer;
        };

        const projectGrid = _createProjectGrid(topProjectList);

        const allLink = createElementText("a", "See all");

        appendChildren(homeProjectContainer, homeProjectHeading, projectGrid, allLink);
        return homeProjectContainer;
    };

    const _createHomeDeadlines = (upcomingDeadlines) => {

        const homeDeadlinesContainer = createElementClass("div", "upcoming-deadlines-home");
        const deadlinesTitle = createElementText("h1", "Upcoming Deadlines");
        
        if (upcomingDeadlines.length < 1) {
            const messageContainer = _noDataMessage(
                "Great News",
                "You have no upcoming deadlines",
                "Sit back and relax, or add a new ToDo for this week",
            );
            appendChildren(homeDeadlinesContainer, deadlinesTitle, messageContainer);
            return homeDeadlinesContainer;
        };

        const tableContainer = createElementClass("div", "deadlines-container");
        const deadlinesTable = _createUpcomingTable(upcomingDeadlines);

        tableContainer.appendChild(deadlinesTable);
        appendChildren(homeDeadlinesContainer, deadlinesTitle, tableContainer);
        return homeDeadlinesContainer;
    };

    const _projectHeaderInfo = (project) => {
        const projectInfo = createElementClass("div", "project-header-info");
        
        const projectHeading = createElementText("h1", project.projectTitle);
        const projectDescription = createElementText("p", project.projectDescription);
        const newProjectTodo = createElementClass("i", "fa-solid", "fa-plus", "project-plus");
        const deleteProjectLink = createElementClass("i", "fa-solid", "fa-trash", "project-delete") 
        appendChildren(projectInfo, projectHeading, projectDescription, newProjectTodo, deleteProjectLink);
        return projectInfo;
    };

    const _createSettingsToggle = (currentSettings) => {
        const toggleDiv = createElementClass("div", "toggle-settings-div");
        const toggleHeading = createElementText("h2", "View Mode");
        
        const toggleContainer = createElementClass("div", "toggle-container");
        const toggleBody = createElementClass("label", "toggle-body");
        toggleBody.setAttribute("for", "toggle");
        const toggleInput = document.createElement("input");
        setAttributes(toggleInput, {
            "type": "checkbox",
            "id": "toggle",
        });
        if (currentSettings === "dark") toggleInput.checked = true;
        const slider = createElementClass("div", "slider");

        appendChildren(toggleBody, toggleInput, slider);

        const toggleLabel = createElementText("p", "Toggle view mode");
        appendChildren(toggleContainer, toggleBody, toggleLabel);

        appendChildren(toggleDiv, toggleHeading, toggleContainer);
        return toggleDiv;
    };

    const _createSettingsReset = () => {
        const resetDiv = createElementClass("div", "reset-settings-div");
        const resetHeading = createElementText("h2", "Data Settings");
        const resetPara = createElementText("p", "By choosing to clear your ToDos, all data stored locally will be deleted and you will start with a blank slate. All complete and incomplete ToDos will disappear permanently. This action cannot be undone.")
        const clearButton = createElementText("button", "Reset Data");
        setAttributes(clearButton, {
            "class": "clear-button",
            "type": "button",
        });
        appendChildren(resetDiv, resetHeading,resetPara, clearButton)
        return resetDiv;
    };

    /* Functions to return */

    const initDashboard = () => {
        appendChildren(
            body, 
            _createHeader(),
            _initMain(),
        );
        _appendToMain(_createNav(), mainLayout);
    };

    const initHomepage = (toDoList, upcomingProjects, upcomingDeadlines) => {

        toDoList = toDoList || null;
        upcomingProjects = upcomingProjects || null;
        upcomingDeadlines = upcomingDeadlines || null;

        _appendToMainLayout(
            _createHomeList(toDoList),
            _createHomeProjects(upcomingProjects),
            _createHomeDeadlines(upcomingDeadlines),
        );
    };

    const removeMainLayout = () => {
        const mainList = document.querySelectorAll(".main-layout > div");
        if (!mainList) return console.log("No main element found");
        mainList.forEach(div => {
            div.remove();
        });
    };

    function showTodoPage(todoData) {
        const todoContainer = createElementClass("div", "all-todos-container", "todo-table-container");
        const todoHeading = createElementText("h1", "All ToDos");
        if (todoData.length > 0) {
            const todoTable = _createTodoTable(todoData);
            appendChildren(todoContainer, todoHeading, todoTable);
        } else {
            const noDataMessage = _noDataMessage(
                "Oh No!",
                "You currently have no ToDos",
                "Add a ToDo and begin working towards your goals"
            );
            appendChildren(todoContainer, todoHeading, noDataMessage);
        };
        
        _appendToMainLayout(todoContainer);
    };

    function showProjectPage(project) {
        const projectContainer = createElementClass("div", "single-project-container");
        projectContainer.dataset.projectId = project.projectID;

        const projectHeader = createElementClass("div", "project-header");

        const projectImage = createElementClass("div", "project-header-image")
        if (project.projectImage) projectImage.style.backgroundImage = `url('${project.projectImage}')`;
        const projectInfo = _projectHeaderInfo(project);

        appendChildren(projectHeader, projectImage, projectInfo);
        if (project.projectToDos?.length > 0) {
            const projectTable = _createTodoTable(project.projectToDos)
            const tableContainer = createElementClass("div", "todo-table-container");

            tableContainer.appendChild(projectTable);
            appendChildren(projectContainer, projectHeader, tableContainer);
        } else {
            const noDataMessage = _noDataMessage(
                "Oh No!",
                "This project does not contain any ToDos",
                "Add a ToDo to this project and work towards your goals"
            );
            appendChildren(projectContainer, projectHeader, noDataMessage);
        };
        
        _appendToMainLayout(projectContainer);
    };

    function showAllProjects(projects) {
        const projectContainer = createElementClass("div", "all-projects-container");
        const projectHeading = createElementText("h1", "All Projects");
        const addProjectLink = createElementClass("i", "fa-solid", "fa-plus");
        if (projects.length < 1) {
            appendChildren(projectContainer,
                addProjectLink,
                projectHeading,
                _noDataMessage(
                    "Oh No!",
                    "You have no current projects",
                    "Create a new project from the sidebar"
                )
            );
        } else {
            appendChildren(projectContainer,
                addProjectLink,
                projectHeading,
                _createProjectGrid(projects)
            );
        };
        _appendToMainLayout(projectContainer);
    };

    function showUpcomingPage(heading, data) {
        const upcomingContainer = createElementClass("div", "all-todos-container");
        const containerHeading = createElementText("h1", heading);
        const table = _createUpcomingTable(data, true, true);
        if (data.length < 1) {
            const message = _noDataMessage("Feeling productive?",
                "Add some ToDos to this time frame");
            appendChildren(upcomingContainer, containerHeading, table, message);
        } else if (data.length < 10) {
            const message = _noDataMessage("Feeling energized?",
                "Add even more ToDos and get cracking!")
                appendChildren(upcomingContainer, containerHeading, table, message);
        } else {
            appendChildren(upcomingContainer, containerHeading, table);
        };
        _appendToMainLayout(upcomingContainer); 
    };

    function showCompletedPage(data) {
        const completedContainer = createElementClass("div", "completed-container");
        const completedHeading = createElementText("h1", "Completed ToDos");
        const table = _createCompletedTable(data);
        appendChildren(completedContainer, completedHeading, table);
        _appendToMainLayout(completedContainer);
    };

    function showSettings(currentSettings) {
        const settingsContainer = createElementClass("div", "settings-container");
        const containerHeading = createElementText("h1", "Settings");
        const toggleContainer = _createSettingsToggle(currentSettings);
        const resetContainer = _createSettingsReset();
        appendChildren(settingsContainer, containerHeading, toggleContainer, resetContainer);
        _appendToMainLayout(settingsContainer);
    };

    function showForm(form) {
        const formBackground = createElementClass("div", "form-background");
        formBackground.appendChild(form);
        _appendToMain(formBackground);
    };

    function removeForm() {
        const formToRemove = document.querySelector(".form-background");
        formToRemove.remove();
    };

    function showAlert(alertString) {
        const alertBackground = createElementClass("div", "alert-background");
        alertBackground.appendChild(_createAlert(alertString));
        _appendToMain(alertBackground);
    };

    function removeAlert() {
        const alertContainer = document.querySelector(".alert-background");
        alertContainer.remove();
    };

    function showConfirm(confirmString) {
        const confirmBackground = createElementClass("div", "confirm-background")
        confirmBackground.appendChild(_createConfirm(confirmString));
        _appendToMain(confirmBackground);
    };

    function removeConfirm() {
        const confirmBackground = document.querySelector(".confirm-background");
        confirmBackground.remove();
    };

    function updateTable(todoList) {
        const container = document.querySelector(".todo-table-container");
        document.querySelector(".todo-table").remove();
        container.appendChild(_createTodoTable(todoList));
    };

    function updateHomeProjects(projectList) {
        const container = document.querySelector(".project-list-home");
        document.querySelector(".project-grid").remove();
        container.appendChild(_createProjectGrid(projectList));
    };

    function updateDeadlines(todoList) {
        const container = document.querySelector(".deadlines-container");
        document.querySelector(".deadlines-table").remove();
        container.appendChild(_createUpcomingTable(todoList, false, false))
    };

    return {
        initDashboard,
        initHomepage,
        updateTable,
        updateDeadlines,
        updateHomeProjects,
        removeMainLayout,

        showTodoPage,
        showProjectPage,
        showAllProjects,
        showUpcomingPage,
        showCompletedPage,
        showSettings,

        showForm,
        removeForm,
        showAlert,
        removeAlert,
        showConfirm,
        removeConfirm,
    };

})();

export { domManipulator };