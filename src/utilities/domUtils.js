const domUtils = (() => {
  function createElementClass(element, ...args) {
    const newElement = document.createElement(element);
    args.forEach((arg) => {
      newElement.classList.add(arg);
    });
    return newElement;
  }

  function createElementText(element, text) {
    const newElement = document.createElement(element);
    try {
      newElement.textContent = text;
    } catch (err) {
      console.log("No text can be added to this element");
    }
    return newElement;
  }

  function appendChildren(element, ...args) {
    args.forEach((arg) => element.appendChild(arg));
  }

  function setAttributes(element, attributes) {
    Object.keys(attributes).forEach((key) =>
      element.setAttribute(key, attributes[key])
    );
  }

  console.log(typeof setAttributes);

  return {
    createElementClass,
    createElementText,
    appendChildren,
    setAttributes,
  };
})();

export default domUtils;
