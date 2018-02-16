

const app = (function () {


	const app = {

		init: function () {
			this.routes.init();
		},

        // Takes care of the routes.
		routes: {
			init: function () {


				// navigate directly when visiting the page without the navigation. Else it might get bugged, because the hash isn't triggered when it is the same url.
				let sectionName = this.getCurrentRoute();
				if (sectionName != undefined) {
					app.sections.toggle(sectionName);
				}

				/*
					 MDN web docs: "The hashchange event is fired when the fragment identifier of the URL has changed (the part of the URL that follows the # symbol, including the # symbol)."
					 https://developer.mozilla.org/en-US/docs/Web/Events/hashchange
				*/
				window.addEventListener("hashchange", (e) => {
					const sectionName = location.hash.split('#')[1];

					app.sections.toggle(sectionName);

				});
			},

            getCurrentRoute: function () {
                return location.href.split('#')[1];
            }
		},

        // pages: Shows the page and decides the dynamic content.
		sections: {
			toggle: function (route) {
				const sections = document.querySelectorAll("body > *");



                if (this.data[route]) {
                    for (let index = 0; index < sections.length; index++) {
                        const element = sections[index];
                        element.classList.add("hidden");
                    }

                    this.activateStartFunction(this.data[route]);
                    document.getElementById(route).classList.remove("hidden");
                }


			},
            // data is not yet used, but will be used later on.
            activateStartFunction: function (sectionData) {
                var init = sectionData.init;
                if (init != undefined) {
                    init();
                }
                var startFunctions = sectionData.startFunctions;
                if (startFunctions != undefined) {
                    for (let i = 0; i < startFunctions.length; i++) {
                        startFunctions[i](this, sectionData);
                    }
                }
            },
            template: {
                collection: {},
                add: function (id, template) {
                    this.collection[id] = template;
                },
                get: function (id) {
                    return this.collection[id];
                }
            },
            data: {
                ["startscreen"] : {

                },
                ["main-nav"] : {

                },
                ["api-nasa-gov"] : {
                    startFunctions: [
                        function (_, sectionData) {

							let localStorageData = localStorage.getItem("api-nasa");


							if (localStorageData == undefined) {
	                            var request = app.JSONHttpRequest.setup("api-nasa");
	                            sectionData.httpRequestsById["api-nasa"] = request;


	                            app.JSONHttpRequest.open(request, "GET", "https://api.nasa.gov/neo/rest/v1/feed?api_key=1NnMgn9RYxKvz0o2FDqdQ3poB6vtGreh8oLahlBy", true);
	                            app.JSONHttpRequest.send(request);


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

										localStorage.setItem("api-nasa", JSON.stringify(nearEarthObjects));
	                                    datavisComponent.load(nearEarthObjects);
	                                }
	                            }
							} else {
								localStorageData = JSON.parse(localStorageData);
								datavisComponent.load(localStorageData);
							}


                        },
                        function (_, sectionData) {
                            const template = app.sections.template.get("nasa");
                            templateEngine.process(template, document.getElementById("api-nasa-gov"));

                        }
                    ],
                    httpRequestsById: {}
                }
            }
		},

        JSONHttpRequest: {
            setup: function (id) {
                let httpRequest;
                if (id != undefined && !this.getById(id) || id == undefined) {
                    httpRequest = new XMLHttpRequest();

                    httpRequest.customData = {}; // all my additional data.

                    if (id != undefined) {
                        this.httpRequestsById[id] = httpRequest;
                        httpRequest.customData.id = id;
                    }
                    this.httpRequests[this.httpRequests.length] = httpRequest;
                    httpRequest.addEventListener("load", this.loaded);
                    httpRequest.addEventListener("progress", this.progress);
                    httpRequest.addEventListener("error", this.error);
                    httpRequest.addEventListener("abort", this.abort);
                } else {
                    httpRequest = this.getById(id);
                }
                console.log("requests:", this.httpRequests.length);
                return httpRequest != undefined ? httpRequest : false;
            },

            open: function () {
                let httpRequest, id, method, url, a_sync, user, password;
                // https://developer.mozilla.org/nl/docs/Web/JavaScript/Reference/Operatoren/Destructuring_assignment

                if (typeof(arguments[0]) == "string") {
                    [id, method, url, a_sync, user, password] = arguments;
                    httpRequest =  this.httpRequestsById[id];
                } else {
                    [httpRequest, method, url, a_sync, user, password] = arguments;
                }
                return httpRequest.open(method, url, a_sync, user, password);
            },

            send: function () { // http request || id
                if (arguments[0] != undefined) {
                    // send it by direct http request or use an id to find it.
                    const httpRequest = typeof(arguments[0]) == "string" ? this.httpRequestsById[arguments[0]] : arguments[0];
                    if (httpRequest != undefined) {
                        return httpRequest.send();
                    }
                }
            },

            getById: function (id) {
                return this.httpRequestsById[id] != undefined ? this.httpRequestsById[id] : false;
            },

            // event functions
            loaded: (e) => {
                const source = e.target;
                const rawData = source.response;
                if (rawData != undefined) {
                    if (source.customData != undefined && source.customData.callBack != undefined) {
                        source.customData.callBack(rawData);
                    }
                }
            },
            error: (e) =>{

            },
            abort: (e) => {

            },
            progress: (e) => {

                if (e.lengthComputable) {
                    var percentComplete = e.loaded / e.total;
                    console.log("progress", percentComplete);
                } else {
                    console.log("no progress");
                }
            },

            // data
            httpRequestsById: {},
            httpRequests: []
        },
        utility: { // https://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
            isElement: function (element) {
                return element instanceof Element;
            }
        }
	}

    // All other scripts loaded?
    window.addEventListener("load", () => {
        app.init();
    });


    return app;
})();
