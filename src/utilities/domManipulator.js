const domManipulator = (() => {

    /* Utility functions */

    const _createElementClass = (element, ...args) => {
        const newElement = document.createElement(element);
        args.forEach(arg => {
            newElement.classList.add(arg);
        });
        return newElement;
    };

    const _createElementText = (element, text) => {
        const newElement = document.createElement(element);
        try {
            newElement.textContent = text;
        }
        catch(err) {
            console.log("No text can be added to this element");
        };
        return newElement;
    };

    const _appendChildren = (element, ...args) => {
        args.forEach(child => {
            element.appendChild(child);
        });
    };

    const _createListedLinks = (listContainer, linkArr) => {
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
            const headingCell = _createElementText("th", heading);
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
        };
        const main = document.querySelector("main");
        elements.forEach(element => {
            main.appendChild(element);
        })
    };

    const _initMain = () => {
        const main = document.createElement("main");
        return main;
    };

    const _noDataMessage = (headingMessage, paraStrings) => {
        // Pass in strings for an 'h1' element and arbitrary amount of 'p' elements in order to display.
        const noProjectContainer = _createElementClass("div", "empty-container");
        const noProjectHeading = _createElementText("h1", headingMessage);
        noProjectContainer.appendChild(noProjectHeading);

        paraStrings.forEach(string => {
            noProjectContainer.appendChild(_createElementText("p", string));
        });

        return noProjectContainer;
    };

    const _createHeader = () => {
        const header = document.createElement("header");

        const dropLink = _createElementClass("a", "drop-link");
        const dropLinkIcon = _createElementClass("i", "fa-solid", "fa-bars");
        dropLink.appendChild(dropLinkIcon);

        const headerLogo = _createElementText("h1", "You Do ToDo");

        const addItemLink = createElementClass("a", "new-icon");
        addItemIcon = _createElementClass("i", "fa-solid", "fa-plus");
        addItemLink.appendChild(addItemIcon);

        header.appendChildren(dropLink, headerLogo, addItemLink);
        return header;
    };

    const _createNav = () => {
        const nav = document.createElement("nav");

        const homeHeader = document.createElement("h1");
        const homeHeaderLink = _createElementText("a", "Home");
        homeHeader.appendChild(homeHeaderLink);

        const dateUl = _createElementClass("ul", "date-links");
        _createListedLinks(dateUl, ["Upcoming", "Today", "This Week", "This Month"])

        const projectHeader = _createElementText("h1", "Projects");
        const projectUl = _createElementClass("ul", "project-links");
        _createListedLinks(projectUl, ["New Project", "Project Overview"])

        const extraUl = createElementClass("ul", "extra-links");
        _createListedLinks(extraUl, ["Contact Us", "About"]);

        _appendChildren(nav, homeHeader, dateUl, projectHeader, projectUl, extraUl);
        return nav;  
    };

    const _createHomeList = (toDoList) => {

        const _createInteractiveCell = () => {
            const newCell = document.createElement("td");

            const tick = document.createElement("a");
            const tickIcon = _createElementClass("i", "fa-solid", "fa-check");
            tick.appendChild(tickIcon);

            const star = document.createElement("a");
            const starIcon = _createElementClass("i", "fa-regular", "fa-star");
            star.appendChild(starIcon);

            const edit = document.createElement("a");
            const editIcon = _createElementClass("i", "fa-regular", "fa-pen-to-square");
            edit.appendChild(editIcon);

            const trash = document.createElement("a");
            const trashIcon = _createElementClass("i", "fa-solid", "fa-trash");
            trash.appendChild(trashIcon);

            appendChildren(newCell, tick, star, edit, trash);
            return newCell;
        };

        const _createListRow = (toDo) => {
            const currentRow = document.createElement("tr");

            const toDoTitle = _createElementText("td", toDo.title);
            const toDoDetails = _createElementText("td", toDo.details);
            const toDoDue = _createElementText("td", toDo.dueDate);
            const toDoInteractive = _createInteractiveCell();

            _appendChildren(currentRow, toDoTitle, toDoDetails, toDoDue, toDoInteractive);
            return currentRow;
        };

        const _createTableData = (toDoDatabase) => {
            //Check length of object here
            const tableArr = [];
            toDoDatabase.forEach(toDoItem => {
                const newRow = _createListRow(toDoItem);
                tableArr.push(newRow)
            });
            return tableArr;
        };

        const homeListContainer = _createElementClass("div", "todo-list-home");
        const homeListHeader = _createElementText("h1", "Your ToDo List");

        const homeListTable = document.createElement("table");
        homeListTable.appendChild(_createTableHeaders("ToDo", "Details", "Due Date", ""))
        _appendTableData(homeListTable, _createTableData(toDoList));

        const allLink = _createElementText("a", "See all");

        _appendChildren(homeListContainer, homeListHeader, homeListTable, allLink);
        return homeListContainer;
    };

    const _createHomeProjects = (topProjectList) => {

        const _createGridCard = (project) => {
            const projectCard = _createElementClass("div", "project-card");
            
            const projectImage = _createElementClass("div", "project-image");
            projectImage.style.backgroundImage = `url("${project.imageUrl}")`;
            const projectTitle = _createElementClass("div", "project-title");
            projectTitle.textContent = project.title;
            const projectDescription = _createElementClass("div", "project-description");
            projectDescription.textContent = project.description;

            _appendChildren(projectCard, projectImage, projectTitle, projectDescription);
            return projectCard;
        };

        const homeProjectContainer = _createElementClass("div", "project-list-home");
        if (!topProjectList) {
            const messageContainer = _noDataMessage(
                "Oh No!",
                "You have no current projects",
                "Create a new project from the sidebar"
            );
            homeProjectContainer.appendChild(messageContainer);
            return homeProjectContainer;
        };

        const homeProjectHeading = _createElementText("h1", "Projects");

        const projectGrid = _createElementClass("div", "project-grid");
        topProjectList.forEach(project => {
            projectGrid.appendChild(_createGridCard(project));
        });

        const allLink = _createElementText("a", "See all");

        _appendChildren(homeProjectContainer, homeProjectHeading, projectGrid, allLink);
        return homeProjectContainer;
    };

    const _createHomeDeadlines = (upcomingDeadlines) => {

        const _createDeadlineRow = (deadline) => {
            const deadlineRow = document.createElement("tr");
            const deadlineTitle = _createElementText("td", deadline.title);
            const deadlineDueDate = _createElementText("td", deadline.dueDate);

            _appendChildren(deadlineRow, deadlineTitle, deadlineDueDate);
            return deadlineRow
        };

    };

    /* Functions to return */

    const initDashboard = () => {
        _appendChildren(
            document.body, 
            _createHeader(),
            _createNav(),
            _initMain(),
        );
    };

    const initHomePage = (toDoList, upcomingProjects, upcomingDeadlines) => {
        _appendToMain(
            _createHomeList(toDoList),
            _createHomeProjects(upcomingProjects),
        );
    };

    return (
        initDashboard,
        initHomePage
    );

})();

export {domManipulator};