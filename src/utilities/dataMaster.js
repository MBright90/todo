const dataMaster = (() => {

    const retrieveLocalData = () => {
        const localData = {
            
            general: [
                {
                    title: "toDo title",
                    description: "toDo description",
                    dueDate: "25/09/2022",
                    important: true,
                },
                {
                    title: "toDo title",
                    description: "toDo description",
                    dueDate: "25/09/2022",
                    important: false,
                }
            ],
            projects: [
                {
                    projectTitle: "project title",
                    projectToDos: [
                        {
                            title: "toDo title",
                            description: "toDo description",
                            dueDate: "25/09/2022",
                            important: true,
                        }

                    ]
                }
            ]
        }
        return localData;
    };

})();