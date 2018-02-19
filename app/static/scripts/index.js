
const developingStatus = true;

const app = (function () {
	'use strict';

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
								if (request != undefined) {
		                            sectionData.httpRequestsById["api-nasa"] = request;


		                            app.JSONHttpRequest.open(request, "GET", "https://api.nasa.gov/neo/rest/v1/feed?api_key=1NnMgn9RYxKvz0o2FDqdQ3poB6vtGreh8oLahlBy", true);

									console.log("attach callback");
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

									app.JSONHttpRequest.send("api-nasa");
								}
							} else {
								localStorageData = JSON.parse(localStorageData);
								datavisComponent.load(localStorageData);
							}
                        },
                        function (_, sectionData) {
							console.log("render template");
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



                let httpRequest = new XMLHttpRequest();

				httpRequest.customData = {}; // all my additional data.

				// save by ID.
                if (id != undefined) {
					if (!this.getRequestsById(id)) {
                    	this.httpRequestsById[id] = [httpRequest];
					} else {
						this.httpRequestsById[id][this.httpRequestsById[id].length] = httpRequest;
					}
                    httpRequest.customData.id = id;
                }

				// attach addEventListeners
				this.addEventListeners(httpRequest);


                return httpRequest != undefined ? httpRequest : false;
            },

			// listening
			addEventListeners (httpRequest) {
				httpRequest.addEventListener("load", this.loaded);
                httpRequest.addEventListener("progress", this.progress);
                httpRequest.addEventListener("error", this.error);
                httpRequest.addEventListener("abort", this.abort);
				return true;
			},

			removeEventListeners (httpRequest) {
				httpRequest.removeEventListener("load", this.loaded);
				httpRequest.removeEventListener("progress", this.progress);
				httpRequest.removeEventListener("error", this.error);
				httpRequest.removeEventListener("abort", this.abort);
				return true;
			},

			// open connection
            open () {
                let httpRequest, id, method, url, a_sync, user, password;
                // https://developer.mozilla.org/nl/docs/Web/JavaScript/Reference/Operatoren/Destructuring_assignment

                if (typeof(arguments[0]) == "string") {
                    [id, method, url, a_sync, user, password] = arguments;
                    httpRequest =  this.getLatestRequestById(id);
                } else {
                    [httpRequest, method, url, a_sync, user, password] = arguments;
                }
                return httpRequest.open(method, url, a_sync, user, password);
            },

			// send
            send () { // http request || id
                if (arguments[0] != undefined) {
                    // send it by direct http request or use an id to find it.
                    const httpRequest = typeof(arguments[0]) == "string"
						?
							this.getLatestRequestById(arguments[0])
						:
							arguments[0];

                    if (httpRequest != undefined) {

						httpRequest.promiseData = {}

						var httpRequestPromise = new Promise(function (resolve, reject) {
							httpRequest.promiseData.resolve = resolve;
							httpRequest.promiseData.reject = reject;
						});
						httpRequest.promiseData.promise = httpRequestPromise;

						httpRequestPromise.then(function (rawData) {
							httpRequest.customData.callBack(rawData);

							// Because the httpRequest remains to exist, we should remove the listeners.
							app.JSONHttpRequest.removeEventListeners(httpRequest);
						}).catch(function (result) { // Don't catch stupid fish...
							console.log(result);

							// Because the httpRequest remains to exist, we should remove the listeners.
							app.JSONHttpRequest.removeEventListeners(httpRequest);
						});

                        return httpRequest.send();
                    }
                }
            },

            getRequestsById (id) {
                return this.httpRequestsById[id] != undefined ? this.httpRequestsById[id] : false;
            },

			getLatestRequestById (id) {
				const requests = this.getRequestsById(id);
				if (requests != undefined && requests.length > 0) {
					return requests[requests.length - 1];
				}
				return false;
			},

            // event functions
            loaded: (e) => {
                const source = e.target;
                const rawData = source.response;
                if (rawData != undefined) {
                    if (source.customData != undefined && source.customData.callBack != undefined) {
						source.promiseData.resolve(rawData);
						return;
                    }
                }
				source.promiseData.reject("http request warning: The received the data is corrupted, from ID: " + (source.customData.id != undefined ? source.customData.id : "<Undefined>"));
            },
            error: (e) =>{
				const source = e.target;
				source.promiseData.reject("http request error: Can't receive the data, from ID: " + (source.customData.id != undefined ? source.customData.id : "<Undefined>"));
            },
            abort: (e) => {
				source.promiseData.reject("http request abort: From ID " + (source.customData.id != undefined ? source.customData.id : "<Undefined>"));
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
