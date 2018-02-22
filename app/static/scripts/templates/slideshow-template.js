//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
// RTFM!!! https://github.com/IIYAMA12/wafs/tree/master/template-engine-doc:
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////


app.sections.template.add("slideshow",
    [
        {
            query: "> h2",
            content: function (data, parent) {
                if (data != undefined && data != undefined) {

                    const textNode = document.createTextNode(data.data.name);
                    parent.textContent = "";
                    parent.append(textNode);
                }
            },
            type: "function",

        },
        {
            query: "> p time",
            content: function (data, parent) {
                parent.textContent = "";
                parent.append(document.createTextNode(data.data.close_approach_data.close_approach_date));
                parent.setAttribute("datetime", data.data.close_approach_data.epoch_date_close_approach);
            },
            type: "function"

        },
        {
            query: "table tbody",
            content: function (data) {
                if (data != undefined) {
                    data = app.api["api-nasa"].getRowData(data);

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
                        console.log(data);
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
        },
    ]
);
