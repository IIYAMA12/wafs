

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
            }
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
                    function () {
                        const localStorageData = app.localData.get("api-nasa", "JSON");

                        if (localStorageData == undefined) {
                            const request = app.JSONHttpRequest.setup("api-nasa");
                            if (request != undefined) {

                                app.JSONHttpRequest.open(request, "GET", "https://api.nasa.gov/neo/rest/v1/feed?api_key=1NnMgn9RYxKvz0o2FDqdQ3poB6vtGreh8oLahlBy", true);


                                // attach callback
                                request.customData.callBack = (rawData) => {
                                    const data = JSON.parse(rawData);
                                    if (data != undefined) {
                                        let nearEarthObjects = data["near_earth_objects"];

                                        for(let date in nearEarthObjects){
                                            const asteroids = nearEarthObjects[date];
                                            for (let i = 0; i < asteroids.length; i++) {
                                                const asteroid = asteroids[i];
                                                // remove one index level for the data at key close_approach_data.
                                                const closeApproachData = asteroid["close_approach_data"][0];
                                                asteroid["close_approach_data"] = closeApproachData;
                                            }
                                        }
                                        console.log("nearEarthObjects", nearEarthObjects);
                                        app.localData.set("api-nasa", nearEarthObjects, "JSON");
                                        gridItemsContainer.load(nearEarthObjects);
                                    }
                                }

                                app.JSONHttpRequest.send("api-nasa");
                            }
                        } else {
                            gridItemsContainer.load(localStorageData);
                        }
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
                        const localStorageData = app.localData.get("api-nasa", "JSON");
                        if (localStorageData == undefined) {
                            const request = app.JSONHttpRequest.setup("api-nasa");
                            if (request != undefined) {

                                app.JSONHttpRequest.open(request, "GET", "https://api.nasa.gov/neo/rest/v1/feed?api_key=1NnMgn9RYxKvz0o2FDqdQ3poB6vtGreh8oLahlBy", true);


                                // attach callback
                                request.customData.callBack = (rawData) => {
                                    const data = JSON.parse(rawData);
                                    if (data != undefined) {
                                        let nearEarthObjects = data["near_earth_objects"];

                                        for(let date in nearEarthObjects){
                                            const asteroids = nearEarthObjects[date];
                                            for (let i = 0; i < asteroids.length; i++) {
                                                const asteroid = asteroids[i];
                                                // remove one index level for the data at key close_approach_data.
                                                const closeApproachData = asteroid["close_approach_data"][0];
                                                asteroid["close_approach_data"] = closeApproachData;
                                            }
                                        }
                                        console.log(nearEarthObjects);
                                        app.localData.set("api-nasa", nearEarthObjects, "JSON");
                                        slideshowContainer.load(nearEarthObjects);
                                    }
                                };

                                app.JSONHttpRequest.send("api-nasa");
                            }
                        } else {

                            slideshowContainer.load(localStorageData);
                        }
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
