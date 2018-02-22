(function () {
    app.localData = {
        get (key, parser) {
            if (developmentStates.disableLocalStorage) {
                return null;
            }
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
            }
            if (localStorageData == false) {
                localStorageData = null;
            }
            return localStorageData;
        },
        set (key, item, parser) {
            if (developmentStates.disableLocalStorage) {
                return false;
            }
            this.data[key] = item;

            if (parser == "JSON") {
                item = JSON.stringify(item);
            }
            localStorage.setItem(key, item);


            return true;
        },
        data: {}
    };
})();
