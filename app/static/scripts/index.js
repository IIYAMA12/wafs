
const developingStatus = true;


const app = (function () {
	'use strict';






	const app = {

		init () {
			this.JSONHttpRequest.init(); // order matters!
			this.routes.init();
			this.sections.init();
		},

        // Takes care of the routes.
		routes: {
			init () {


				// navigate directly when visiting the page without the navigation. Else it might get bugged, because the hash isn't triggered when it is the same url.
				let sectionName = this.getCurrentRoute();
				if (sectionName != undefined) {
					app.sections.toggle(sectionName);
				} else {
					app.sections.toggle("startscreen");
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
											console.log(nearEarthObjects);
											app.localData.set("api-nasa", nearEarthObjects, "JSON");
		                                    slideshowContainer.load(nearEarthObjects);
		                                }
		                            }

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
		},

        JSONHttpRequest: {
			init () {
				XMLHttpRequest.prototype.addEventListeners = function () {
					this.addEventListener("load", app.JSONHttpRequest.loaded);
					this.addEventListener("progress", app.JSONHttpRequest.progress);
					this.addEventListener("error", app.JSONHttpRequest.error);
					this.addEventListener("abort", app.JSONHttpRequest.abort);
				};
				XMLHttpRequest.prototype.removeEventListeners = function () {
					this.addEventListener("load", app.JSONHttpRequest.loaded);
					this.addEventListener("progress", app.JSONHttpRequest.progress);
					this.addEventListener("error", app.JSONHttpRequest.error);
					this.addEventListener("abort", app.JSONHttpRequest.abort);
				};
			},
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
				httpRequest.addEventListeners();

                return httpRequest != undefined ? httpRequest : false;
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

						const httpRequestPromise = new Promise(function (resolve, reject) {
							httpRequest.promiseData.resolve = resolve;
							httpRequest.promiseData.reject = reject;
						});
						httpRequest.promiseData.promise = httpRequestPromise;

						httpRequestPromise.then(function (rawData) {
							httpRequest.customData.callBack(rawData);

							// Because the httpRequest remains to exist, we should remove the listeners.
							httpRequest.removeEventListeners();
						}).catch(function (result) { // Don't catch stupid fish...
							console.log(result);

							// Because the httpRequest remains to exist, we should remove the listeners.
							httpRequest.removeEventListeners();
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
						if (source.promiseData != undefined) {
							source.promiseData.resolve(rawData);
						}
						return;
                    }
                }
				source.promiseData.reject("http request warning: The received the data is corrupted, from ID: " + (source.customData.id != undefined ? source.customData.id : "<Undefined>"));
            },
            error: (e) =>{
				const source = e.target;
				if (source.promiseData != undefined) {
					source.promiseData.reject("http request error: Can't receive the data, from ID: " + (source.customData.id != undefined ? source.customData.id : "<Undefined>"));
				}
			},
            abort: (e) => {
				const source = e.target;
				if (source.promiseData != undefined) {
					source.promiseData.reject("http request abort: From ID " + (source.customData.id != undefined ? source.customData.id : "<Undefined>"));
				}
			},
            progress: (e) => {

                if (e.lengthComputable) {
                    const percentComplete = e.loaded / e.total;
                    console.log("progress", percentComplete);
                } else {
                    console.log("no progress");
                }
            },

            // data
            httpRequestsById: {},
        },
		localData: {
			get (key, parser) {
				let localStorageData;
				if (this.data[key] != undefined) {
					localStorageData = this.data[key];
				} else {
					localStorageData = localStorage.getItem(key);
					if (parser == "JSON") {
						localStorageData = JSON.parse(localStorageData);
					}
					// Store in the direct memory as well
					this.data[key] = localStorageData;
				};
				return localStorageData;
			},
			set (key, item, parser) {

				this.data[key] = item;
				
				if (parser == "JSON") {
					item = JSON.stringify(item);
				}
				localStorage.setItem(key, item);


				return true;
			},
			data: {}
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
