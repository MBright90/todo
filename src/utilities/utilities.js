import { domManipulator as dom } from "./domManipulator";


const homeInterface = (() => {

    const createHomepage = () => {

        // Code black to retrieve data //

        dom.initDashboard();
        dom.initHomepage();
    };

    const updateDashboard = () => {
        dom.removeCurrentMain();
        dom.initHomepage();
    }

    // Functions to return

    return {
        createHomepage,
        updateDashboard
    }

})();

export { homeInterface };