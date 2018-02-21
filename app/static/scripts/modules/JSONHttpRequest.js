
(function () {
    app.JSONHttpRequest = {
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
    };
})();
