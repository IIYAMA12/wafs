(function () {
    app.utility = { // https://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
        isElement (element) {
            return element instanceof Element;
        },

        //////////////////
        // experimental //
        deepConvertToNumber (data, key) {
            if (key != undefined) {
                data = data[key];
            }
            if (typeof(data) == "string") {
                const newData = Number(data.trim());
                if (!isNaN(newData)) {
                    if (key == undefined) {
                        data = newData;
                    } else {
                        data[key] = newData;
                    }
                }
            } else if (typeof(data) == "object") { // mutation
                if (Array.isArray(data)) {
                    for (let i = 0; i < data.length; i++) {
                        app.utility.deepConvertToNumber(data, i);
                    }
                } else {
                    for (const key in data) {
                        app.utility.deepConvertToNumber(data, key);
                    }
                }
            }
            return data;
        }
    };
})();
