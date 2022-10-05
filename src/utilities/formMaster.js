// eslint-disable-next-line import/no-extraneous-dependencies
import { format, addDays } from "date-fns";
import domUtils from "./domUtils";

// ********************************************* //
// **************** Form Master **************** //
// ********************************************* //

const formMaster = (() => {
  const minDateInput = () => format(new Date(), "yyyy-MM-dd");

  const maxDateInput = () => format(addDays(new Date(), 730), "yyyy-MM-dd");

  const createSubmitButton = (projectId) => {
    projectId = projectId || null;
    const button = domUtils.createElementText("button", "Create");
    button.setAttribute("type", "button");
    if (projectId) button.dataset.projectToLink = projectId;
    return button;
  };

  const createCloseButton = () =>
    domUtils.createElementClass("i", "fa-solid", "fa-xmark", "close-form");

  const createTitleInput = (titleId, currentTitle) => {
    currentTitle = currentTitle || null;

    const titleLabel = domUtils.createElementText("label", "Title");
    titleLabel.setAttribute("for", titleId);
    const titleInput = document.createElement("input");
    domUtils.setAttributes(titleInput, {
      type: "text",
      name: titleId,
      id: titleId,
      min: 3,
      max: 30,
      required: "",
    });
    if (currentTitle) titleInput.value = currentTitle;
    return [titleLabel, titleInput];
  };

  const createDescriptionInput = (descriptionId, currentDescription) => {
    currentDescription = currentDescription || null;

    const descriptionLabel = domUtils.createElementText("label", "Description");
    descriptionLabel.setAttribute("for", descriptionId);
    const descriptionInput = document.createElement("textarea");
    domUtils.setAttributes(descriptionInput, {
      name: descriptionId,
      id: descriptionId,
      cols: 30,
      rows: 10,
      max: 200,
      required: "",
    });
    if (currentDescription) descriptionInput.value = currentDescription;
    return [descriptionLabel, descriptionInput];
  };

  const createDueInput = (dueDateId, currentDueDate) => {
    currentDueDate = currentDueDate || null;

    const dueDateLabel = domUtils.createElementText("label", "Due Date");
    dueDateLabel.setAttribute("for", dueDateId);
    const dueDateInput = document.createElement("input");
    domUtils.setAttributes(dueDateInput, {
      type: "date",
      name: dueDateId,
      id: dueDateId,
      min: minDateInput(),
      max: maxDateInput(),
      required: "",
    });
    if (currentDueDate) dueDateInput.valueAsDate = currentDueDate;
    return [dueDateLabel, dueDateInput];
  };

  const createImageInput = (imageInputId, currentImageUrl) => {
    currentImageUrl = currentImageUrl || null;

    const imageLabel = domUtils.createElementText("label", "Image URL");
    imageLabel.setAttribute("for", imageInputId);
    const imageInput = document.createElement("input");
    domUtils.setAttributes(imageInput, {
      type: "url",
      name: imageInputId,
      id: imageInputId,
      placeholder: "[Optional]",
    });
    if (currentImageUrl) imageInput.textContent = currentImageUrl;
    return [imageLabel, imageInput];
  };

  const createTodoForm = (projectToLink) => {
    projectToLink = projectToLink || null;

    const formContainer = domUtils.createElementClass("div", "form-container");
    const formElement = domUtils.createElementClass("form", "todo-form");
    const fieldsetElement = document.createElement("fieldset");

    const fieldsetLegend = domUtils.createElementText("legend", "New ToDo");

    const titleArr = createTitleInput("title-input");
    const descriptionArr = createDescriptionInput("description-input");
    const dueDateArr = createDueInput("due-date-input");

    domUtils.appendChildren(
      fieldsetElement,
      fieldsetLegend,
      titleArr[0],
      titleArr[1],
      descriptionArr[0],
      descriptionArr[1],
      dueDateArr[0],
      dueDateArr[1],
      createSubmitButton(projectToLink)
    );

    formElement.appendChild(fieldsetElement);
    domUtils.appendChildren(formContainer, formElement, createCloseButton());
    return formContainer;
  };

  const createProjectForm = () => {
    const formContainer = domUtils.createElementClass("div", "form-container");
    const formElement = domUtils.createElementClass("form", "project-form");
    const fieldsetElement = document.createElement("fieldset");

    const fieldsetLegend = domUtils.createElementText("legend", "New Project");

    const titleArr = createTitleInput("project-title-input");
    const descriptionArr = createDescriptionInput("project-description-input");
    const imageArr = createImageInput("image-input");

    domUtils.appendChildren(
      fieldsetElement,
      fieldsetLegend,
      titleArr[0],
      titleArr[1],
      descriptionArr[0],
      descriptionArr[1],
      imageArr[0],
      imageArr[1],
      createSubmitButton()
    );

    formElement.appendChild(fieldsetElement);
    domUtils.appendChildren(formContainer, formElement, createCloseButton());
    return formContainer;
  };

  function editTodoForm(todo, projectToLink) {
    projectToLink = projectToLink || null;

    const formContainer = domUtils.createElementClass("div", "form-container");
    const formElement = domUtils.createElementClass("form", "todo-form");
    const fieldsetElement = document.createElement("fieldset");

    const fieldsetLegend = domUtils.createElementText("legend", "Edit ToDo");

    console.log(todo.title);

    const titleArr = createTitleInput("title-input", todo.title);
    const descriptionArr = createDescriptionInput(
      "description-input",
      todo.description
    );
    const dueDateArr = createDueInput("due-date-input", todo.dueDate);

    const editButton = createSubmitButton(projectToLink);
    editButton.textContent = "Edit";

    domUtils.appendChildren(
      fieldsetElement,
      fieldsetLegend,
      titleArr[0],
      titleArr[1],
      descriptionArr[0],
      descriptionArr[1],
      dueDateArr[0],
      dueDateArr[1],
      editButton
    );

    formElement.appendChild(fieldsetElement);
    domUtils.appendChildren(formContainer, formElement, createCloseButton());
    return formContainer;
  }

  function editProjectForm(project) {
    const formContainer = domUtils.createElementClass("div", "form-container");
    const formElement = domUtils.createElementClass("form", "project-form");
    const fieldsetElement = document.createElement("fieldset");

    const fieldsetLegend = domUtils.createElementText("legend", "Edit Project");

    const titleArr = createTitleInput(
      "project-title-input",
      project.projectTitle
    );
    const descriptionArr = createDescriptionInput(
      "project-description-input",
      project.projectDescription
    );
    const imageArr = createImageInput("image-input", project.projectImage);

    domUtils.appendChildren(
      fieldsetElement,
      fieldsetLegend,
      titleArr[0],
      titleArr[1],
      descriptionArr[0],
      descriptionArr[1],
      imageArr[0],
      imageArr[1],
      createSubmitButton()
    );

    formElement.appendChild(fieldsetElement);
    domUtils.appendChildren(formContainer, formElement, createCloseButton());
    return formContainer;
  }

  function checkFormValidity(formType) {
    if (formType === "todo") {
      const titleInput = document.querySelector("#title-input");
      const descriptionInput = document.querySelector("#description-input");
      const dueDateInput = document.querySelector("#due-date-input");

      if (!titleInput.checkValidity()) {
        return "Please input a valid title";
      }
      if (!descriptionInput.checkValidity()) {
        return "Please input a valid description";
      }
      if (!dueDateInput.checkValidity()) {
        return "Please choose a date within the next two years";
      }
      return true;
    }

    const projectTitleInput = document.querySelector("#project-title-input");
    const projectDescriptionInput = document.querySelector(
      "#project-description-input"
    );

    if (!projectTitleInput.checkValidity()) {
      return "Please input a valid project title";
    }
    if (!projectDescriptionInput.checkValidity()) {
      return "Please input a valid description";
    }
    return true;
  }

  function createContactForm() {
    const formContainer = domUtils.createElementClass("div", "form-container");
    const formElement = domUtils.createElementClass("form", "contact-form");
    const fieldsetElement = document.createElement("fieldset");

    const fieldsetLegend = domUtils.createElementText("legend", "Contact Us");

    const fromLabel = domUtils.createElementText("label", "From");
    fromLabel.setAttribute("for", "from-input");
    const fromInput = document.createElement("input");
    domUtils.setAttributes(fromInput, {
      type: "text",
      name: "from-input",
      id: "from-input",
      min: 5,
      max: 100,
      required: "",
    });

    const subjectLabel = domUtils.createElementText("label", "Subject");
    subjectLabel.setAttribute("for", "subject-input");
    const subjectInput = document.createElement("input");
    domUtils.setAttributes(subjectInput, {
      type: "text",
      name: "subject-input",
      id: "subject-input",
      min: 5,
      max: 50,
      required: "",
    });

    const messageLabel = domUtils.createElementText("label", "Message");
    messageLabel.setAttribute("for", "message-input");
    const messageInput = document.createElement("textarea");
    domUtils.setAttributes(messageInput, {
      name: "message-input",
      id: "message-input",
      min: 5,
      max: 100,
      cols: 30,
      rows: 15,
      required: "",
    });

    const sendButton = createSubmitButton();
    sendButton.textContent = "Send";

    domUtils.appendChildren(
      fieldsetElement,
      fieldsetLegend,
      fromLabel,
      fromInput,
      subjectLabel,
      subjectInput,
      messageLabel,
      messageInput,
      sendButton
    );
    formElement.appendChild(fieldsetElement);
    domUtils.appendChildren(formContainer, formElement, createCloseButton());
    return formContainer;
  }

  return {
    createTodoForm,
    editTodoForm,
    createProjectForm,
    editProjectForm,
    checkFormValidity,
    createContactForm,
  };
})();

export default formMaster;
