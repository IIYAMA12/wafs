// ---------------------------------------- //
/*

    This module is used to save data locally in to the memory, included localStorage.

*/
// ---------------------------------------- //

(function () {
    app.localData = {
        
        /*
            Get data
        */
        get (key, parser) {

            // developmentStates
            if (developmentStates.disableLocalStorage) {
                return null;
            }


            let localStorageData;

            // check memory first
            if (this.data[key] != undefined) {
                localStorageData = this.data[key];
            } else { // not in the memory?

                // check localStorage
                localStorageData = localStorage.getItem(key);
                if (parser == "JSON") {
                    localStorageData = JSON.parse(localStorageData);
                }
                // Store in the direct memory as well
                this.data[key] = localStorageData;
            }

            // I do not want to return false, because it isn't `nothing`.
            if (localStorageData == false) {
                localStorageData = null;
            }

            return localStorageData;
        },

        /*
            Set data
        */
        set (key, item, parser) {

            // developmentStates
            if (developmentStates.disableLocalStorage) {
                return false;
            }

            // save in localData
            this.data[key] = item;

            if (parser == "JSON") {
                item = JSON.stringify(item);
            }

            // save in localStorage
            localStorage.setItem(key, item);


            return true;
        },

        /*
            This is where the local `data` of `localData` is stored.
        */
        data: {}
    };
})();
