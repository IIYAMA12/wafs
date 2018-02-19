const gridItemsContainer = (function () {
    const gridItemsContainer = {
        load (data) {
            console.log("loaded!");

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
        unload () {
            console.log("unloaded");
            return true;
        }
    };

    // gridItemsContainer.init();
    return gridItemsContainer;
})();
