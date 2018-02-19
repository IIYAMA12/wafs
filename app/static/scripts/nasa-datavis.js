
const datavisComponent = (function (datavisCanvas) {

    const canvastSize = 1000;

    const svgWidth = canvastSize,
        svgHeight = canvastSize;

    // let elementData;

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



    const template = [
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
    ];




    const datavisComponent = {
        init: function () {
            const asteroidGroup = this.canvas.select("g");


            asteroidGroup
                .attr("width", svgWidth)
                .attr("height", svgHeight)
            ;
            // this.asteroidGroup = asteroidGroup;

        },
        canvas: datavisCanvas,
        load: function (data) {
            if (developingStatus) {
                templateEngine.render(
                [
                    {
                        query: "#test",
                        content: "ul",
                        type: "tag",
                        child: {
                            content: "I have been found!",
                            type:"text"
                        }
                    }
                ], document.body);
            }


            let asteroidGroup = this.canvas.select("g");
            const earth = this.canvas.select("image");

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




            asteroidGroup = asteroidGroup
                .selectAll("g")
                    .data(data, function (d) {
                        return d;
                    })
            ;


            asteroidGroup
                .exit()
                    .remove();

            asteroidGroupEnter = asteroidGroup
                    .enter();




            const asteroidsGroupEnter = asteroidGroupEnter
                .append("g")
                    .attr("transform", "translate(" + svgWidth + "," + -svgHeight + ")")

            ;





            const repeatEarthAnimation = function (rotation) {

                // it is required to make a new transition to make sure it doesn't get bugged. If not, then: Error: too late; already started
                var earthTransition = d3.transition()
                    .duration(6000)
                    .ease(d3.easeLinear)
                ;

                earth
                    .attr("transform", "rotate(" + rotation + ")");

                earth.transition(earthTransition)
                    .attr("transform", "rotate(" + (179 + rotation) + ")")
                        .on("end", function () {
                            repeatEarthAnimation(rotation + 180);
                        });
            };

            repeatEarthAnimation(0);


            let allAsteroidsSelectionD3 = [];

            asteroidsGroupEnter.each(function(d, i) {
                allAsteroidsSelectionD3[allAsteroidsSelectionD3.length] = d3.select(this);
            });


            let asteroidAnimationIndex = 0;
            // clearInterval(this.asteroidInterval);


            const moveAsteroid = function () {

                var asteroidTransition = d3.transition()
                    .duration(10000)
                    .ease(d3.easeLinear)
                ;

                if (allAsteroidsSelectionD3[asteroidAnimationIndex] != undefined && !allAsteroidsSelectionD3[asteroidAnimationIndex].empty()) {

                    allAsteroidsSelectionD3[asteroidAnimationIndex]
                        .transition(asteroidTransition)
                            .attr("transform", "translate(" + -svgWidth + "," + svgHeight + ")")
                            .on("end", function () {
                                moveAsteroid();
                            })
                    ;

                    const elementData = allAsteroidsSelectionD3[asteroidAnimationIndex].data()[0];

                    templateEngine.render(template, document.getElementById("api-nasa-gov"), elementData);

                    asteroidAnimationIndex++;
                } else { // reset
                    setTimeout(function () {
                        asteroidAnimationIndex = 0;
                        asteroidsGroupEnter
                            .attr("transform", "translate(" + svgWidth + "," + -svgHeight + ")")
                                .transition();
                    }, 8000);
                }
            };


            asteroidsGroupEnter.transition(); // stop animation
            moveAsteroid();


            // Use a single interval to activate one asteroid per X time.
            // this.asteroidInterval = setInterval(moveAsteroid, 4000);


            const contentScale = 0.7;

            const maxAbsolute_magnitude_h = d3.max(data.map(function (d) {

                return d.data.absolute_magnitude_h;
            }));

            var distanceScaling = d3.scaleLinear()
                .domain([0, maxAbsolute_magnitude_h])
                .range([40, 700]);

            asteroidsGroupEnter.append("line")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", function (d) {
                    if (d) {
                        return distanceScaling(d.data.absolute_magnitude_h);
                    }
                })
                .attr("y2", function (d) {
                    if (d) {
                        return distanceScaling(d.data.absolute_magnitude_h);
                    }
                })
                .attr("stroke", "white")
            ;


            // Maginute label
            asteroidsGroupEnter.append("text")
                .attr("x", function (d) {
                    if (d) {
                        return distanceScaling(d.data.absolute_magnitude_h) * 0.8 + 10;
                    }
                })
                .attr("y", function (d) {
                    if (d) {
                        return distanceScaling(d.data.absolute_magnitude_h) * 0.8 - 10;
                    }
                })
                .attr("fill", "white")
                .attr("font-size", "30")
                .text(function (d) {
                    if (d) {
                        return "Absolute magnitude " + d.data.absolute_magnitude_h;
                    }
                })
            ;

            // Asteroid size label
            asteroidsGroupEnter.append("text")
                .attr("x", function (d) {
                    if (d) {
                        return distanceScaling(d.data.absolute_magnitude_h) + (d.data.estimated_diameter.kilometers.estimated_diameter_max * 100 * 2 * contentScale /2);

                    }
                })
                .attr("y", function (d) {
                    if (d) {
                        return distanceScaling(d.data.absolute_magnitude_h) + (d.data.estimated_diameter.kilometers.estimated_diameter_max * 100 * 2 * contentScale) + 20;
                    }
                })
                .attr("fill", "white")
                .attr("font-size", "30")
                .attr("text-anchor", "middle")
                .text(function (d) {
                    if (d) {
                        return "Estimated diameter " + d.data.estimated_diameter.kilometers.estimated_diameter_max + "km";
                    }
                })
            ;


            asteroidsGroupEnter.append("circle")
                .attr("r", 5)
                .attr("cx", function (d) {
                    if (d) {
                        return distanceScaling(d.data.absolute_magnitude_h);
                    }
                })
                .attr("cy", function (d) {
                    if (d) {
                        return distanceScaling(d.data.absolute_magnitude_h);
                    }
                })
                .attr("fill", "rgb(200,0,0)")

            ;

            asteroidsGroupEnter.append("image")
                .attr("href", "static/images/asteroid.svg")
                .attr("x", function (d) {
                    if (d) {
                        return distanceScaling(d.data.absolute_magnitude_h);
                    }
                })
                .attr("y", function (d) {
                    if (d) {
                        return distanceScaling(d.data.absolute_magnitude_h);
                    }
                })
                .attr("height", function (d, i) {
                    if (d) {
                        // console.log("d.estimated_diameter_max", d.data.estimated_diameter.kilometers);
                        return d.data.estimated_diameter.kilometers.estimated_diameter_max * 100 * 2 * contentScale;
                    }
                    return 0;
                })
                .attr("width", function (d, i) {
                    if (d) {
                        // console.log("d.estimated_diameter_max", d.data.estimated_diameter.kilometers);
                        return d.data.estimated_diameter.kilometers.estimated_diameter_max * 100 * 2 * contentScale;
                    }
                    return 0;
                })
            ;
        }
    };
    datavisComponent.init();
    return datavisComponent;
})(d3.select("#api-nasa-gov svg"));
