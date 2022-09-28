// ********************************************* //
// **************** Form Master **************** //
// ********************************************* //

const formMaster = (() => {

    const _minDateInput = () => {
        return format(new Date(), "yyyy-MM-dd");
    };

    const _maxDateInput = () => {
        return format(addDays(new Date(), 730), "yyyy-MM-dd")
    };

    const _createSubmitButton = (projectId) => {
        projectId = projectId || null;
        const button = createElementText("button", "Create");
        button.setAttribute("type", "button");
        if (projectId) button.dataset.projectToLink = projectId;
        return button;
    };

    const _createCloseButton = () => {
        return createElementClass("i", "fa-solid", "fa-xmark" , "close-form");
    };

    const _createTitleInput = (titleId, currentTitle) => {
        currentTitle = currentTitle || null;

        const titleLabel = createElementText("label", "Title");
        titleLabel.setAttribute("for", titleId);
        const titleInput = document.createElement("input");
        setAttributes(titleInput, {
            "type": "text",
            "name": titleId,
            "id": titleId,
            "min": 3,
            "max": 30,
            "required": "",
        });
        if (currentTitle) titleInput.textContent = currentTitle;
        return [titleLabel, titleInput];
    };

    const _createDescriptionInput = (descriptionId, currentDescription) => {
        currentDescription = currentDescription || null;

        const descriptionLabel = createElementText("label", "Description");
        descriptionLabel.setAttribute("for", descriptionId);
        const descriptionInput = document.createElement("textarea");
        setAttributes(descriptionInput, {
            "name": descriptionId,
            "id": descriptionId,
            "cols": 30,
            "rows": 10,
            "max": 200,
            "required": "",
        });
        if (currentDescription) descriptionInput.textContent = currentDescription;
        return [descriptionLabel, descriptionInput];
    };

    const _createDueInput = (dueDateId, currentDueDate) => {
        currentDueDate = currentDueDate || null;

        const dueDateLabel = createElementText("label", "Due Date");
        dueDateLabel.setAttribute("for", dueDateId);
        const dueDateInput = document.createElement("input");
        setAttributes(dueDateInput, {
            "type": "date",
            "name": dueDateId,
            "id": dueDateId,
            "min": _minDateInput(),
            "max": _maxDateInput(),
            "required": "",
        });
        if (currentDueDate) dueDateInput.value = currentDueDate;
        return [dueDateLabel, dueDateInput];
    };

    const _createImageInput = (imageInputId, currentImageUrl) => {
        currentImageUrl = currentImageUrl || null;

        const imageLabel = createElementText("label", "Image URL");
        imageLabel.setAttribute("for", imageInputId);
        const imageInput = document.createElement("input");
        setAttributes(imageInput, {
            "type": "url",
            "name": imageInputId,
            "id": imageInputId,
            "placeholder": "[Optional]"
        });
        if (currentImageUrl) imageInput.textContent = currentImageUrl;
        return [imageLabel, imageInput];
    };

    const createTodoForm = (projectToLink) => {
        projectToLink = projectToLink || null;
        
        const formContainer = createElementClass("div", "form-container");
        const formElement = createElementClass("form", "todo-form");
        const fieldsetElement = document.createElement("fieldset");

        const fieldsetLegend = createElementText("legend", "New ToDo");

        const titleArr = _createTitleInput("title-input");
        const descriptionArr = _createDescriptionInput("description-input");
        const dueDateArr = _createDueInput("due-date-input");

        appendChildren(fieldsetElement,
            fieldsetLegend,
            titleArr[0],
            titleArr[1],
            descriptionArr[0],
            descriptionArr[1],
            dueDateArr[0],
            dueDateArr[1],
            _createSubmitButton(projectToLink),
        );

        formElement.appendChild(fieldsetElement);
        appendChildren(formContainer,
            formElement,
            _createCloseButton());
        return formContainer;
    };

    const createProjectForm = () => {
        const formContainer = createElementClass("div", "form-container")
        const formElement = createElementClass("form", "project-form");
        const fieldsetElement = document.createElement("fieldset");

        const fieldsetLegend = createElementText("legend", "New Project");

        const titleArr = _createTitleInput("project-title-input");
        const descriptionArr = _createDescriptionInput("project-description-input");
        const imageArr = _createImageInput("image-input");

        appendChildren(fieldsetElement,
            fieldsetLegend,
            titleArr[0],
            titleArr[1],
            descriptionArr[0],
            descriptionArr[1],
            imageArr[0],
            imageArr[1],
            _createSubmitButton(),
        );

        formElement.appendChild(fieldsetElement);
        appendChildren(formContainer,
            formElement,
            _createCloseButton());
        return formContainer;
    };

    function editTodoForm(previousTitle, previousDescription, previousDueDate, projectToLink) {
        projectToLink = projectToLink || null;
        
        const formContainer = createElementClass("div", "form-container");
        const formElement = createElementClass("form", "todo-form");
        const fieldsetElement = document.createElement("fieldset");

        const fieldsetLegend = createElementText("legend", "Edit ToDo");

        const titleArr = _createTitleInput("title-input", previousTitle);
        const descriptionArr = _createDescriptionInput("description-input", previousDescription);
        const dueDateArr = _createDueInput("due-date-input", previousDueDate);

        appendChildren(fieldsetElement,
            fieldsetLegend,
            titleArr[0],
            titleArr[1],
            descriptionArr[0],
            descriptionArr[1],
            dueDateArr[0],
            dueDateArr[1],
            _createSubmitButton(projectToLink),
        );

        formElement.appendChild(fieldsetElement);
        appendChildren(formContainer,
            formElement,
            _createCloseButton());
        return formContainer;
    };

    function editProjectForm(previousTitle, previousDescription, previousImageURL) {
        previousImageURL = previousImageURL || null;

        const formContainer = createElementClass("div", "form-container")
        const formElement = createElementClass("form", "project-form");
        const fieldsetElement = document.createElement("fieldset");

        const fieldsetLegend = createElementText("legend", "Edit Project");

        const titleArr = _createTitleInput("project-title-input", previousTitle);
        const descriptionArr = _createDescriptionInput("project-description-input", previousDescription);
        const imageArr = _createImageInput("image-input", previousImageURL);  
        
        appendChildren(fieldsetElement,
            fieldsetLegend,
            titleArr[0],
            titleArr[1],
            descriptionArr[0],
            descriptionArr[1],
            imageArr[0],
            imageArr[1],
            _createSubmitButton(),
        );

        formElement.appendChild(fieldsetElement);
        appendChildren(formContainer,
            formElement,
            _createCloseButton());
        return formContainer;
    };

    function checkFormValidity(formType) {
        if (formType === "todo") {
            const titleInput = document.querySelector("#title-input");
            const descriptionInput = document.querySelector("#description-input");
            const dueDateInput = document.querySelector("#due-date-input");

            if (!titleInput.checkValidity()) {
                return "Please input a valid title"
            } else if (!descriptionInput.checkValidity()) {
                return "Please input a valid description"
            } else if (!dueDateInput.checkValidity()) {
                return "Please choose a date within the next two years"
            } else return true;
        };

        if (formType === "project") {
            const projectTitleInput = document.querySelector("#project-title-input");
            const projectDescriptionInput = document.querySelector("#project-description-input");

            if (!projectTitleInput.checkValidity()) {
                return "Please input a valid project title"
            } else if (!projectDescriptionInput.checkValidity()) {
                return "Please input a valid description"
            } else return true;
        };
    };

    function createContactForm() {
        const formContainer = createElementClass("div", "form-container");
        const formElement = createElementClass("form", "contact-form");
        const fieldsetElement = document.createElement("fieldset");

        const fieldsetLegend = createElementText("legend", "Contact Us");

        const fromLabel = createElementText("label", "From");
        fromLabel.setAttribute("for", "from-input");
        const fromInput = document.createElement("input");
        setAttributes(fromInput, {
            "type": "text",
            "name": "from-input",
            "id": "from-input",
            "min": 5,
            "max": 100,
            "required": "",
        });

        const subjectLabel = createElementText("label", "Subject");
        subjectLabel.setAttribute("for", "subject-input");
        const subjectInput = document.createElement("input");
        setAttributes(subjectInput, {
            "type": "text",
            "name": "subject-input",
            "id": "subject-input",
            "min": 5,
            "max": 50,
            "required": "",
        });

        const messageLabel = createElementText("label", "Message");
        messageLabel.setAttribute("for", "message-input");
        const messageInput = document.createElement("textarea");
        setAttributes(messageInput, {
            "name": "message-input",
            "id": "message-input",
            "min": 5,
            "max": 100,
            "cols": 30,
            "rows": 15,
            "required": "",
        });

        const sendButton = _createSubmitButton();
        sendButton.textContent = "Send";

        appendChildren(fieldsetElement,
            fieldsetLegend,
            fromLabel,
            fromInput,
            subjectLabel,
            subjectInput,
            messageLabel,
            messageInput,
            sendButton);
        formElement.appendChild(fieldsetElement);
        appendChildren(formContainer,
            formElement,
            _createCloseButton());
        return formContainer;
    };

    return {
        createTodoForm,
        editTodoForm,
        createProjectForm,
        editProjectForm,
        checkFormValidity,
        createContactForm,
    };

})();

export { formMaster } 