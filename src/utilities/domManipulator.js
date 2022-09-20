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

        const _createInteractiveCell = (isImportant) => {
            const newCell = document.createElement("td");

            const tick = createElementClass("a", "complete-icon");
            const tickIcon = createElementClass("i", "fa-solid", "fa-check");
            tick.appendChild(tickIcon);

            const star = createElementClass("a", "favorite-icon");
            const starIcon = createElementClass("i", "fa-regular", "fa-star");
            if (isImportant) {
                star.classList.add("is-important")
            };
            star.appendChild(starIcon);

            const edit = createElementClass("a", "edit-icon");
            const editIcon = createElementClass("i", "fa-regular", "fa-pen-to-square");
            edit.appendChild(editIcon);

            const trash = createElementClass("a", "trash-icon");
            const trashIcon = createElementClass("i", "fa-solid", "fa-trash");
            trash.appendChild(trashIcon);

            appendChildren(newCell, tick, star, edit, trash);
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
            const toDoInteractive = _createInteractiveCell(toDo.important);

            if (toDo.overdue) {
                currentRow.classList.add("overdue")
            };

            appendChildren(currentRow, toDoTitle, toDoDetails, toDoDue, toDoInteractive);
            return currentRow;
        };

        const _createTableData = (toDoData) => {
            const tableArr = [];
            toDoData.forEach(toDoItem => {
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
        const projectUl = createElementClass("ul", "project-links");
        _createListedLinks(projectUl, ["New Project", "Project Overview"])

        const extraUl = createElementClass("ul", "extra-links");
        _createListedLinks(extraUl, ["Contact Us", "About"]);

        appendChildren(nav, homeHeader, dateUl, projectHeader, projectUl, extraUl);
        return nav;  
    };

    const _createHomeList = (todoList) => {

        const homeListContainer = createElementClass("div", "todo-list-home", "todo-table-container");
        const homeListHeader = createElementText("h1", "Your ToDo List");

        const homeListTable = _createTodoTable(todoList)

        const allLink = createElementText("a", "See all");

        appendChildren(homeListContainer, homeListHeader, homeListTable, allLink);
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

    function showTodoPage() {

    };

    function showProjectPage(project) {
        const projectContainer = createElementClass("div", "single-project-container");
        const projectHeading = createElementText("h1", project.projectTitle);

        _appendToMainLayout(projectContainer)
    };

    function showAllProjects(projects) {
        const projectContainer = createElementClass("div", "all-projects-container");
        const projectHeading = createElementText("h1", "All Projects");
        if (projects.length < 1) {
            appendChildren(projectContainer,
                projectHeading,
                _noDataMessage(
                    "Oh No!",
                    "You have no current projects",
                    "Create a new project from the sidebar"
                )
            );
        } else {
            appendChildren(projectContainer,
                projectHeading,
                _createProjectGrid(projects)
            );
        };
        _appendToMainLayout(projectContainer);
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
        alertBackground.appendChild(_createAlert(alertString))
        _appendToMain(alertBackground);
    };

    function removeAlert() {
        const alertContainer = document.querySelector(".alert-background");
        alertContainer.remove();
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

        showForm,
        removeForm,
        showAlert,
        removeAlert,
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

    const _createSubmitButton = () => {
        const button = createElementText("button", "Create");
        button.setAttribute("type", "button");
        return button;
    };

    const _createCloseButton = () => {
        return createElementClass("i", "fa-solid", "fa-xmark" , "close-form");
    };

    const createTodoForm = () => {
        const formContainer = createElementClass("div", "form-container");
        const formElement = createElementClass("form", "todo-form");
        const fieldsetElement = document.createElement("fieldset");

        const fieldsetLegend = createElementText("legend", "New ToDo");

        const titleLabel = createElementText("label", "Title");
        titleLabel.setAttribute("for", "title-input");
        const titleInput = document.createElement("input");
        setAttributes(titleInput, {
            "type": "text",
            "name": "title-input",
            "id": "title-input",
            "min": 3,
            "max": 30,
            "required": "",
        });

        const descriptionLabel = createElementText("label", "Description");
        descriptionLabel.setAttribute("for", "description-input");
        const descriptionInput = document.createElement("textarea");
        setAttributes(descriptionInput, {
            "name": "descriptionInput",
            "id": "description-input",
            "cols": 30,
            "rows": 10,
            "max": 200,
            "required": "",
        });

        const dueDateLabel = createElementText("label", "Due Date");
        dueDateLabel.setAttribute("for", "due-date-input");
        const dueDateInput = document.createElement("input");
        setAttributes(dueDateInput, {
            "type": "date",
            "name": "due-date-input",
            "id": "due-date-input",
            "min": _minDateInput(),
            "max": _maxDateInput(),
            "required": "",
        });

        appendChildren(fieldsetElement,
            fieldsetLegend,
            titleLabel,
            titleInput,
            descriptionLabel,
            descriptionInput,
            dueDateLabel,
            dueDateInput,
            _createSubmitButton(),
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

        const titleLabel = createElementText("label", "Project Title");
        titleLabel.setAttribute("for", "project-title-input");
        const titleInput = document.createElement("input");
        setAttributes(titleInput, {
            "type": "text",
            "name": "project-title-input",
            "id": "project-title-input",
            "min": 3,
            "max": 30,
            "required": "",
        }); 

        const descriptionLabel = createElementText("label", "Project Overview");
        descriptionLabel.setAttribute("for", "project-description-input");
        const descriptionInput = document.createElement("textarea");
        setAttributes(descriptionInput, {
            "name": "project-description-input",
            "id": "project-description-input",
            "cols": 30,
            "rows": 10,
            "min": 5,
            "max": 200,
            "required": "",
        });

        const imageLabel = createElementText("label", "Image URL");
        imageLabel.setAttribute("for", "image-input");
        const imageInput = document.createElement("input");
        setAttributes(imageInput, {
            "type": "url",
            "name": "image-input",
            "id": "image-input",
        });

        appendChildren(fieldsetElement,
            fieldsetLegend,
            titleLabel,
            titleInput,
            descriptionLabel,
            descriptionInput,
            imageLabel,
            imageInput,
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
        createProjectForm,
        checkFormValidity
    };

})();

export { domManipulator, formMaster };