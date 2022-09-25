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

    function _addConfirmListeners() {
        const buttonList = document.querySelectorAll(".confirm-buttons > button");
        buttonList[0].addEventListener("click", () => {
            data.deleteData(document.querySelector(".single-project-container").dataset.projectId);
            dom.removeConfirm();
            showDashboard();
        });
        buttonList[1].addEventListener("click", () => {
            dom.removeConfirm();
        });
    };

    function _createAlert(alertString) {
        dom.showAlert(alertString);
        _addAlertListener();
    };

    function _createConfirm(confirmString) {
        dom.showConfirm(confirmString);
        _addConfirmListeners();
    };

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
        _interactiveCellListeners();
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
        _interactiveCellListeners();
    };

    function showAllTodos(todoData) {
        dom.removeMainLayout();
        dom.showTodoPage(todoData);
    };

    function showUpcoming(heading, daysDifference) {
        const requestedData = data.retrieveDeadlines(daysDifference);
        dom.removeMainLayout();
        dom.showUpcomingPage(heading, requestedData);
    };

    function showSettings() {
        dom.removeMainLayout();
        dom.showSettings();
        _createSettingsListeners();
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
                        showDashboard();
                    };
                } else {
                    _createAlert(validityCheck)
                };
            } else if (e.composedPath()[2].classList.contains("project-form")) {
                validityCheck = forms.checkFormValidity("project");
                if (validityCheck === true) {
                    data.parseNewProject();
                    dom.removeForm();
                    showProjects();
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
            let idToDelete;
            if (document.querySelector(".single-project-container")) {
                _createConfirm("This will permanently delete your project including all ToDos linked to it");
            };
        });
    };

    const _createHomeLink = (element) => {
        element.addEventListener("click", showDashboard)
    };

    const _createTimeLinks = (linkList, ...args) => {
        for (let i = 0; i < linkList.length; i++) {
            linkList[i].addEventListener("click", () => {
                showUpcoming(linkList[i].textContent, args[i])
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
        if (element) {
            element.addEventListener("click", showProjects);
        }
    };

    function _createProjectLinksGroup(linkList) {
            _createProjectLink(linkList[0]);
            _showProjectsLink(linkList[1]);
        };

    function _showTodosLink(element, data) {
        element.addEventListener("click", () => {
            showAllTodos(data);
        });
    };

    function _showSettingsLink(element) {
        element.addEventListener("click", showSettings);
    };

    function _siteInfoListeners(elementList) {
        console.log(elementList);
        _showSettingsLink(elementList[1]);
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

    function _createSiteDeleteLink(element) {
        element.addEventListener("click", data.resetSiteData)
    };

    function _interactiveCellListeners() {

        const _addEditListeners = () => {
            const editIconList = document.querySelectorAll(".edit-icon");
            editIconList.forEach(icon => {
                icon.addEventListener("click", (e) => {
                    console.log(e.composedPath()[3].dataset.todoId);
                });
            });
        };

        const _addDeleteListeners = () => {
            const deleteIconList = document.querySelectorAll(".trash-icon");
            deleteIconList.forEach(icon => {
                icon.addEventListener("click", (e) => {
                    console.log(e.composedPath()[3].dataset.todoId);
                });
            });
        };

        const _addCompleteListeners = () => {
            const completeIconList = document.querySelectorAll(".complete-icon");
            completeIconList.forEach(icon => {
                icon.addEventListener("click", (e) => {
                    _createAlert("Congratulations");
                    console.log(e.composedPath()[3].dataset.todoId);
                });
            }); 
        };

        _addEditListeners();
        _addDeleteListeners();
        _addCompleteListeners()
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
        _createTimeLinks(document.querySelectorAll(".date-links li a"), 730, 1, 7, 31);
        _createProjectLinksGroup(document.querySelectorAll(".project-links li a"));
        _siteInfoListeners(document.querySelectorAll(".extra-links a"));
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

    function _createSettingsListeners() {
        _createSiteDeleteLink(document.querySelector(".clear-button"));
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
        _interactiveCellListeners();
        _seeAllLinks();
    };

    // Functions to return

    return {
        createHomepage: createHomepage,
    };

})();

export { pageInterface };