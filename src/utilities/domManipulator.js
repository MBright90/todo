const domManipulator = (() => {

    /* Utility functions */

    const _createElementClass = (element, ...args) => {
        const newElement = document.createElement(element);
        args.forEach(arg => {
            newElement.classList.add(arg);
        });
        return newElement;
    };

    const _appendChildren = (element, ...args) => {
        args.forEach(child => {
            element.appendChild(child);
        });
    };

    /* Manipulation functions */

    const _appendToBody = (element) => {
        document.body.appendChild(element);
    };

    const _appendToMain = (element) => {
        const main = document.querySelector("main");
        main.appendChild(element);
    };

    const _createHeader = () => {
        const header = document.createElement("header");

        const dropLink = createElementClass("a", "drop-link");
        const dropLinkIcon = createElementClass("i", "fa-solid", "fa-bars");
        dropLink.appendChild(dropLinkIcon);

        const headerLogo = document.createElement("h1");
        headerLogo.textContent = "You Do ToDo";

        const addItemLink = createElementClass("a", "new-icon");
        addItemIcon = createElementClass("i", "fa-solid", "fa-plus");
        addItemLink.appendChild(addItemIcon);

        header.appendChildren(dropLink, headerLogo, addItemLink);
        return header;
    };

    const createMain = () => {
        const main = document.createElement("main");

    }

})();

export {domManipulator};