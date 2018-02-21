//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
// RTFM!!! https://github.com/IIYAMA12/wafs/tree/master/template-engine-doc:
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////


app.sections.template.add("grid-items-filters",
    [
        // for the filters
        {
            query: "#search-on-text span",
            content: "[use-data]",
            type: "text",
            limit: 1
        }
    ]
);


app.sections.template.add("grid-items",
    [
        {
            query: "section:first-of-type",
            limit: 1,
            content: function (data, parent) {
                const elementsWithData = [];
                for (var i = 0; i < data.length; i++) {

                    elementsWithData[elementsWithData.length] = {element: document.createElement("article"), data: data[i]};
                }
                return elementsWithData;
            },
            type: "function",
            children: [
                {
                    content: "h2",
                    type: "tag",
                    child: {
                        content: function (data, parent) {
                            if (data != undefined && data != undefined) {
                                return {data: data.data.name};
                            }
                        },
                        type: "function",
                        child: {
                            content: "[use-data]",
                            type: "text"
                        }
                    }
                },
                {
                    content: "p",
                    type: "tag",
                    children: [
                        {
                            content: "Date: ",
                            type: "text"
                        },
                        {
                            content: "time",
                            type: "tag",
                            child: {
                                content: function (data, parent) {
                                    parent.textContent = "";
                                    parent.append(document.createTextNode(data.data.close_approach_data.close_approach_date));
                                    parent.setAttribute("datetime", data.data.close_approach_data.epoch_date_close_approach);
                                },
                                type: "function"
                            }
                        }
                    ]
                },
                {
                    content: "table",
                    type: "tag",
                    child: {
                        content: "tbody",
                        type: "tag",
                        child: {
                            content: function (data) {
                                if (data != undefined) {

                                    data = app.api["api-nasa"].customFunctions.getRowData(data);

                                    const rowElements = data.map( function (d) {
                                        const tableRow = document.createElement("tr");
                                        let value = d.value;
                                        if (d.type == "boolean") {
                                            if (d.value) {
                                                value = "Yes";
                                            } else {
                                                value = "No";
                                            }

                                        }
                                        return {element: tableRow, data: {header: d.header, value: value}};
                                    });

                                    return rowElements;
                                }
                            },
                            type: "function",
                            children: [
                                {
                                    content: function (data) {
                                        const tableHeader = document.createElement("th");
                                        return {element: tableHeader, data: data.header};
                                    },
                                    type: "function",
                                    child: {
                                        content: "[use-data]",
                                        type: "text"
                                    }
                                },
                                {
                                    content: function (data) {
                                        const tableData = document.createElement("td");
                                        return {element: tableData, data: data.value};
                                    },
                                    type: "function",
                                    child: {
                                        content: "[use-data]",
                                        type: "text"
                                    }
                                }
                            ]
                        }
                    }
                }
            ]
        }
    ]
);
