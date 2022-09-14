const eventMaster = (() => {

    const newListener = (element, action) => {}

    return {
        addHeaderListeners,
        addSidebarListeners,
        addHomepageListeners,
        addProjectsListeners,
    };

})();

export { eventMaster };