import { domManipulator as dom } from "./domManipulator";
import { dataMaster as data } from "./dataMaster.js";

const pageInterface = (() => {

    // ********************************************* //
    // ************** Event Listeners ************** //
    // ********************************************* //

    const _createDropLink = (aTag) => {
        aTag.addEventListener("click", () => {
            console.log("drop link CLICKED!")
            // Code block to show menu
        });
    };

    const _createAddLink = (aTag) => {
        aTag.addEventListener("click", () => {
            console.log("New link CLICKED!")
            // Code block to show add form
        });
    };


    const _createTimeLinks = (linkList, ...args) => {
        for (let i = 0; i < linkList.length; i++) {
            linkList[i].addEventListener("click", () => {
                const requestedData = data.retrieveData(args[i]);
                console.log(requestedData);
                // Code block to display requested data
            });
        };
    };

    const _addHeaderListeners = () => {
        _createDropLink(document.querySelector(".drop-link"));
        _createAddLink(document.querySelector(".new-icon"));
    };

    const _addSidebarListeners = () => {
        _createTimeLinks(document.querySelectorAll(".date-links li a"), "date", 1, 7, 31);
    }

    // const newListener = (element, action) => {}

    // return {
    //     addHeaderListeners,
    //     addSidebarListeners,
    //     addHomepageListeners,
    //     addProjectsListeners,
    // };

    // ********************************************* //
    // ************** Dom creation IF ************** //
    // ********************************************* //

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