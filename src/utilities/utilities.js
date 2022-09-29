import { dataMaster as data } from "./dataMaster.js";
import { domManipulator as dom } from "./domManipulator";
import { formMaster as forms } from "./formMaster.js"

const pageInterface = (() => {

    const _setViewMode = () => {
        if (data.checkViewMode() === "dark") {
            document.documentElement.setAttribute("data-view-mode", "dark");
        } else {
            document.documentElement.setAttribute("data-view-mode", "light");
        };
    };

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

    function _addConfirmListeners(dataId) {
        const buttonList = document.querySelectorAll(".confirm-buttons > button");
        buttonList[0].addEventListener("click", () => {
            data.deleteData(dataId);
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

    function _createConfirm(confirmString, dataId) {
        dom.showConfirm(confirmString);
        _addConfirmListeners(dataId);
    };

    // ********************************************* //
    // *************** Page Navigation ************* //
    // ********************************************* //   

    function showDashboard() {
        dom.removeMainLayout();
        dom.initHomepage(
            data.retrieveData("date", 10),
            data.retrieveData("projects", 3),
            data.retrieveDeadlines(7)
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
        _interactiveCellListeners();
    };

    function showCompleted() {
        dom.removeMainLayout()
        dom.showCompletedPage(data.retrieveData("completed"));
    };

    function showSettings() {
        dom.removeMainLayout();
        dom.showSettings(data.checkViewMode());
        _createSettingsListeners();
    };

    // ********************************************* //
    // ************** Event Listeners ************** //
    // ********************************************* //

    const _submitNewFormListener = () => {
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
            } else if (e.composedPath()[2].classList.contains("contact-form")) {
                dom.removeForm();
            };
        });
    };

    const _submitEditFormListeners = (dataId) => {
        const formButton = document.querySelector("form > fieldset > button");
        formButton.addEventListener("click", (e) => {
            let validityCheck;
            if (e.composedPath()[2].classList.contains("todo-form")) {
                validityCheck = forms.checkFormValidity("todo")
                if (validityCheck === true) {
                    data.parseEditTodo(dataId);
                    dom.removeForm();
                    dom.removeMainLayout()
                    if (document.querySelector(".single-project-container")) {
                        const selectedProject = document.querySelector(".single-project-container").dataset.projectId;
                        dom.showProjectPage(selectedProject);
                    } else {
                        showDashboard()
                    }
                } else {
                    _createAlert(validityCheck)
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
            _createNewFormListeners();
        });
    };

    const _createDeleteLink = (element) => {
        element.addEventListener("click", (e) => {
            let dataId;
            if (document.querySelector(".single-project-container")) {
                dataId = document.querySelector(".single-project-container").dataset.projectId;
                _createConfirm("This will permanently delete your project including all ToDos linked to it", dataId);
            } else {
                dataId = e.composedPath()[3].dataset.todoId;
                _createConfirm("This will permanently delete this todo", dataId);
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
            _createNewFormListeners();
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

    function _showCompletedLink(element) {
        element.addEventListener("click", showCompleted);
    }

    function _showSettingsLink(element) {
        element.addEventListener("click", showSettings);
    };

    function _createContactLink(element) {
        element.addEventListener("click", () => {
            dom.showForm(forms.createContactForm());
            _createNewFormListeners();
        });
    };

    function _siteInfoListeners(elementList) {
        _showCompletedLink(elementList[0]);
        _showSettingsLink(elementList[1]);
        _createContactLink(elementList[2]);
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

    function _createToggleListener(element) {
        const switchViewMode = (e) => {
            if (e.target.checked) {
                document.documentElement.setAttribute("data-view-mode", "dark");
            } else {
                document.documentElement.setAttribute("data-view-mode", "light");
            }
        }
        element.addEventListener("change", (e) => {
            switchViewMode(e);
            data.saveViewMode(document.documentElement.dataset.viewMode);
        });
    };

    function _createSiteDeleteLink(element) {
        element.addEventListener("click", () => {
            data.resetSiteData();
            showDashboard();
        });
    };

    function _interactiveCellListeners() {

        const _addEditListeners = () => {
            const editIconList = document.querySelectorAll(".edit-icon");
            editIconList.forEach(icon => {
                icon.addEventListener("click", (e) => {
                    const todo = data.retrieveSingleTodo(e.composedPath()[3].dataset.todoId);
                    console.log(todo)
                    dom.showForm(forms.editTodoForm(todo));
                    _submitEditFormListeners(e.composedPath()[3].dataset.todoId);
                    _closeFormListener();
                });
            });
        };

        const _addDeleteListeners = () => {
            const deleteIconList = document.querySelectorAll(".trash-icon");
            deleteIconList.forEach(icon => {
                _createDeleteLink(icon);
            });
        };

        const _addCompleteListeners = () => {
            const completeIconList = document.querySelectorAll(".complete-icon");
            completeIconList.forEach(icon => {
                icon.addEventListener("click", (e) => {
                    _createAlert("Congratulations");
                    data.setComplete(e.composedPath()[3].dataset.todoId);
                    data.deleteData(e.composedPath()[3].dataset.todoId);
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

    function _createNewFormListeners() {
        _submitNewFormListener(),
        _closeFormListener()
    };

    function _createSettingsListeners() {
        _createToggleListener(document.querySelector("input[type=checkbox]"));
        _createSiteDeleteLink(document.querySelector(".clear-button"));
    };

    // ********************************************* //
    // ******* Dom creation return functions ******* //
    // ********************************************* //

    const createHomepage = () => {
        _setViewMode();
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