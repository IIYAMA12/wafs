const gridItemsContainer = (function () {

    const gridItemsContainer = {
        init() {
            const filterInput = document.getElementById('filter-input');
            filterInput.addEventListener("keypress",((e) => {
                const this_ = this;
                setTimeout(function (){
                    const value = filterInput.value;
                    this_.filter(value, "name");
                });
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

                value = value.trim();

                if (value != "") {
                    localStorageData = localStorageData.filter(function (d) {
                        const name = d.data.name;

                        if (name != undefined) {
                            return name.toLowerCase().indexOf(value) > 0;
                        }
                        return false;
                    });
                }

                const template = app.sections.template.get("grid-items");
                templateEngine.render(template, document.getElementById("startscreen"), localStorageData);
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
