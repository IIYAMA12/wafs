(function () {
    // pages: Shows the page and decides the dynamic content.
    app.sections = {

        /*
            Initialize the sections.
        */
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

        /*
            This method is used to change the visible section.
        */
        toggle (route) {


            // Validate if there is data for this section.
            if (this.data[route]) {
                const sectionElement = document.getElementById(route);

                if (sectionElement != undefined) {

                    // hide all sections
                    const sectionElements = document.querySelectorAll("body > *");
                    for (let index = 0; index < sectionElements.length; index++) {
                        const element = sectionElements[index];
                        element.classList.add("hidden");
                    }

                    // Get previous section data if exist
                    const oldRouteData = this.oldRouteData;

                    // end functions
                    if (oldRouteData != undefined) {
                        this.sectionFunctions(oldRouteData.data, "endFunctions");
                    }
                    // start functions
                    this.sectionFunctions(this.data[route], "startFunctions");

                    // Set previous section data
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

                    return true; // Section is OK >>> Return
                }
            }

            /*
                No data available for this section? Then the page doesn't exist.
            */
            this.error.goToPage(404);

            return false;
        },

        /*
            This object is used to show page/section errors
        */
        error: {
            /*
                This method is used to go to error page.
            */
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


        /*
            This method is used to call attached section functions
        */
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

        /*
            This object is used to manage templates, for custom template engine.
        */
        template: {
            collection: {},
            add (id, template) {
                this.collection[id] = template;
            },
            get (id) {
                return this.collection[id];
            }
        },

        /*
            This object is used to contain section data. It is also used for section validation.
            If the secion id isn't in the object below, then it doesn't exist in the app.
        */
        data: {
            // This is data for the secion `startscreen`
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
