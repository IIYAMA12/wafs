const gridItemsContainer = (function () {

    const gridItemsContainer = {
        init() {
            const filterInput = document.getElementById('filter-input');
            filterInput.addEventListener("keypress",((e) => {
                const this_ = this;
                setTimeout(function () { // Filter delay.
                    const value = filterInput.value;
                    this_.filter(value, "name");
                }, 1000);
            }));
        },
        load (data) {

            // convert to array
            const dataToArray = Object.entries(data);

            data = []; // clear the data and re-use

            // merge sub objects in to single array
            for (let i = 0; i < dataToArray.length; i++) {
                const subItem = dataToArray[i];

                const date = subItem[0];
                const subItemData = subItem[1];

                for (let j = 0; j < subItemData.length; j++) {
                    data[data.length] = {
                        date: date,
                        data: subItemData[j]
                    };
                }
            }
            console.log(data);

            const template = app.sections.template.get("grid-items");
            templateEngine.render(template, document.getElementById("startscreen"), data);
            return true;
        },
        filter (value, filterOn) {
            let localStorageData = app.localData.get("api-nasa", "JSON");

            if (localStorageData != undefined) {
                // convert to array
                const dataToArray = Object.entries(localStorageData);

                localStorageData = []; // clear the data and re-use

                // merge sub objects in to single array
                for (let i = 0; i < dataToArray.length; i++) {
                    const subItem = dataToArray[i];

                    const date = subItem[0];
                    const subItemData = subItem[1];

                    for (let j = 0; j < subItemData.length; j++) {
                        localStorageData[localStorageData.length] = {
                            date: date,
                            data: subItemData[j]
                        };
                    }
                }

                value = value.trim().toLowerCase();

                if (value != "") {
                    localStorageData = localStorageData.filter(function (d) {
                        const name = d.data.name;

                        if (name != undefined) {
                            return name.toLowerCase().indexOf(value) > -1;
                        }
                        return false;
                    });
                }
                const templateFilters = app.sections.template.get("grid-items-filters");
                const templateContent = app.sections.template.get("grid-items");
                if (value != "") {
                    templateEngine.render(templateFilters, document.querySelector("#startscreen form"), value);
                    document.querySelector("#search-on-text").classList.remove("hidden");
                } else {
                    document.querySelector("#search-on-text").classList.add("hidden");
                }
                templateEngine.render(templateContent, document.getElementById("startscreen"), localStorageData);
            }
        },
        unload () {
            console.log("unloaded");
            return true;
        }
    };

    gridItemsContainer.init();
    return gridItemsContainer;
})();
