(function () {
    app.localData = {
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
    };
})();
