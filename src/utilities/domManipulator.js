import { format, formatDistanceStrict, addDays } from 'date-fns';

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

    const _appendTableData = (tableElement, tableRowArr) => {
        tableRowArr.forEach(tableRow => {
            tableElement.appendChild(tableRow);
        });
    };

    function _createTodoTable (toDoList) {

        const _createInteractiveCell = () => {
            const newCell = document.createElement("td");

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

        const _createTableRow = (toDo) => {
            const currentRow = document.createElement("tr");
            currentRow.dataset.todoId = toDo.toDoID;

            const toDoTitle = createElementText("td", toDo.title);
            const toDoDetails = createElementText("td", toDo.description);

            let date = toDo.dueDate.getDate();
            if (date < 10) date = `0${date}`;

            let month = toDo.dueDate.getMonth();
            if (month < 10) month = `0${month}`;

            const toDoDue = createElementText("td", `${date}/${month}/${toDo.dueDate.getFullYear()}`);
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

    function _createDeadlinesTable(upcomingDeadlines) {

        const _createDeadlineRow = (deadline) => {
            const daysUntilDue = formatDistanceStrict(new Date(), deadline.dueDate, {unit: "day"});

            const deadlineRow = document.createElement("tr");
            const deadlineTitle = createElementText("td", deadline.title);
            let deadlineDueDate;

            if (deadline.overdue) {
                deadlineRow.classList.add("overdue")
                deadlineDueDate = createElementText("td", `Overdue: ${daysUntilDue}`);
            } else {
                deadlineDueDate = createElementText("td", daysUntilDue);
            };

            appendChildren(deadlineRow, deadlineTitle, deadlineDueDate);
            return deadlineRow
        };

        const deadlinesTable = createElementClass("table", "deadlines-table");
        deadlinesTable.appendChild(_createTableHeaders("ToDo", "Days Until Due"));
        upcomingDeadlines.forEach(deadline => {
            deadlinesTable.appendChild(_createDeadlineRow(deadline));
        });

        return deadlinesTable;
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
        const deadlinesTable = _createDeadlinesTable(upcomingDeadlines);

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
        const table = _createDeadlinesTable(data);
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

    function showSettings(currentSettings) {
        const settingsContainer = createElementClass("div", "settings-container");
        const containerHeading = createElementText("h1", "Settings");
        // Light and dark mode toggle
        const clearButton = createElementText("button", "Clear ToDos");
        setAttributes(clearButton, {
            "class": "clear-button",
            "type": "button",
        });
        appendChildren(settingsContainer, containerHeading, clearButton);
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
        container.appendChild(_createDeadlinesTable(todoList))
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
        showSettings,

        showForm,
        removeForm,
        showAlert,
        removeAlert,
        showConfirm,
        removeConfirm,
    };

})();


// ********************************************* //
// **************** Form Master **************** //
// ********************************************* //

const formMaster = (() => {

    const _minDateInput = () => {
        return format(new Date(), "yyyy-MM-dd");
    };

    const _maxDateInput = () => {
        return format(addDays(new Date(), 730), "yyyy-MM-dd")
    };

    const _createSubmitButton = (projectId) => {
        projectId = projectId || null;
        const button = createElementText("button", "Create");
        button.setAttribute("type", "button");
        if (projectId) button.dataset.projectToLink = projectId;
        return button;
    };

    const _createCloseButton = () => {
        return createElementClass("i", "fa-solid", "fa-xmark" , "close-form");
    };

    const _createTitleInput = (titleId, currentTitle) => {
        currentTitle = currentTitle || null;

        const titleLabel = createElementText("label", "Title");
        titleLabel.setAttribute("for", titleId);
        const titleInput = document.createElement("input");
        setAttributes(titleInput, {
            "type": "text",
            "name": titleId,
            "id": titleId,
            "min": 3,
            "max": 30,
            "required": "",
        });
        if (currentTitle) titleInput.textContent = currentTitle;
        return [titleLabel, titleInput];
    };

    const _createDescriptionInput = (descriptionId, currentDescription) => {
        currentDescription = currentDescription || null;

        const descriptionLabel = createElementText("label", "Description");
        descriptionLabel.setAttribute("for", descriptionId);
        const descriptionInput = document.createElement("textarea");
        setAttributes(descriptionInput, {
            "name": descriptionId,
            "id": descriptionId,
            "cols": 30,
            "rows": 10,
            "max": 200,
            "required": "",
        });
        if (currentDescription) descriptionInput.textContent = currentDescription;
        return [descriptionLabel, descriptionInput];
    };

    const _createDueInput = (dueDateId, currentDueDate) => {
        currentDueDate = currentDueDate || null;

        const dueDateLabel = createElementText("label", "Due Date");
        dueDateLabel.setAttribute("for", dueDateId);
        const dueDateInput = document.createElement("input");
        setAttributes(dueDateInput, {
            "type": "date",
            "name": dueDateId,
            "id": dueDateId,
            "min": _minDateInput(),
            "max": _maxDateInput(),
            "required": "",
        });
        if (currentDueDate) dueDateInput.value = currentDueDate;
        return [dueDateLabel, dueDateInput];
    };

    const _createImageInput = (imageInputId, currentImageUrl) => {
        currentImageUrl = currentImageUrl || null;

        const imageLabel = createElementText("label", "Image URL");
        imageLabel.setAttribute("for", imageInputId);
        const imageInput = document.createElement("input");
        setAttributes(imageInput, {
            "type": "url",
            "name": imageInputId,
            "id": imageInputId,
            "placeholder": "[Optional]"
        });
        if (currentImageUrl) imageInput.textContent = currentImageUrl;
        return [imageLabel, imageInput];
    };

    const createTodoForm = (projectToLink) => {
        projectToLink = projectToLink || null;
        
        const formContainer = createElementClass("div", "form-container");
        const formElement = createElementClass("form", "todo-form");
        const fieldsetElement = document.createElement("fieldset");

        const fieldsetLegend = createElementText("legend", "New ToDo");

        const titleArr = _createTitleInput("title-input");
        const descriptionArr = _createDescriptionInput("description-input");
        const dueDateArr = _createDueInput("due-date-input");

        appendChildren(fieldsetElement,
            fieldsetLegend,
            titleArr[0],
            titleArr[1],
            descriptionArr[0],
            descriptionArr[1],
            dueDateArr[0],
            dueDateArr[1],
            _createSubmitButton(projectToLink),
        );

        formElement.appendChild(fieldsetElement);
        appendChildren(formContainer,
            formElement,
            _createCloseButton());
        return formContainer;
    };

    const createProjectForm = () => {
        const formContainer = createElementClass("div", "form-container")
        const formElement = createElementClass("form", "project-form");
        const fieldsetElement = document.createElement("fieldset");

        const fieldsetLegend = createElementText("legend", "New Project");

        const titleArr = _createTitleInput("project-title-input");
        const descriptionArr = _createDescriptionInput("project-description-input");
        const imageArr = _createImageInput("image-input");

        appendChildren(fieldsetElement,
            fieldsetLegend,
            titleArr[0],
            titleArr[1],
            descriptionArr[0],
            descriptionArr[1],
            imageArr[0],
            imageArr[1],
            _createSubmitButton(),
        );

        formElement.appendChild(fieldsetElement);
        appendChildren(formContainer,
            formElement,
            _createCloseButton());
        return formContainer;
    };

    function editTodoForm(previousTitle, previousDescription, previousDueDate, projectToLink) {
        projectToLink = projectToLink || null;
        
        const formContainer = createElementClass("div", "form-container");
        const formElement = createElementClass("form", "todo-form");
        const fieldsetElement = document.createElement("fieldset");

        const fieldsetLegend = createElementText("legend", "Edit ToDo");

        const titleArr = _createTitleInput("title-input", previousTitle);
        const descriptionArr = _createDescriptionInput("description-input", previousDescription);
        const dueDateArr = _createDueInput("due-date-input", previousDueDate);

        appendChildren(fieldsetElement,
            fieldsetLegend,
            titleArr[0],
            titleArr[1],
            descriptionArr[0],
            descriptionArr[1],
            dueDateArr[0],
            dueDateArr[1],
            _createSubmitButton(projectToLink),
        );

        formElement.appendChild(fieldsetElement);
        appendChildren(formContainer,
            formElement,
            _createCloseButton());
        return formContainer;
    };

    function editProjectForm(previousTitle, previousDescription, previousImageURL) {
        previousImageURL = previousImageURL || null;

        const formContainer = createElementClass("div", "form-container")
        const formElement = createElementClass("form", "project-form");
        const fieldsetElement = document.createElement("fieldset");

        const fieldsetLegend = createElementText("legend", "Edit Project");

        const titleArr = _createTitleInput("project-title-input", previousTitle);
        const descriptionArr = _createDescriptionInput("project-description-input", previousDescription);
        const imageArr = _createImageInput("image-input", previousImageURL);  
        
        appendChildren(fieldsetElement,
            fieldsetLegend,
            titleArr[0],
            titleArr[1],
            descriptionArr[0],
            descriptionArr[1],
            imageArr[0],
            imageArr[1],
            _createSubmitButton(),
        );

        formElement.appendChild(fieldsetElement);
        appendChildren(formContainer,
            formElement,
            _createCloseButton());
        return formContainer;
    };

    function checkFormValidity(formType) {
        if (formType === "todo") {
            const titleInput = document.querySelector("#title-input");
            const descriptionInput = document.querySelector("#description-input");
            const dueDateInput = document.querySelector("#due-date-input");

            if (!titleInput.checkValidity()) {
                return "Please input a valid title"
            } else if (!descriptionInput.checkValidity()) {
                return "Please input a valid description"
            } else if (!dueDateInput.checkValidity()) {
                return "Please choose a date within the next two years"
            } else return true;
        };

        if (formType === "project") {
            const projectTitleInput = document.querySelector("#project-title-input");
            const projectDescriptionInput = document.querySelector("#project-description-input");

            if (!projectTitleInput.checkValidity()) {
                return "Please input a valid project title"
            } else if (!projectDescriptionInput.checkValidity()) {
                return "Please input a valid description"
            } else return true;
        };
    };

    return {
        createTodoForm,
        editTodoForm,
        createProjectForm,
        editProjectForm,
        checkFormValidity
    };

})();

export { domManipulator, formMaster };