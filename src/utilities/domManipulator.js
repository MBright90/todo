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

    /* Manipulation functions */

    const _appendToBody = (element) => {
        document.body.appendChild(element);
    };

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

        const dateUl = createElementClass("ul", "date-links");
        _createListedLinks(dateUl, ["Upcoming", "Today", "This Week", "This Month"])

        const projectHeader = document.createElementText("h1", "Projects");
        const projectUl = createElementClass("ul", "project-links");
        _createListedLinks(projectUl, ["New Project", "Project Overview"])

        const extraUl = createElementClass("ul", "extra-links");
        _createListedLinks(extraUl, ["Contact Us", "About"]);

        appendChildren(nav, homeHeader, dateUl, projectHeader, projectUl, extraUl);
        return nav;  
    };

    const _createHomeList = () => {
        
    }

    /* Functions to return */

    const initDashboard = () => {
        _appendChildren(
            document.body, 
            _createHeader(),
            _createNav(),
        );
    };

    return (
        initDashboard
    );

})();

export {domManipulator};