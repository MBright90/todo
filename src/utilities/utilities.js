import { domManipulator as dom } from "./domManipulator";


const homeInterface = (() => {

    const createHomePage = () => {

        // Code black to retrieve data //

        dom.initDashboard();
        dom.initHomepage();
    };

})();

export { homeInterface };