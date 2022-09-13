import { domManipulator as dom } from "./domManipulator";
import { dataMaster as data } from "./dataMaster.js";

const pageInterface = (() => {

    const createHomepage = () => {
        dom.initDashboard();
        dom.initHomepage(
            data.retrieveData("date", 10),
            data.retrieveData("projects", 3),
            data.retrieveData("general", 5)
            );
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