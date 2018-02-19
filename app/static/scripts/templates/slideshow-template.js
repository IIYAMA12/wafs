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
                    const rowsData = [
                        {indexes:["absolute_magnitude_h"], header: "Absolute magnitude"},
                        {indexes:["estimated_diameter", "feet", "estimated_diameter_max"], header: "Feet (Estimated diameter)"},
                        {indexes:["estimated_diameter", "kilometers", "estimated_diameter_max"], header: "Kilometers (Estimated diameter)"},
                        {indexes:["estimated_diameter", "meters", "estimated_diameter_max"], header: "Meters (Estimated diameter)"},
                        {indexes:["estimated_diameter", "miles", "estimated_diameter_max"], header: "Miles (Estimated diameter)"},
                        {indexes:["is_potentially_hazardous_asteroid"], header: "Is potentially hazardous asteroid"},
                        // {indexes:["close_approach_data", "close_approach_date"], header: "Close approach date"},
                        {indexes:["close_approach_data", "miss_distance", "astronomical"], header: "Astronomical (distance)"},
                        {indexes:["close_approach_data", "miss_distance", "kilometers"], header: "Kilometers (distance)"},
                        {indexes:["close_approach_data", "miss_distance", "lunar"], header: "Lunar (distance)"},
                        {indexes:["close_approach_data", "miss_distance","miles"], header: "Miles (distance)"},
                        {indexes:["close_approach_data", "orbiting_body"], header: "Orbiting body"},
                        {indexes:["close_approach_data", "relative_velocity", "kilometers_per_hour"], header: "Kilometers per hour (velocity)"},
                        {indexes:["close_approach_data", "relative_velocity", "kilometers_per_second"], header: "Kilometers per second (velocity)"},
                        {indexes:["close_approach_data", "relative_velocity", "miles_per_hour"], header: "Miles per hour (velocity)"},
                        {indexes:["links", "self"], header: "Links"},
                    ];
                    const rowElements = [];
                    for (let i = 0; i < rowsData.length; i++) {
                        const tableRow = document.createElement("tr");
                        const rowIndexes = rowsData[i].indexes;
                        let value = data.data;
                        for (let j = 0; j < rowIndexes.length; j++) {
                            if (value != undefined) {
                                value = value[rowIndexes[j]];
                                // console.log(rowIndexes[j]);
                            } else {
                                value = null;
                            }
                        }


                        rowElements[rowElements.length] = {element: tableRow, data: {headerText: rowsData[i].header, value: value}};
                    }
                    return rowElements;
                }
            },
            type: "function",
            children: [
                {
                    content: function (data) {
                        const tableHeader = document.createElement("th");
                        return {element: tableHeader, data: data.headerText};
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
