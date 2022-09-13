import { domManipulator as dom } from "./domManipulator";
import { dataMaster as data } from "./dataMaster.js";

const pageInterface = (() => {

    const createHomepage = () => {

        // Code black to retrieve data //

        dom.initDashboard();
        dom.initHomepage(
            data.retrieveData("general"),
            data.retrieveData("projects"),
            data.retrieveData("date"));
    };

    const showDashboard = () => {
        dom.removeCurrentMain();
        dom.initHomepage();
    };

    // const showAllTodos = () => {}
    // const showProjects = () => {}

    // Functions to return

    return {
        createHomepage: createHomepage,
        showDashboard: showDashboard,
    };

})();

export { pageInterface };