(function () {
    // pages: Shows the page and decides the dynamic content.
    app.sections = {
        init () {
            // ///////////////////////// //
            // Experimental custom event //

            window.addEventListener('onChangePage', function (e) {
                // ... experimental!!!
            }, false);

            //                           //
            ///////////////////////////////

            // attach the ID on the section data.
            const data = this.data;

            for (const sectionId in data) {
                data[sectionId].id = sectionId;
            }
        },
        toggle (route) {
            const sectionElements = document.querySelectorAll("body > *");





            if (this.data[route]) {
                const sectionElement = document.getElementById(route);
                if (sectionElement != undefined) {

                    // hide all sections
                    for (let index = 0; index < sectionElements.length; index++) {
                        const element = sectionElements[index];
                        element.classList.add("hidden");
                    }


                    const oldRouteData = this.oldRouteData;

                    // end functions
                    if (oldRouteData != undefined) {
                        this.sectionFunctions(oldRouteData.data, "endFunctions");
                    }
                    // start functions
                    this.sectionFunctions(this.data[route], "startFunctions");


                    this.oldRouteData = {route: route, data: this.data[route], element: sectionElement};

                    sectionElement.classList.remove("hidden");

                    // ///////////////////////// //
                    // Experimental custom event //

                    const changePageEvent = new CustomEvent('onChangePage',
                        {
                            detail: {
                                route: route,
                                oldRoute: this.oldRouteData.route,
                                data: this.data[route],
                                oldData: this.oldRouteData.data,
                                oldElement: sectionElement
                            }
                        }
                    );
                    window.dispatchEvent(changePageEvent);

                    //                           //
                    ///////////////////////////////

                    return true;
                }
            }

            this.error.goToPage(404);

            return false;
        },
        error: {
            goToPage(code) {
                const sectionElements = document.querySelectorAll("body > *");

                // hide all sections
                for (let index = 0; index < sectionElements.length; index++) {
                    const element = sectionElements[index];
                    element.classList.add("hidden");
                }
                const section = document.getElementById("page-error");
                section.classList.remove("hidden");
                section.getElementsByTagName("p").textContent = code + " : " + (this.errorMessages[code] != undefined ? this.errorMessages[code] : " Something went wrong!");
            },
            errorMessages: {
                [404]: "Nothing here!"
            },
        },


        // Data is not yet used, but will be used later on.
        sectionFunctions (sectionData, typeOfFunctions) {

            const init = sectionData.init;
            if (init != undefined) {
                init();
                delete sectionData.init;
            }

            const functions = sectionData[typeOfFunctions];

            if (functions != undefined) {
                for (let i = 0; i < functions.length; i++) {
                    functions[i](this, sectionData);
                }
            }
        },
        template: {
            collection: {},
            add (id, template) {
                this.collection[id] = template;
            },
            get (id) {
                return this.collection[id];
            }
        },
        data: {
            ["startscreen"] : {
                startFunctions: [
                    function (_, sectionData) {
                        const errorCallBack = function (message) {
                            const sectionElement = document.getElementById(sectionData.id);
                            if (sectionElement != undefined) {
                                sectionElement.classList.add("data-loaded");
                                const errorMessageElement = sectionElement.getElementsByClassName("error-message")[0];
                                if (errorMessageElement != undefined) {
                                    errorMessageElement.textContent = message;
                                    errorMessageElement.classList.remove("hidden");
                                }
                            }
                        };
                        const sectionElement = document.getElementById(sectionData.id);
                        if (sectionElement != undefined) {
                            const errorMessageElement = sectionElement.getElementsByClassName("error-message")[0];
                            if (errorMessageElement) {
                                errorMessageElement.classList.add("hidden");
                            }
                        }
                        app.api["api-nasa"].requestData(gridItemsContainer.load, errorCallBack);
                    }
                ],
                endFunctions: [
                    function () {
                        gridItemsContainer.unload();
                    }
                ]
            },
            ["main-nav"] : {

            },
            ["nasa-slideshow"] : {
                startFunctions: [
                    function (_, sectionData) {

                        const errorCallBack = function (message) {

                            const sectionElement = document.getElementById(sectionData.id);
                            if (sectionElement != undefined) {
                                sectionElement.classList.add("data-loaded");
                                const errorMessageElement = sectionElement.getElementsByClassName("error-message")[0];
                                if (errorMessageElement != undefined) {
                                    errorMessageElement.textContent = message;
                                    errorMessageElement.classList.remove("hidden");
                                }
                            }
                        };
                        const sectionElement = document.getElementById(sectionData.id);
                        if (sectionElement != undefined) {
                            const errorMessageElement = sectionElement.getElementsByClassName("error-message")[0];
                            if (errorMessageElement) {
                                errorMessageElement.classList.add("hidden");
                            }
                        }

                        app.api["api-nasa"].requestData(slideshowContainer.load, errorCallBack);
                    }
                ],
                endFunctions: [
                    function () {
                        slideshowContainer.unload();
                    }
                ]
            }
        }
    };
})();
