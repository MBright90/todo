import { formatDistanceStrict } from 'date-fns';
import { domUtils } from "./domUtils.js";

// *********** Overarching utility functions ************* //

// ********************************************* //
// ************** Dom Manipulator ************** //
// ********************************************* //

const domManipulator = (() => {

    const body = document.body;
    const mainLayout = domUtils.createElementClass("div", "main-layout");

    /* Utility functions */

    function  _createListedLinks(listContainer, linkArr) {
        linkArr.forEach(link => {
            const li = document.createElement("li");
            const liLink = domUtils.createElementText("a", link);
            li.appendChild(liLink)
            listContainer.appendChild(li);
        });
    };

    const _createProjectCard = (project) => {
        const projectCard = domUtils.createElementClass("div", "project-card");
        projectCard.dataset.projectId = project.projectID;
        
        const projectImage = domUtils.createElementClass("div", "project-image");
        if (project.projectImage) {
            projectImage.style.backgroundImage = `url('${project.projectImage}')`;
        };

        const projectTitle = domUtils.createElementClass("div", "project-title");
        projectTitle.textContent = project.projectTitle;

        const projectDescription = domUtils.createElementClass("div", "project-description");
        projectDescription.textContent = project.projectDescription;

        domUtils.appendChildren(projectCard, projectImage, projectTitle, projectDescription);
        return projectCard;
    };

    const _createProjectGrid = (projects) => {
        const projectGrid = domUtils.createElementClass("div", "project-grid");
        projects.forEach(project => {
            projectGrid.appendChild(_createProjectCard(project));
        });
        return projectGrid;
    }

    function _createAlert(alertString) {
        const alertContainer = domUtils.createElementClass("div", "alert-container");
        const alertPara = domUtils.createElementText("p", alertString);
        const confirmButton = domUtils.createElementText("button", "Ok");
        domUtils.appendChildren(alertContainer, alertPara, confirmButton)
        return alertContainer;
    };

    function _createConfirm(confirmString) {
        const confirmContainer = domUtils.createElementClass("div", "confirm-container");
        const confirmPara = domUtils.createElementText("p", confirmString);
        const continuePara = domUtils.createElementText("p", "Are you sure you would like to continue?")
        const buttonContainer = domUtils.createElementClass("div", "confirm-buttons");
        const confirmButton = domUtils.createElementText("button", "Continue");
        const cancelButton = domUtils.createElementText("button", "Cancel");

        domUtils.appendChildren(buttonContainer, confirmButton, cancelButton);
        domUtils.appendChildren(confirmContainer, confirmPara, continuePara, buttonContainer);
        return confirmContainer;
    };

    /* Table functions */

    const _createTableHeaders = (...headers) => {
        const tableHeaders = document.createElement("tr");
        headers.forEach(heading => {
            const headingCell = domUtils.createElementText("th", heading);
            tableHeaders.appendChild(headingCell);
        });
        return tableHeaders
    };

    const _createInteractiveCell = () => {
        const newCell = domUtils.createElementClass("td", "interactive");

        const tick = domUtils.createElementClass("a", "complete-icon");
        const tickIcon = domUtils.createElementClass("i", "fa-solid", "fa-check");
        tick.appendChild(tickIcon);

        const edit = domUtils.createElementClass("a", "edit-icon");
        const editIcon = domUtils.createElementClass("i", "fa-regular", "fa-pen-to-square");
        edit.appendChild(editIcon);

        const trash = domUtils.createElementClass("a", "trash-icon");
        const trashIcon = domUtils.createElementClass("i", "fa-solid", "fa-trash");
        trash.appendChild(trashIcon);

        domUtils.appendChildren(newCell, tick, edit, trash);
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

            const toDoTitle = domUtils.createElementText("td", toDo.title);
            const toDoDetails = domUtils.createElementText("td", toDo.description);

            let date = toDo.dueDate.getDate();
            if (date < 10) date = `0${date}`;

            let month = toDo.dueDate.getMonth() + 1;
            if (month < 10) month = `0${month}`;

            const toDoDue = domUtils.createElementText("td", `${date}/${month}/${toDo.dueDate.getFullYear()}`);
            toDoDue.classList.add("date-col");
            const toDoInteractive = _createInteractiveCell();

            if (toDo.overdue) {
                currentRow.classList.add("overdue")
            };

            domUtils.appendChildren(currentRow, toDoTitle, toDoDetails, toDoDue, toDoInteractive);
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
        const homeListTable = domUtils.createElementClass("table", "todo-table");
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
            const deadlineTitle = domUtils.createElementText("td", deadline.title);
            let deadlineDueDate;

            if (deadline.overdue) {
                deadlineRow.classList.add("overdue")
                deadlineDueDate = domUtils.createElementText("td", `Overdue: ${daysUntilDue}`);
            } else {
                deadlineDueDate = domUtils.createElementText("td", daysUntilDue);
            };
            deadlineDueDate.classList.add("date-col");

            if (includeDescription) {
                const deadlineDescription = domUtils.createElementText("td", deadline.description)
                if (isInteractive) {
                    const interactiveCell = _createInteractiveCell();
                    domUtils.appendChildren(deadlineRow, deadlineTitle, deadlineDescription, deadlineDueDate, interactiveCell);
                } else {
                    domUtils.appendChildren(deadlineRow, deadlineTitle, deadlineDescription, deadlineDueDate);
                };
            } else {
                if (isInteractive) {
                    const interactiveCell = _createInteractiveCell();
                    domUtils.appendChildren(deadlineRow, deadlineTitle, deadlineDueDate, interactiveCell);
                } else {
                    domUtils.appendChildren(deadlineRow, deadlineTitle, deadlineDueDate);
                };
            }
            
            return deadlineRow
        };

        const deadlinesTable = domUtils.createElementClass("table", "deadlines-table");
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

            const toDoTitle = domUtils.createElementText("td", toDo.title);
            const toDoDetails = domUtils.createElementText("td", toDo.description);

            domUtils.appendChildren(currentRow, toDoTitle, toDoDetails);
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

        const homeListTable = domUtils.createElementClass("table", "todo-table");
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
        const noProjectContainer = domUtils.createElementClass("div", "empty-container");
        const noProjectMessage = document.createElement("div");
        noProjectContainer.appendChild(noProjectMessage);

        const noProjectHeading = domUtils.createElementText("h1", headingMessage);
        noProjectMessage.appendChild(noProjectHeading);

        paraStrings.forEach(string => {
            noProjectMessage.appendChild(domUtils.createElementText("p", string));
        });

        return noProjectContainer;
    };

    const _createHeader = () => {
        const header = document.createElement("header");

        const dropLink = domUtils.createElementClass("a", "drop-link");
        const dropLinkIcon = domUtils.createElementClass("i", "fa-solid", "fa-bars");
        dropLink.appendChild(dropLinkIcon);

        const headerLogo = domUtils.createElementText("h1", "You Do ToDo");

        const addItemLink = domUtils.createElementClass("a", "new-icon");
        const addItemIcon = domUtils.createElementClass("i", "fa-solid", "fa-plus");
        addItemLink.appendChild(addItemIcon);

        domUtils.appendChildren(header, dropLink, headerLogo, addItemLink);
        return header;
    };

    const _createNav = () => {
        const nav = document.createElement("nav");

        const homeHeader = document.createElement("h1");
        const homeHeaderLink = domUtils.createElementText("a", "Home");
        homeHeaderLink.classList.add("home-link");
        homeHeader.appendChild(homeHeaderLink);

        const dateUl = domUtils.createElementClass("ul", "date-links");
        _createListedLinks(dateUl, ["Upcoming", "Today", "This Week", "This Month"])

        const projectHeader = domUtils.createElementText("h1", "Projects");
        projectHeader.classList.add("projects-link")
        const projectUl = domUtils.createElementClass("ul", "project-links");
        _createListedLinks(projectUl, ["New Project", "Project Overview"])

        const extraUl = domUtils.createElementClass("ul", "extra-links");
        _createListedLinks(extraUl, ["Completed", "Settings", "Contact Us", "About"]);

        domUtils.appendChildren(nav, homeHeader, dateUl, projectHeader, projectUl, extraUl);
        return nav;  
    };

    const _createHomeList = (todoList) => {

        const homeListContainer = domUtils.createElementClass("div", "todo-list-home", "todo-table-container");
        const homeListHeader = domUtils.createElementText("h1", "Your ToDo List");

        const homeListTable = _createTodoTable(todoList)
        const allLink = domUtils.createElementText("a", "See all");
        if (todoList.length < 1) {
            const noDataMessage = _noDataMessage(
                "Oh No!",
                "You currently have no ToDos",
                "Add a ToDo and begin working towards your goals"
            );
            domUtils.appendChildren(homeListContainer, homeListHeader, homeListTable,noDataMessage, allLink)
        } else {;
            domUtils.appendChildren(homeListContainer, homeListHeader, homeListTable, allLink);
        };
        return homeListContainer;
    };

    const _createHomeProjects = (topProjectList) => {

        const homeProjectContainer = domUtils.createElementClass("div", "project-list-home");
        const homeProjectHeading = domUtils.createElementText("h1", "Projects");
        if (topProjectList.length < 1) {
            const messageContainer = _noDataMessage(
                "Oh No!",
                "You have no current projects",
                "Create a new project from the sidebar"
            );
            domUtils.appendChildren(homeProjectContainer, homeProjectHeading, messageContainer);
            return homeProjectContainer;
        };

        const projectGrid = _createProjectGrid(topProjectList);

        const allLink = domUtils.createElementText("a", "See all");

        domUtils.appendChildren(homeProjectContainer, homeProjectHeading, projectGrid, allLink);
        return homeProjectContainer;
    };

    const _createHomeDeadlines = (upcomingDeadlines) => {

        const homeDeadlinesContainer = domUtils.createElementClass("div", "upcoming-deadlines-home");
        const deadlinesTitle = domUtils.createElementText("h1", "Upcoming Deadlines");
        
        if (upcomingDeadlines.length < 1) {
            const messageContainer = _noDataMessage(
                "Great News",
                "You have no upcoming deadlines",
                "Sit back and relax, or add a new ToDo for this week",
            );
            domUtils.appendChildren(homeDeadlinesContainer, deadlinesTitle, messageContainer);
            return homeDeadlinesContainer;
        };

        const tableContainer = domUtils.createElementClass("div", "deadlines-container");
        const deadlinesTable = _createUpcomingTable(upcomingDeadlines);

        tableContainer.appendChild(deadlinesTable);
        domUtils.appendChildren(homeDeadlinesContainer, deadlinesTitle, tableContainer);
        return homeDeadlinesContainer;
    };

    const _projectHeaderInfo = (project) => {
        const projectInfo = domUtils.createElementClass("div", "project-header-info");
        
        const projectHeading = domUtils.createElementText("h1", project.projectTitle);
        const projectDescription = domUtils.createElementText("p", project.projectDescription);
        const newProjectTodo = domUtils.createElementClass("i", "fa-solid", "fa-plus", "project-plus");
        const deleteProjectLink = domUtils.createElementClass("i", "fa-solid", "fa-trash", "project-delete") 
        domUtils.appendChildren(projectInfo, projectHeading, projectDescription, newProjectTodo, deleteProjectLink);
        return projectInfo;
    };

    const _createSettingsToggle = (currentSettings) => {
        const toggleDiv = domUtils.createElementClass("div", "toggle-settings-div");
        const toggleHeading = domUtils.createElementText("h2", "View Mode");
        
        const toggleContainer = domUtils.createElementClass("div", "toggle-container");
        const toggleBody = domUtils.createElementClass("label", "toggle-body");
        toggleBody.setAttribute("for", "toggle");
        const toggleInput = document.createElement("input");
        domUtils.setAttributes(toggleInput, {
            "type": "checkbox",
            "id": "toggle",
        });
        if (currentSettings === "dark") toggleInput.checked = true;
        const slider = domUtils.createElementClass("div", "slider");

        domUtils.appendChildren(toggleBody, toggleInput, slider);

        const toggleLabel = domUtils.createElementText("p", "Toggle view mode");
        domUtils.appendChildren(toggleContainer, toggleBody, toggleLabel);

        domUtils.appendChildren(toggleDiv, toggleHeading, toggleContainer);
        return toggleDiv;
    };

    const _createSettingsReset = () => {
        const resetDiv = domUtils.createElementClass("div", "reset-settings-div");
        const resetHeading = domUtils.createElementText("h2", "Data Settings");
        const resetPara = domUtils.createElementText("p", "By choosing to clear your ToDos, all data stored locally will be deleted and you will start with a blank slate. All complete and incomplete ToDos will disappear permanently. This action cannot be undone.")
        const clearButton = domUtils.createElementText("button", "Reset Data");
        domUtils.setAttributes(clearButton, {
            "class": "clear-button",
            "type": "button",
        });
        domUtils.appendChildren(resetDiv, resetHeading,resetPara, clearButton)
        return resetDiv;
    };

    /* Functions to return */

    const initDashboard = () => {
        domUtils.appendChildren(
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
        const todoContainer = domUtils.createElementClass("div", "all-todos-container", "todo-table-container");
        const todoHeading = domUtils.createElementText("h1", "All ToDos");
        if (todoData.length > 0) {
            const todoTable = _createTodoTable(todoData);
            domUtils.appendChildren(todoContainer, todoHeading, todoTable);
        } else {
            const noDataMessage = _noDataMessage(
                "Oh No!",
                "You currently have no ToDos",
                "Add a ToDo and begin working towards your goals"
            );
            domUtils.appendChildren(todoContainer, todoHeading, noDataMessage);
        };
        
        _appendToMainLayout(todoContainer);
    };

    function showProjectPage(project) {
        const projectContainer = domUtils.createElementClass("div", "single-project-container");
        projectContainer.dataset.projectId = project.projectID;

        const projectHeader = domUtils.createElementClass("div", "project-header");

        const projectImage = domUtils.createElementClass("div", "project-header-image")
        if (project.projectImage) projectImage.style.backgroundImage = `url('${project.projectImage}')`;
        const projectInfo = _projectHeaderInfo(project);

        domUtils.appendChildren(projectHeader, projectImage, projectInfo);
        if (project.projectToDos?.length > 0) {
            const projectTable = _createTodoTable(project.projectToDos)
            const tableContainer = domUtils.createElementClass("div", "todo-table-container");

            tableContainer.appendChild(projectTable);
            domUtils.appendChildren(projectContainer, projectHeader, tableContainer);
        } else {
            const noDataMessage = _noDataMessage(
                "Oh No!",
                "This project does not contain any ToDos",
                "Add a ToDo to this project and work towards your goals"
            );
            domUtils.appendChildren(projectContainer, projectHeader, noDataMessage);
        };
        
        _appendToMainLayout(projectContainer);
    };

    function showAllProjects(projects) {
        const projectContainer = domUtils.createElementClass("div", "all-projects-container");
        const projectHeading = domUtils.createElementText("h1", "All Projects");
        const addProjectLink = domUtils.createElementClass("i", "fa-solid", "fa-plus");
        if (projects.length < 1) {
            domUtils.appendChildren(projectContainer,
                addProjectLink,
                projectHeading,
                _noDataMessage(
                    "Oh No!",
                    "You have no current projects",
                    "Create a new project from the sidebar"
                )
            );
        } else {
            domUtils.appendChildren(projectContainer,
                addProjectLink,
                projectHeading,
                _createProjectGrid(projects)
            );
        };
        _appendToMainLayout(projectContainer);
    };

    function showUpcomingPage(heading, data) {
        const upcomingContainer = domUtils.createElementClass("div", "all-todos-container");
        const containerHeading = domUtils.createElementText("h1", heading);
        const table = _createUpcomingTable(data, true, true);
        if (data.length < 1) {
            const message = _noDataMessage("Feeling productive?",
                "Add some ToDos to this time frame");
                domUtils.appendChildren(upcomingContainer, containerHeading, table, message);
        } else if (data.length < 10) {
            const message = _noDataMessage("Feeling energized?",
                "Add even more ToDos and get cracking!")
                domUtils.appendChildren(upcomingContainer, containerHeading, table, message);
        } else {
            domUtils.appendChildren(upcomingContainer, containerHeading, table);
        };
        _appendToMainLayout(upcomingContainer); 
    };

    function showCompletedPage(data) {
        const completedContainer = domUtils.createElementClass("div", "completed-container");
        const completedHeading = domUtils.createElementText("h1", "Completed ToDos");
        const table = _createCompletedTable(data);
        domUtils.appendChildren(completedContainer, completedHeading, table);
        _appendToMainLayout(completedContainer);
    };

    function showSettings(currentSettings) {
        const settingsContainer = domUtils.createElementClass("div", "settings-container");
        const containerHeading = domUtils.createElementText("h1", "Settings");
        const toggleContainer = _createSettingsToggle(currentSettings);
        const resetContainer = _createSettingsReset();
        domUtils.appendChildren(settingsContainer, containerHeading, toggleContainer, resetContainer);
        _appendToMainLayout(settingsContainer);
    };

    function showForm(form) {
        const formBackground = domUtils.createElementClass("div", "form-background");
        formBackground.appendChild(form);
        _appendToMain(formBackground);
    };

    function removeForm() {
        const formToRemove = document.querySelector(".form-background");
        formToRemove.remove();
    };

    function showAlert(alertString) {
        const alertBackground = domUtils.createElementClass("div", "alert-background");
        alertBackground.appendChild(_createAlert(alertString));
        _appendToMain(alertBackground);
    };

    function removeAlert() {
        const alertContainer = document.querySelector(".alert-background");
        alertContainer.remove();
    };

    function showConfirm(confirmString) {
        const confirmBackground = domUtils.createElementClass("div", "confirm-background")
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