const developingStatus = true;

const app = (function () {


	const app = {

		init () {
			this.routes.init();
		},

        // Takes care of the routes.
		routes: {
			init () {


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

            getCurrentRoute () {
                return location.href.split('#')[1];
            }
		},

        // pages: Shows the page and decides the dynamic content.
		sections: {
			toggle (route) {
				const sectionElements = document.querySelectorAll("body > *");



                if (this.data[route]) {
                    for (let index = 0; index < sectionElements.length; index++) {
                        const element = sectionElements[index];
                        element.classList.add("hidden");
                    }

                    this.startSection(this.data[route]);
                    document.getElementById(route).classList.remove("hidden");
                }


			},
            // data is not yet used, but will be used later on.
            startSection (sectionData) {
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
                add (id, template) {
                    this.collection[id] = template;
                },
                get (id) {
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

										localStorage.setItem("api-nasa", JSON.stringify(nearEarthObjects));
	                                    datavisComponent.load(nearEarthObjects);
	                                }
	                            }


								app.JSONHttpRequest.send(request);
							} else {
								localStorageData = JSON.parse(localStorageData);
								datavisComponent.load(localStorageData);
							}


                        },
                        function (_, sectionData) {
                            const template = app.sections.template.get("nasa");
                            templateEngine.render(template, document.getElementById("api-nasa-gov"));

                        }
                    ],
                    httpRequestsById: {}
                }
            }
		},

        JSONHttpRequest: {
			setup (id) {

                let httpRequest;
                if (id != undefined && !this.getById(id) || id == undefined) {
                    httpRequest = new XMLHttpRequest();

					httpRequest.customData = {}; // all my additional data.

					//






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

                return httpRequest != undefined ? httpRequest : false;
            },

            open () {
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

            send () { // http request || id
                if (arguments[0] != undefined) {
                    // send it by direct http request or use an id to find it.
                    const httpRequest = typeof(arguments[0]) == "string" ? this.httpRequestsById[arguments[0]] : arguments[0];
                    if (httpRequest != undefined) {

						httpRequest.customData.promiseData = {}

						var httpRequestPromise = new Promise(function (resolve, reject) {
							httpRequest.customData.promiseData.resolve = resolve;
							httpRequest.customData.promiseData.reject = reject;
						});
						httpRequest.customData.promiseData.promise = httpRequestPromise;

						httpRequestPromise.then(function (rawData) {
							httpRequest.customData.callBack(rawData);
						}).catch(function (result) { // Don't catch stupid fish...
							console.log(result);
						});

                        return httpRequest.send();
                    }
                }
            },

            getById (id) {
                return this.httpRequestsById[id] != undefined ? this.httpRequestsById[id] : false;
            },

            // event functions
            loaded: (e) => {
                const source = e.target;
                const rawData = source.response;
                if (rawData != undefined) {
                    if (source.customData != undefined && source.customData.callBack != undefined) {
						source.customData.promiseData.resolve(rawData);
						return;
                    }
                }
				source.customData.promiseData.reject("http request warning: The received the data is corrupted, from ID: " + (source.customData.id != undefined ? source.customData.id : "<Undefined>"));
            },
            error: (e) =>{
				const source = e.target;
				source.customData.promiseData.reject("http request error: Can't receive the data, from ID: " + (source.customData.id != undefined ? source.customData.id : "<Undefined>"));
            },
            abort: (e) => {
				source.customData.promiseData.reject("http request abort: From ID " + (source.customData.id != undefined ? source.customData.id : "<Undefined>"));
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
            isElement (element) {
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
