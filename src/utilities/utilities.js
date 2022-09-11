import { domManipulator as dom } from "./domManipulator";

const pageInterface = (() => {

    const createHomepage = () => {

        // Code black to retrieve data //

        dom.initDashboard();
        dom.initHomepage();
    };

    const showDashboard = () => {
        dom.removeCurrentMain();
        dom.initHomepage();
    }

    // const showAllTodos = () => {}
    // const showProjects = () => {}

    // Functions to return

    return {
        createHomepage,
        showDashboard
    }

})();

export { pageInterface };