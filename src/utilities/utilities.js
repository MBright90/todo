import { domManipulator as dom, formMaster as forms } from "./domManipulator";
import { dataMaster as data } from "./dataMaster.js";

const pageInterface = (() => {

    // ********************************************* //
    // ************** Event Listeners ************** //
    // ********************************************* //

    const _submitFormListener = () => {
        const formButton = document.querySelector("form > fieldset > button");
        formButton.addEventListener("click", (e) => {
            if (e.composedPath()[2].classList.contains('todo-form')) {
                data.parseNewTodo();
            } else if (e.composedPath()[2].classlist.contains('project-form')) {
                data.parseNewProject();
            };
            dom.removeForm();
            dom.updateTable(data.retrieveData("date", 10));
        });
    };

    const _closeFormListener = () => {
        const closeButton = document.querySelector(".form-container > i");
        closeButton.addEventListener("click", () => {
            document.querySelector(".form-background").remove();
        });
    };

    const _createFormListeners = () => {
        _submitFormListener(),
        _closeFormListener()
    };

    const _createDropLink = (aTag) => {
        aTag.addEventListener("click", () => {
            console.log("drop link CLICKED!")
            // Code block to show menu
        });
    };

    const _createAddLink = (aTag) => {
        aTag.addEventListener("click", () => {
            dom.showForm(forms.createTodoForm());
            _createFormListeners();
        });
    };

    const _createTimeLinks = (linkList, ...args) => {
        for (let i = 0; i < linkList.length; i++) {
            linkList[i].addEventListener("click", () => {
                const requestedData = data.retrieveData(args[i]);
                console.log(requestedData);
                // Code block to display requested data
            });
        };
    };

    const _createProjectLink = (aTag) => {
        aTag.addEventListener("click", () => {
            dom.showForm(forms.createProjectForm());
        });
    };

    const _showProjectsLink = (aTag) => {
        aTag.addEventListener("click", () => {
            dom.showProjectsPage();
        });
    };

    const _createProjectLinksGroup = (linkList) => {
        _createProjectLink(linkList[0]);
        _showProjectsLink(linkList[1]);
    };

    // ********************************************* //
    // *********** Event Listener groups *********** //
    // ********************************************* //

    const _addHeaderListeners = () => {
        _createDropLink(document.querySelector(".drop-link"));
        _createAddLink(document.querySelector(".new-icon"));
    };

    const _addSidebarListeners = () => {
        _createTimeLinks(document.querySelectorAll(".date-links li a"), "date", 1, 7, 31);
        _createProjectLinksGroup(document.querySelectorAll(".project-links li a"));
    };

    // ********************************************* //
    // ************** Dom creation IF ************** //
    // ********************************************* //

    const createHomepage = () => {
        dom.initDashboard();
        dom.initHomepage(
            data.retrieveData("date", 10),
            data.retrieveData("projects", 3),
            data.retrieveData("date", 5)
            );
        _addHeaderListeners();
        _addSidebarListeners();
    };

    const showDashboard = () => {
        dom.removeCurrentMain();
        dom.initHomepage();
    };

    const showProjects = () => {

    };

    const showAllTodos = () => {

    };

    // Functions to return

    return {
        createHomepage: createHomepage,
        showDashboard: showDashboard,
        showProjects: showProjects,
        showAllTodos: showAllTodos,
    };

})();

export { pageInterface };