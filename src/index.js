import './assets/fontawesome-css/all.css'
import "./style/style.css"

import { pageInterface as page } from './utilities/utilities.js'

const events = (() => {

    const newListener = (element, action) => {}

    return {
        addHeaderListeners,
        addSidebarListeners,
        addHomepageListeners,
        addProjectsListeners,
    };

})();

page.createHomepage();

/* ******* 



******* */