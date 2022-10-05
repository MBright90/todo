/* eslint-disable no-use-before-define */
import data from "./dataMaster";
import dom from "./domManipulator";
import forms from "./formMaster";

const pageInterface = (() => {
  const setViewMode = () => {
    if (data.checkViewMode() === "dark") {
      document.documentElement.setAttribute("data-view-mode", "dark");
    } else {
      document.documentElement.setAttribute("data-view-mode", "light");
    }
  };

  const findIdStep = (nodeList) => {
    let identifier;
    nodeList.slice(0, 2).forEach((node) => {
      if (node.classList.contains("project-card")) {
        identifier = node.dataset.projectId;
      }
    });
    return identifier || console.log("No project ID found");
  };

  // ********************************************* //
  // ************* Page navigation *************** //
  // ********************************************* //

  function showProjects() {
    dom.removeMainLayout();
    dom.showAllProjects(data.retrieveData("projects"));
  }

  function showSingleProject(projectId) {
    const selectedProject = data.retrieveSingleProject(projectId);
    dom.removeMainLayout();
    dom.showProjectPage(selectedProject);
  }

  function showAllTodos(todoData) {
    dom.removeMainLayout();
    dom.showTodoPage(todoData);
  }

  function showUpcoming(heading, daysDifference) {
    const requestedData = data.retrieveDeadlines(daysDifference);
    dom.removeMainLayout();
    dom.showUpcomingPage(heading, requestedData);
    // interactiveCellListeners();
  }

  function showCompleted() {
    dom.removeMainLayout();
    dom.showCompletedPage(data.retrieveData("completed"));
  }

  function showSettings() {
    dom.removeMainLayout();
    dom.showSettings(data.checkViewMode());
    // createSettingsListeners();
  }

  function showAbout() {
    dom.removeMainLayout();
    dom.showAbout();
  }

  // ********************************************* //
  // ******************* Alerts ****************** //
  // ********************************************* //

  function addAlertListener() {
    const alertButton = document.querySelector(".alert-container > button");
    alertButton.addEventListener(
      "click",
      () => {
        dom.removeAlert();
      },
      { once: true }
    );
  }

  function addConfirmListeners(dataId) {
    const buttonList = document.querySelectorAll(".confirm-buttons > button");
    buttonList[0].addEventListener("click", () => {
      data.deleteData(dataId);
      dom.removeConfirm();
      showDashboard();
    });
    buttonList[1].addEventListener("click", () => {
      dom.removeConfirm();
    });
  }

  function createAlert(alertString) {
    dom.showAlert(alertString);
    addAlertListener();
  }

  function createConfirm(confirmString, dataId) {
    dom.showConfirm(confirmString);
    addConfirmListeners(dataId);
  }

  // ********************************************* //
  // ************** Event Listeners ************** //
  // ********************************************* //

  const createDropLink = (element) => {
    element.addEventListener("click", () => {
      console.log("drop link CLICKED!");
      // Code block to show menu
    });
  };

  const createDeleteLink = (element) => {
    element.addEventListener("click", (e) => {
      let dataId;
      if (e.composedPath()[3].dataset.todoId) {
        dataId = e.composedPath()[3].dataset.todoId;
        createConfirm("This will permanently delete this todo", dataId);
      } else if (document.querySelector(".single-project-container")) {
        dataId = document.querySelector(".single-project-container").dataset
          .projectId;
        createConfirm(
          "This will permanently delete your project including all ToDos linked to it",
          dataId
        );
      }
    });
  };

  const createHomeLink = (element) => {
    element.addEventListener("click", showDashboard);
  };

  const createTimeLinks = (linkList, ...args) => {
    for (let i = 0; i < linkList.length; i += 1) {
      linkList[i].addEventListener("click", () => {
        showUpcoming(linkList[i].textContent, args[i]);
        interactiveCellListeners();
      });
    }
  };

  const createProjectLink = (element) => {
    element.addEventListener("click", () => {
      dom.showForm(forms.createProjectForm());
      createNewFormListeners();
    });
  };

  const showProjectsLink = (element) => {
    if (element) {
      element.addEventListener("click", () => {
        showProjects();
        ProjectCardLinks();
        createProjectLink(
          document.querySelector(".all-projects-container > .fa-plus")
        );
      });
    }
  };

  function createProjectLinksGroup(linkList) {
    createProjectLink(linkList[0]);
    showProjectsLink(linkList[1]);
  }

  function showTodosLink(element, todoData) {
    element.addEventListener("click", () => {
      showAllTodos(todoData);
    });
  }

  function showCompletedLink(element) {
    element.addEventListener("click", showCompleted);
  }

  function showSettingsLink(element) {
    element.addEventListener("click", () => {
      showSettings();
      createSettingsListeners();
    });
  }

  function createContactLink(element) {
    element.addEventListener("click", () => {
      dom.showForm(forms.createContactForm());
      createNewFormListeners();
    });
  }

  function createAboutLink(element) {
    element.addEventListener("click", showAbout);
  }

  function siteInfoListeners(elementList) {
    showCompletedLink(elementList[0]);
    showSettingsLink(elementList[1]);
    createContactLink(elementList[2]);
    createAboutLink(elementList[3]);
  }

  function seeAllLinks() {
    showProjectsLink(document.querySelector(".project-list-home a"));
    showTodosLink(
      document.querySelector(".todo-list-home > a"),
      data.retrieveData("date")
    );
  }

  function createToggleListener(element) {
    const switchViewMode = (e) => {
      if (e.target.checked) {
        document.documentElement.setAttribute("data-view-mode", "dark");
      } else {
        document.documentElement.setAttribute("data-view-mode", "light");
      }
    };
    element.addEventListener("change", (e) => {
      switchViewMode(e);
      data.saveViewMode(document.documentElement.dataset.viewMode);
    });
  }

  function createSiteDeleteLink(element) {
    element.addEventListener("click", () => {
      data.resetSiteData();
      showDashboard();
    });
  }

  function interactiveCellListeners() {
    const addEditListeners = () => {
      const editIconList = document.querySelectorAll(".edit-icon");
      editIconList.forEach((icon) => {
        icon.addEventListener("click", (e) => {
          const todo = data.retrieveSingleTodo(
            e.composedPath()[3].dataset.todoId
          );
          console.log(todo);
          dom.showForm(forms.editTodoForm(todo));
          submitEditFormListeners(e.composedPath()[3].dataset.todoId);
          closeFormListener();
        });
      });
    };

    const addDeleteListeners = () => {
      const deleteIconList = document.querySelectorAll(".trash-icon");
      deleteIconList.forEach((icon) => {
        createDeleteLink(icon);
      });
    };

    const addCompleteListeners = () => {
      const completeIconList = document.querySelectorAll(".complete-icon");
      completeIconList.forEach((icon) => {
        icon.addEventListener("click", (e) => {
          createAlert("Congratulations");
          data.setComplete(e.composedPath()[3].dataset.todoId);
          data.deleteData(e.composedPath()[3].dataset.todoId);
        });
      });
    };

    addEditListeners();
    addDeleteListeners();
    addCompleteListeners();
  }

  const submitNewFormListener = () => {
    const formButton = document.querySelector("form > fieldset > button");
    formButton.addEventListener("click", (e) => {
      let validityCheck;
      if (e.composedPath()[2].classList.contains("todo-form")) {
        validityCheck = forms.checkFormValidity("todo");
        if (validityCheck === true) {
          if (e.target.dataset.projectToLink) {
            data.parseNewTodo(e.target.dataset.projectToLink);
            dom.removeForm();
            const selectedProject = data.retrieveSingleProject(
              e.target.dataset.projectToLink
            );
            dom.removeMainLayout();
            dom.showProjectPage(selectedProject);
            projectManipulationLinks();
            interactiveCellListeners();
          } else {
            data.parseNewTodo();
            dom.removeForm();
            showDashboard();
          }
        } else {
          createAlert(validityCheck);
        }
      } else if (e.composedPath()[2].classList.contains("project-form")) {
        validityCheck = forms.checkFormValidity("project");
        if (validityCheck === true) {
          data.parseNewProject();
          dom.removeForm();
          showProjects();
          ProjectCardLinks();
          createProjectLink(
            document.querySelector(".all-projects-container > .fa-plus")
          );
        } else {
          createAlert(validityCheck);
        }
      } else if (e.composedPath()[2].classList.contains("contact-form")) {
        dom.removeForm();
      }
    });
  };

  const submitEditFormListeners = (dataId) => {
    const formButton = document.querySelector("form > fieldset > button");
    formButton.addEventListener("click", (e) => {
      let validityCheck;
      if (e.composedPath()[2].classList.contains("todo-form")) {
        validityCheck = forms.checkFormValidity("todo");
        if (validityCheck === true) {
          data.parseEditTodo(dataId);
          dom.removeForm();
          dom.removeMainLayout();
          if (document.querySelector(".single-project-container")) {
            const selectedProject = document.querySelector(
              ".single-project-container"
            ).dataset.projectId;
            dom.showProjectPage(selectedProject);
          } else {
            showDashboard();
          }
        } else {
          createAlert(validityCheck);
        }
      }
    });
  };

  const closeFormListener = () => {
    const closeButton = document.querySelector(".form-container > i");
    closeButton.addEventListener(
      "click",
      () => {
        document.querySelector(".form-background").remove();
      },
      { once: true }
    );
  };

  // ********************************************* //
  // *********** Event Listener groups *********** //
  // ********************************************* //

  function createNewFormListeners() {
    submitNewFormListener();
    closeFormListener();
  }

  const createAddLink = (element) => {
    element.addEventListener("click", () => {
      let project;
      if (document.querySelector(".single-project-container")) {
        project = document.querySelector(".single-project-container").dataset
          .projectId;
      }
      dom.showForm(forms.createTodoForm(project));
      createNewFormListeners();
    });
  };

  function addHeaderListeners() {
    createDropLink(document.querySelector(".drop-link"));
    createAddLink(document.querySelector(".new-icon"));
  }

  function addSidebarListeners() {
    createHomeLink(document.querySelector(".home-link"));
    showProjectsLink(document.querySelector(".projects-link"));
    createTimeLinks(
      document.querySelectorAll(".date-links li a"),
      730,
      1,
      7,
      31
    );
    createProjectLinksGroup(document.querySelectorAll(".project-links li a"));
    siteInfoListeners(document.querySelectorAll(".extra-links a"));
  }

  function ProjectCardLinks() {
    document.querySelectorAll(".project-card").forEach((card) => {
      singleProjectLink(card);
    });
  }

  function projectManipulationLinks() {
    createAddLink(
      document.querySelector(".project-header-info > .project-plus")
    );
    createDeleteLink(
      document.querySelector(".project-header-info > .project-delete")
    );
  }

  function createSettingsListeners() {
    createToggleListener(document.querySelector("input[type=checkbox]"));
    createSiteDeleteLink(document.querySelector(".clear-button"));
  }

  function singleProjectLink(element) {
    element.addEventListener("click", (e) => {
      const projectId = findIdStep(e.composedPath());
      showSingleProject(projectId);
      projectManipulationLinks();
      interactiveCellListeners();
    });
  }

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
    ProjectCardLinks();
    interactiveCellListeners();
    seeAllLinks();
  }

  // ********************************************* //
  // ******* Dom creation return functions ******* //
  // ********************************************* //

  const createHomepage = () => {
    setViewMode();
    dom.initDashboard();
    dom.initHomepage(
      data.retrieveData("date", 10),
      data.retrieveData("projects", 3),
      data.retrieveData("date", 5)
    );
    addHeaderListeners();
    addSidebarListeners();
    ProjectCardLinks();
    interactiveCellListeners();
    seeAllLinks();
  };

  // Functions to return

  return {
    createHomepage,
  };
})();

export default pageInterface;
