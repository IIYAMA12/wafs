// ---------------------------------------- //
/*

    This module is used to manage API data.

*/
// ---------------------------------------- //


(function () {
    app.api = {
        ["api-nasa"]: {

            /*
                This method is used to get the API data.
            */
            requestData (requestCallback, errorCallBack) {

                // request the API from the localData (+ localStorage if no available)
                const localStorageData = app.localData.get("api-nasa", "JSON");

                // development state
                if (developmentStates.dataUnavailable) {
                    return;
                }

                // No data found in either localData and localStorage?
                if (localStorageData == undefined) {

                    // Start preparing the API JSONHttpRequest
                    const request = app.JSONHttpRequest.setup("api-nasa");

                    if (request != undefined) {

                        app.JSONHttpRequest.open(request, "GET", "https://api.nasa.gov/neo/rest/v1/feed?api_key=1NnMgn9RYxKvz0o2FDqdQ3poB6vtGreh8oLahlBy", true);

                        // attach callback for success
                        request.customData.callBack = (rawData) => {
                            const data = JSON.parse(rawData);
                            if (data != undefined) {
                                let nearEarthObjects = data["near_earth_objects"];

                                for(let date in nearEarthObjects){
                                    const asteroids = nearEarthObjects[date];
                                    for (let i = 0; i < asteroids.length; i++) {
                                        const asteroid = asteroids[i];
                                        // remove one index level for the data at key close_approach_data.
                                        const closeApproachData = asteroid["close_approach_data"][0];
                                        asteroid["close_approach_data"] = closeApproachData;
                                    }
                                }



                                const dataToArray = Object.entries(nearEarthObjects);


                                /* converted a for loop method to a reduce method */
                                // nearEarthObjects = []; // clear the data and re-use
                                // merge sub objects in to single array (filter and map doesn't help me with that...)
                                // for (let i = 0; i < dataToArray.length; i++) {
                                //     const subItem = dataToArray[i];
                                //
                                //     const date = subItem[0];
                                //     const subItemData = subItem[1];
                                //
                                //     for (let j = 0; j < subItemData.length; j++) {
                                //         const data = subItemData[j];
                                //         nearEarthObjects[nearEarthObjects.length] = {
                                //             date: date,
                                //             data: data
                                //         };
                                //     }
                                // }

                                nearEarthObjects = dataToArray.reduce(function(newArray, subItem) {
                                    const date = subItem[0];
                                    const subItemData = subItem[1];

                                    newArray = subItemData.reduce(function(newArray, data) {
                                        newArray[newArray.length] = {
                                            date: date,
                                            data: data
                                        };

                                        return newArray;
                                    }, newArray);

                                    return newArray;
                                  },
                                  []
                                );



                                nearEarthObjects = app.utility.deepConvertToNumber(nearEarthObjects);

                                // save in to localData and localStorage
                                app.localData.set("api-nasa", nearEarthObjects, "JSON");

                                // data is available, pass it over to page management
                                requestCallback(nearEarthObjects);
                            }
                        };

                        // attach callback for error
                        request.customData.errorCallBack = errorCallBack;

                        // Send the request
                        app.JSONHttpRequest.send("api-nasa");


                    }
                } else {
                    // data is available, pass it over to page management
                    requestCallback(localStorageData);
                }
            },

            /*
                This method is used to receive the object `rowsStaticData`.
                If data is passed in to it. It will automatically fill it in, like auto fill in on to a web form.
            */
            getRowData (dataToMap) {
                const rowsStaticData = [
                    {indexes:["absolute_magnitude_h"], header: "Absolute magnitude", type:"number"},
                    {indexes:["estimated_diameter", "feet", "estimated_diameter_max"], header: "Feet (Estimated diameter)", type: "number"},
                    {indexes:["estimated_diameter", "kilometers", "estimated_diameter_max"], header: "Kilometers (Estimated diameter)", type: "number"},
                    {indexes:["estimated_diameter", "meters", "estimated_diameter_max"], header: "Meters (Estimated diameter)", type: "number"},
                    {indexes:["estimated_diameter", "miles", "estimated_diameter_max"], header: "Miles (Estimated diameter)", type: "number"},
                    {indexes:["is_potentially_hazardous_asteroid"], header: "Is potentially hazardous asteroid", type: "boolean"},
                    // {indexes:["close_approach_data", "close_approach_date"], header: "Close approach date"},
                    {indexes:["close_approach_data", "miss_distance", "astronomical"], header: "Astronomical (distance)", type: "number"},
                    {indexes:["close_approach_data", "miss_distance", "kilometers"], header: "Kilometers (distance)", type: "number"},
                    {indexes:["close_approach_data", "miss_distance", "lunar"], header: "Lunar (distance)", type: "number"},
                    {indexes:["close_approach_data", "miss_distance","miles"], header: "Miles (distance)", type: "number"},
                    {indexes:["close_approach_data", "orbiting_body"], header: "Orbiting body", type: "string"},
                    {indexes:["close_approach_data", "relative_velocity", "kilometers_per_hour"], header: "Kilometers per hour (velocity)", type: "number"},
                    {indexes:["close_approach_data", "relative_velocity", "kilometers_per_second"], header: "Kilometers per second (velocity)", type: "number"},
                    {indexes:["close_approach_data", "relative_velocity", "miles_per_hour"], header: "Miles per hour (velocity)", type: "number"},
                    {indexes:["links", "self"], header: "Links", type: "link"},
                ];

                // find and add data from `dataToMap` on to `rowsStaticData`
                const rowsData = rowsStaticData.map(function (d) {
                    const rowIndexes = d.indexes;
                    let value = "";
                    if (dataToMap != undefined) {
                        value = dataToMap.data;
                        for (let i = 0; i < rowIndexes.length; i++) {
                            if (value != undefined) {
                                value = value[rowIndexes[i]];
                            } else {
                                value = null;
                            }
                        }
                    }
                    return {value:value, header: d.header, type: d.type};
                });

                return rowsData;
            }
        }
    };
})();
