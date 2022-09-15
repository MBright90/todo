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
    attributes.forEach(key => {
        element.setAttribute(key, attributes[key])
    });
};

// ********************************************* //
// ************** Dom Manipulator ************** //
// ********************************************* //

const domManipulator = (() => {

    const body = document.body;
    const mainLayout = createElementClass("div", "main-layout")

    /* Utility functions */

    function  _createListedLinks(listContainer, linkArr) {
        linkArr.forEach(link => {
            const li = document.createElement("li");
            const liLink = createElementText("a", link);
            li.appendChild(liLink)
            listContainer.appendChild(li);
        });
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

    const _createHomeList = (toDoList) => {

        const _createInteractiveCell = (isImportant) => {
            const newCell = document.createElement("td");

            const tick = document.createElement("a");
            const tickIcon = createElementClass("i", "fa-solid", "fa-check");
            tick.appendChild(tickIcon);

            const star = document.createElement("a");
            const starIcon = createElementClass("i", "fa-regular", "fa-star");
            if (isImportant) {
                star.classList.add("is-important")
            };
            star.appendChild(starIcon);

            const edit = document.createElement("a");
            const editIcon = createElementClass("i", "fa-regular", "fa-pen-to-square");
            edit.appendChild(editIcon);

            const trash = document.createElement("a");
            const trashIcon = createElementClass("i", "fa-solid", "fa-trash");
            trash.appendChild(trashIcon);

            appendChildren(newCell, tick, star, edit, trash);
            return newCell;
        };

        const _createListRow = (toDo) => {
            const currentRow = document.createElement("tr");

            const toDoTitle = createElementText("td", toDo.title);
            const toDoDetails = createElementText("td", toDo.description);
            const toDoDue = createElementText("td", `${toDo.dueDate.getDate()}/${toDo.dueDate.getMonth() + 1}/${toDo.dueDate.getFullYear()}`);
            const toDoInteractive = _createInteractiveCell(toDo.important);

            if (toDo.overdue) {
                currentRow.classList.add("overdue")
            };

            appendChildren(currentRow, toDoTitle, toDoDetails, toDoDue, toDoInteractive);
            return currentRow;
        };

        const _createTableData = (toDoData) => {
            //Check length of object here
            const tableArr = [];
            toDoData.forEach(toDoItem => {
                const newRow = _createListRow(toDoItem);
                tableArr.push(newRow)
            });
            return tableArr;
        }; // Could be unnecessary here? Data manipulation should be done by another module

        const homeListContainer = createElementClass("div", "todo-list-home");
        const homeListHeader = createElementText("h1", "Your ToDo List");

        const homeListTable = document.createElement("table");
        homeListTable.appendChild(_createTableHeaders("ToDo", "Details", "Due Date", ""))
        _appendTableData(homeListTable, _createTableData(toDoList));

        const allLink = createElementText("a", "See all");

        appendChildren(homeListContainer, homeListHeader, homeListTable, allLink);
        return homeListContainer;
    };

    const _createHomeProjects = (topProjectList) => {
        const _createProjectCard = (project) => {
            const projectCard = createElementClass("div", "project-card");
            
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

        const homeProjectContainer = createElementClass("div", "project-list-home");
        if (!topProjectList) {
            const messageContainer = _noDataMessage(
                "Oh No!",
                "You have no current projects",
                "Create a new project from the sidebar"
            );
            homeProjectContainer.appendChild(messageContainer);
            return homeProjectContainer;
        };

        const homeProjectHeading = createElementText("h1", "Projects");

        const projectGrid = createElementClass("div", "project-grid");
        topProjectList.forEach(project => {
            projectGrid.appendChild(_createProjectCard(project));
        });

        const allLink = createElementText("a", "See all");

        appendChildren(homeProjectContainer, homeProjectHeading, projectGrid, allLink);
        return homeProjectContainer;
    };

    const _createHomeDeadlines = (upcomingDeadlines) => {

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

        const homeDeadlinesContainer = createElementClass("div", "upcoming-deadlines-home");
        const tableContainer = createElementClass("div", "deadlines-container");

        if (!upcomingDeadlines) {
            const messageContainer = _noDataMessage(
                "Great News",
                "You have no upcoming deadlines",
                "Sit back and relax, or add a new ToDo for this week",
            );
            homeDeadlinesContainer.appendChild(messageContainer);
            return homeDeadlinesContainer;
        };

        const deadlinesTitle = createElementText("h1", "Upcoming Deadlines");

        const deadlinesTable = document.createElement("table");
        deadlinesTable.appendChild(_createTableHeaders("ToDo", "Days Until Due"));
        upcomingDeadlines.forEach(deadline => {
            deadlinesTable.appendChild(_createDeadlineRow(deadline));
        });

        appendChildren(tableContainer, deadlinesTitle, deadlinesTable);
        homeDeadlinesContainer.appendChild(tableContainer);
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

    const removeCurrentMain = () => {
        const main = document.querySelector("main");
        if (!main) return console.log("No main element found");
        main.remove();
    };

    return {
        initDashboard,
        initHomepage,
        removeCurrentMain
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

    const createTodoForm = () => {
        const formElement = createElementClass("form", "todoForm");
        const fieldsetElement = document.createElement("fieldset");

        const fieldsetLegend = createElementText("legend", "New ToDo");

        const titleLabel = createElementText("label", "Title");
        titleLabel.setAttribute("for", "title-input");
        const titleInput = document.createElement("input");
        setAttributes(titleInput, {
            "type": "text",
            "name": "title-input",
            "id": "title-input",
            "max": 50,
        });

        const descriptionLabel = createElementText("label", "Description");
        descriptionLabel.setAttribute("for", "description-input");
        const descriptionInput = document.createElement("textarea");
        setAttributes(descriptionInput, {
            "name": "descriptionInput",
            "id": "description-input",
            "max": 200,
        });

        const dueDateLabel = createElementText("label", "Due Date");
        dueDateLabel.setAttribute("for", "due-date-input");
        const dueDateInput = document.createElement("input");
        setAttributes(dueDateInput, {
            "type": "date",
            "id": "due-date-input",
            "min": _minDateInput(),
            "max": _maxDateInput(),
        });

        appendChildren(fieldsetElement,
            fieldsetLegend,
            titleLabel,
            titleInput,
            descriptionLabel,
            descriptionInput,
            dueDateLabel,
            dueDateInput,
        );

        formElement.appendChild(fieldsetElement);
        return formElement;
    };

    return {
        createTodoForm,
        newProjectForm
    };

})();

export { domManipulator, formMaster };