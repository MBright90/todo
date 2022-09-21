import { domManipulator as dom, formMaster as forms } from "./domManipulator";
import { dataMaster as data } from "./dataMaster.js";

const pageInterface = (() => {

    const _findIdStep = (nodeList) => {
        let identifier;
        nodeList.slice(0, 2).forEach(node => {
            if (node.classList.contains("project-card")) {
                identifier = node.dataset.projectId;
            };
        }); 
        return identifier || console.log("No project ID found");
    };

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
        _addAlertListener();
    };

    // function _createConfirm(confirmString) {
    //     dom.showConfirm(confirmString);
    //     _addConfirmListeners();
    // };

    // ********************************************* //
    // *************** Page Navigation ************* //
    // ********************************************* //   

    function showDashboard() {
        dom.removeMainLayout();
        dom.initHomepage(
            data.retrieveData("date", 10),
            data.retrieveData("projects", 3),
            data.retrieveData("date", 5)
        );
        _ProjectCardLinks();
        _seeAllLinks();
    };

    function showProjects() {
        dom.removeMainLayout();
        dom.showAllProjects(data.retrieveData("projects"));
        _ProjectCardLinks();
        _createProjectLink(document.querySelector(".all-projects-container > .fa-plus"));
    };

    function showSingleProject(projectId) {
        const selectedProject = data.retrieveSingleProject(projectId);
        dom.removeMainLayout();
        dom.showProjectPage(selectedProject);
        _projectManipulationLinks();
    };

    function showAllTodos(todoData) {
        dom.removeMainLayout();
        dom.showTodoPage(todoData);
    };

    // ********************************************* //
    // ************** Event Listeners ************** //
    // ********************************************* //

    const _submitFormListener = () => {
        const formButton = document.querySelector("form > fieldset > button");
        formButton.addEventListener("click", (e) => {
            let validityCheck;
            if (e.composedPath()[2].classList.contains("todo-form")) {
                validityCheck = forms.checkFormValidity("todo")
                if (validityCheck === true) {
                    if (e.target.dataset.projectToLink) {
                        data.parseNewTodo(e.target.dataset.projectToLink);
                        dom.removeForm();
                        const selectedProject = data.retrieveSingleProject(e.target.dataset.projectToLink);
                        dom.removeMainLayout()
                        dom.showProjectPage(selectedProject);
                    } else {
                        data.parseNewTodo();
                        dom.removeForm();
                        dom.updateTable(data.retrieveData("date", 10));
                    };
                } else {
                    _createAlert(validityCheck)
                };
            } else if (e.composedPath()[2].classList.contains("project-form")) {
                validityCheck = forms.checkFormValidity("project");
                if (validityCheck === true) {
                    data.parseNewProject();
                    dom.removeForm();
                    dom.updateHomeProjects(data.retrieveData("projects", 3))
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

    const _createDropLink = (element) => {
        element.addEventListener("click", () => {
            console.log("drop link CLICKED!")
            // Code block to show menu
        });
    };

    const _createAddLink = (element) => {
        element.addEventListener("click", () => {
            let project;
            if (document.querySelector(".single-project-container")) {
                project = document.querySelector(".single-project-container").dataset.projectId;
            };
            dom.showForm(forms.createTodoForm(project));
            _createFormListeners();
        });
    };

    const _createDeleteLink = (element) => {
        element.addEventListener("click", (e) => {
            console.log("To delete")
            let idToDelete;
            if (document.querySelector(".single-project-container")) {
                data.deleteData(document.querySelector(".single-project-container").dataset.projectId);
                showDashboard();
            };
        });
    };

    const _createHomeLink = (element) => {
        element.addEventListener("click", showDashboard)
    };

    const _createTimeLinks = (linkList, ...args) => {
        for (let i = 0; i < linkList.length; i++) {
            linkList[i].addEventListener("click", () => {
                const requestedData = data.retrieveData(args[i]);
                // Code block to display requested data
            });
        };
    };

    const _createProjectLink = (element) => {
        element.addEventListener("click", (e) => {
            dom.showForm(forms.createProjectForm());
            _createFormListeners();
        });
    };

    const _showProjectsLink = (element) => {
        element.addEventListener("click", showProjects);
    };

    function _showTodosLink(element, data) {
        element.addEventListener("click", () => {
            showAllTodos(data);
        });
    };

    function _createProjectLinksGroup(linkList) {
        _createProjectLink(linkList[0]);
        _showProjectsLink(linkList[1]);
    };

    function _singleProjectLink (element) {
        element.addEventListener("click", (e) => {
            const projectId = _findIdStep(e.composedPath());
            showSingleProject(projectId);
        });
    };

    function _seeAllLinks() {
        _showProjectsLink(document.querySelector(".project-list-home a"));
        _showTodosLink(document.querySelector(".todo-list-home > a"), data.retrieveData("date"));
    };

    // ********************************************* //
    // *********** Event Listener groups *********** //
    // ********************************************* //

    function _addHeaderListeners() {
        _createDropLink(document.querySelector(".drop-link"));
        _createAddLink(document.querySelector(".new-icon"));
    };

    function _addSidebarListeners() {
        _createHomeLink(document.querySelector(".home-link"));
        _showProjectsLink(document.querySelector(".projects-link"));
        _createTimeLinks(document.querySelectorAll(".date-links li a"), "date", 1, 7, 31);
        _createProjectLinksGroup(document.querySelectorAll(".project-links li a"));
    };

    function _ProjectCardLinks() {
        document.querySelectorAll(".project-card").forEach(card => {
            _singleProjectLink(card);
        });
    };

    function _projectManipulationLinks() {
        _createAddLink(document.querySelector(".project-header-info > .project-plus"));
        _createDeleteLink(document.querySelector((".project-header-info > .project-delete")))
    }

    function _createFormListeners() {
        _submitFormListener(),
        _closeFormListener()
    };

    // ********************************************* //
    // ******* Dom creation return functions ******* //
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
        _ProjectCardLinks();
        _seeAllLinks();
    };

    // Functions to return

    return {
        createHomepage: createHomepage,
    };

})();

export { pageInterface };