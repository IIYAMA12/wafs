const gridItemsContainer = (function () {

    const gridItemsContainer = {
        init() {
            const filterInput = document.getElementById('filter-input');
            filterInput.addEventListener("keypress",((e) => {
                const self = this;
                setTimeout(function () { // Filter delay.
                    const value = filterInput.value;
                    self.update.start();
                }, 1000);
            }));

            const rowData = app.api["api-nasa"].customFunctions.getRowData();
            console.log(rowData);

            let radioButtonIndex = 0;
            templateEngine.render([
                {
                    content: function (data, parent) {

                        data = data.map(function (d) {
                            return {data: d};
                        });

                        return data;
                    },
                    type: "function",
                    children: [
                        {
                            content: "input",
                            type: "tag",
                            child: {
                                content: function (data, parent) {

                                    parent.setAttribute("name", "sort-on");
                                    parent.setAttribute("type", "radio");
                                    parent.setAttribute("value", data.header);
                                    parent.setAttribute("id", "sort-on-id:" + radioButtonIndex);

                                },
                                type: "function"
                            }

                        },
                        {
                            content: "label",
                            type: "tag",
                            children: [
                                {
                                    content: function (data, parent) {

                                        parent.setAttribute("for", "sort-on-id:" + radioButtonIndex);

                                        radioButtonIndex++;
                                        return {data: data.header};
                                    },
                                    type: "function",
                                    child: {
                                        type: "text",
                                        content: "[use-data]"
                                    }
                                },

                            ]
                        }
                    ]
                }
            ], document.getElementById("sort-on-number"), rowData);
        },
        load (data) {
            const template = app.sections.template.get("grid-items");
            templateEngine.render(template, document.getElementById("startscreen"), data);
            return true;
        },
        update: {
            data: {},
            start () {
                let data = app.localData.get("api-nasa", "JSON");


                data = this.sort(data);
                data = this.filter(data);

                const templateFilters = app.sections.template.get("grid-items-filters");
                const templateContent = app.sections.template.get("grid-items");

                if (this.data.searchText != "") {
                    templateEngine.render(templateFilters, document.querySelector("#startscreen form"), this.data.searchText);
                    document.querySelector("#search-on-text").classList.remove("hidden");
                } else {
                    document.querySelector("#search-on-text").classList.add("hidden");
                }
                templateEngine.render(templateContent, document.getElementById("startscreen"), data);
            },
            sort (data) {
                const sortFunctions = this.sortings;
                for (let i = 0; i < sortFunctions.length; i++) {
                    data = sortFunctions[i](data);
                }
                return data;
            },
            filter (data) {
                const filterFunctions = this.filters;
                for (let i = 0; i < filterFunctions.length; i++) {
                    data = filterFunctions[i](data);
                }
                return data;
            },
            filters: [
                function (data) {
                    const filterInput = document.getElementById('filter-input');
                    let value = filterInput.value;



                    if (data != undefined) {

                        value = value.trim().toLowerCase();

                        if (value != "") {
                            data = data.filter(function (d) {
                                const name = d.data.name;

                                if (name != undefined) {
                                    return name.toLowerCase().indexOf(value) > -1;
                                }
                                return false;
                            });
                        }
                        gridItemsContainer.update.data.searchText = value;
                    }
                    return data;
                }
            ],
            sortings: [
                function (data) {
                    console.log(data);
                    const rowData = app.api["api-nasa"].customFunctions.getRowData();
                    console.log("rowData", rowData);

                    const indexesWithNumbersOnly = [];
                    let rowDataWithNumbersOnly = rowData.filter(function (d, i) {
                        indexesWithNumbersOnly[indexesWithNumbersOnly.length] = i;
                        return d.type == "number";
                    });
                    console.log(rowDataWithNumbersOnly);

                    return data;
                }
            ]
        },
        unload () {
            console.log("unloaded");
            return true;
        }
    };


    return gridItemsContainer;
})();
