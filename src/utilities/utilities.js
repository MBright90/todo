import { domManipulator as dom, formMaster as forms } from "./domManipulator";
import { dataMaster as data } from "./dataMaster.js";

const pageInterface = (() => {

    // ********************************************* //
    // ******************* Alerts ****************** //
    // ********************************************* //    

    function _addAlertListener() {
        const alertButton = document.querySelector(".alert-container > button");
        alertButton.addEventListener("click", () => {
            dom.removeAlert();
        }, {once: true});
    };

    function _createAlert(alertString) {
        dom.showAlert(alertString);
        _addAlertListener()
    };

    // ********************************************* //
    // ************** Event Listeners ************** //
    // ********************************************* //

    const _submitFormListener = () => {
        const formButton = document.querySelector("form > fieldset > button");
        formButton.addEventListener("click", (e) => {
            let validityCheck;
            if (e.composedPath()[2].classList.contains('todo-form')) {
                validityCheck = forms.checkFormValidity("todo")
                if (validityCheck === true) {
                    data.parseNewTodo();
                    dom.removeForm();
                    dom.updateTable(data.retrieveData("date", 10));
                } else {
                    _createAlert(validityCheck)
                };
            } else if (e.composedPath()[2].classlist.contains('project-form')) {
                validityCheck = forms.checkValidity("project");
                if (validityCheck === true) {
                    data.parseNewProject();
                    dom.removeForm();
                } else {
                    _createAlert(validityCheck);
                };
            };
        });
    };

    const _closeFormListener = () => {
        const closeButton = document.querySelector(".form-container > i");
        closeButton.addEventListener("click", () => {
            document.querySelector(".form-background").remove();
        }, {once: true});
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
            _createFormListeners();
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

    function _addHeaderListeners() {
        _createDropLink(document.querySelector(".drop-link"));
        _createAddLink(document.querySelector(".new-icon"));
    };

    function _addSidebarListeners() {
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