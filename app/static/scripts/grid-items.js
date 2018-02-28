const gridItemsContainer = (function () {

    const gridItemsContainer = {
        init() {
            const filterInput = document.getElementById('filter-input');

            // detect when the input text has been changed
            filterInput.addEventListener("keypress",((e) => {
                this.updateTimerStatus = false;
                const value = filterInput.value;
                this.update.startWithDelay();
            }));




            // filter template
            const template = app.sections.template.get("grid-items-filter");
            const rowData = app.api["api-nasa"].getRowData();
            templateEngine.render(template, document.getElementById("sort-on-number"), rowData);

            // Listen to when a radio button has been changed.
            document.getElementById("sort-on-number").addEventListener("change",(e) => {
                this.update.startWithDelay();
            });

            // get all valid data headers and save them!
            const validHeaders = {};

            const defaultRowData = app.api["api-nasa"].getRowData();
            for (var i = 0; i < defaultRowData.length; i++) {
                validHeaders[defaultRowData[i].header] = true;
            }

            this.update.data.validHeaders = validHeaders;
        },

        load (data) {
            // const template = app.sections.template.get("grid-items");
            // templateEngine.render(template, document.getElementById("startscreen"), data);
            gridItemsContainer.update.start(data);

            // tell the css that the data has been loaded.
            document.getElementById("startscreen").classList.add("data-loaded");
            return true;
        },

        resetFilterAndSort () {
            // reset filtering
            const sortOrderInputs = document.getElementById("sort-on-number").querySelectorAll("[name=\"sort-order\"]");
            for (let i = 0; i < sortOrderInputs.length; i++) {
                sortOrderInputs[i].checked = false;
            }
            document.getElementById("sort-on-number").querySelector("[name=\"sort-order\"]").checked = true;

            // reset sorting
            const sortOnItemInputs = document.getElementById("sort-on-number").querySelectorAll("[name=\"sort-on\"]");
            for (let i = 0; i < sortOnItemInputs.length; i++) {
                sortOnItemInputs[i].checked = false;
            }
            document.getElementById("sort-on-number").querySelector("[name=\"sort-on\"]").checked = true;

        },
        update: {
            updateTimerStatus: false,

            // The template engine is not optimised for a lot of data in combination with updates. So a timer will reduce some lagg while for example typing in an input field.
            startWithDelay () {
                let data = app.localData.get("api-nasa", "JSON");
                if (data != undefined) {
                    if (!this.updateTimerStatus) {
                        document.getElementById("startscreen").classList.remove("data-loaded");
                        this.updateTimerStatus = true;
                        const self = this;
                        setTimeout(function () {
                            document.getElementById("startscreen").classList.add("data-loaded");
                            self.updateTimerStatus = false;
                            self.start();
                        }, 600);
                    }
                }
            },
            data: {},
            start () {

                // development state
                if (developmentStates.dataUnavailable) {
                    return;
                }


                let data = app.localData.get("api-nasa", "JSON");


                if (data != undefined && data) {

                    // A ONE layer copy: https://stackoverflow.com/questions/7486085/copying-array-by-value-in-javascript
                    data = data.slice();


                    data = this.filter(data);
                    data = this.sort(data);


                    const templateFilters = app.sections.template.get("grid-items-filters");
                    const templateContent = app.sections.template.get("grid-items");

                    if (this.data.searchText != "") {
                        templateEngine.render(templateFilters, document.querySelector("#startscreen form"), this.data.searchText);
                        document.querySelector("#search-on-text").classList.remove("hidden");
                    } else {
                        document.querySelector("#search-on-text").classList.add("hidden");
                    }

                    templateEngine.render(templateContent, document.getElementById("startscreen"), data);
                }
            },
            sort (data) {
                const sortFunctions = this.sortings;
                for (let i = 0; i < sortFunctions.length; i++) {
                    data = sortFunctions[i](data, this);
                }
                return data;
            },
            filter (data) {
                const filterFunctions = this.filters;
                for (let i = 0; i < filterFunctions.length; i++) {
                    data = filterFunctions[i](data, this);
                }
                return data;
            },
            filters: [
                function (data, self) {
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
                // sort by default the first time on name
                function (data, self) {
                    data = data.sort(function(a, b) {

                        const nameA = a.data.name.toUpperCase();
                        const nameB = b.data.name.toUpperCase();

                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }

                        // names must be equal
                        return 0;
                    });
                    return data;
                },
                function (data, self) {

                    const selectedSortOrderItem = document.getElementById("sort-on-number").querySelector("[name=\"sort-order\"]:checked");
                    let sortOrder = "down";
                    if (selectedSortOrderItem != undefined) {
                        sortOrder = selectedSortOrderItem.value == "down" ? "down" : "up";
                    }
                    const selectedItem = document.getElementById("sort-on-number").querySelector("[name=\"sort-on\"]:checked");


                    const inputValue = selectedItem.value;

                    if (self.data.validHeaders[inputValue]) { // validated if we can filter on it.

                        // start sorting
                        let sortMethod;
                        data = data.sort(function(a, b) {

                            const rowDataA = app.api["api-nasa"].getRowData(a);
                            const rowDataB = app.api["api-nasa"].getRowData(b);

                            let valueA = rowDataA.find(function (item) {
                                return item.header === inputValue;
                            }).value;
                            let valueB = rowDataB.find(function (item) {
                                return item.header === inputValue;
                            }).value;

                            // decide which sort method we are going to use based on the first item.
                            if (sortMethod == undefined) {
                                if (!isNaN(Number(valueA))) {
                                    if (!isNaN(Number(valueB))) {
                                        sortMethod = "number";
                                    }
                                } else if (typeof(valueA) == "string") {
                                    if (typeof(valueB) == "string") {
                                        sortMethod = "string";
                                    }
                                } else if (typeof(valueA) == "boolean") {
                                    if (typeof(valueB) == "boolean") {
                                        sortMethod = "boolean";
                                    }
                                }
                                if (sortMethod == undefined) {
                                    sortMethod = "unkown";
                                }
                            }

                            // sorting behaviours
                            if (sortMethod == "string") {
                                valueA = valueA.toUpperCase();
                                valueB = valueB.toUpperCase();

                                if (valueA < valueB) {
                                    return -1;
                                }
                                if (valueA > valueB) {
                                    return 1;
                                }

                                // names must be equal
                                return 0;
                            } else if (sortMethod == "number") {
                                valueA = Number(valueA),
                                    valueB = Number(valueB);
                                return sortOrder == "down" ? valueA > valueB : valueA < valueB;
                            } else if (sortMethod == "boolean") {
                                // sort by boolean: https://stackoverflow.com/questions/17387435/javascript-sort-array-of-objects-by-a-boolean-property
                                return sortOrder == "down" ? ((valueA === valueB) ? 0 : valueA ? -1 : 1) : ((valueA === valueB) ? 0 : !valueA ? -1 : 1);
                            }

                            return true;
                        });
                        const sortOnItemInputs = document.getElementById("sort-on-number").querySelectorAll("[name=\"sort-order\"]");
                        for (let i = 0; i < sortOnItemInputs.length; i++) {
                            sortOnItemInputs[i].removeAttribute("disabled");
                        }
                    } else {
                        const sortOnItemInputs = document.getElementById("sort-on-number").querySelectorAll("[name=\"sort-order\"]");
                        for (let i = 0; i < sortOnItemInputs.length; i++) {
                            sortOnItemInputs[i].setAttribute("disabled", "true");
                        }
                    }
                    return data;
                }
            ]
        },
        unload () {
            this.resetFilterAndSort();
            document.getElementById("startscreen").classList.remove("data-loaded");
            return true;
        }
    };


    return gridItemsContainer;
})();
