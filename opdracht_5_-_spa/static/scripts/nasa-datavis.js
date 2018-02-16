
const datavisComponent = (function (datavisCanvas) {

    const canvastSize = 1000;

    const svgWidth = canvastSize,
        svgHeight = canvastSize;

    let elementData;
    const rowsIndex = [
        ["absolute_magnitude_h"],
        ["estimated_diameter", "feet", "estimated_diameter_max"],
        ["estimated_diameter", "kilometers", "estimated_diameter_max"],
        ["estimated_diameter", "meters", "estimated_diameter_max"],
        ["estimated_diameter", "miles", "estimated_diameter_max"],
        ["is_potentially_hazardous_asteroid"],
        ["close_approach_data", "close_approach_date"],
        ["close_approach_data", "miss_distance", "astronomical"],
        ["close_approach_data", "miss_distance", "kilometers"],
        ["close_approach_data", "miss_distance", "lunar"],
        ["close_approach_data", "miss_distance","miles"],
        ["close_approach_data", "orbiting_body"],
        ["close_approach_data", "relative_velocity", "kilometers_per_hour"],
        ["close_approach_data", "relative_velocity", "kilometers_per_second"],
        ["close_approach_data", "relative_velocity", "miles_per_hour"],
        ["links"]
    ];



    const template = [
        {
            content: function () {
                const data = elementData;
                const element = document.createElement("h3");
                if (data != undefined && data != undefined) {
                    // console.table(data);
                    const textNode = document.createTextNode(data.data.name);
                    element.append(textNode);
                }

                return [{element: element, data: data}];
            },
            type: "function",

        },
        {
            query: "table tbody tr:nth-child(2)",
            content: function () {
                const data = elementData;
                if (data != undefined) {

                    const rowElements = [];
                    for (let i = 0; i < rowsIndex.length; i++) {
                        const tableData = document.createElement("td");
                        const rowIndexes = rowsIndex[i];
                        let textNodeText = data.data;
                        for (let j = 0; j < rowIndexes.length; j++) {
                            if (textNodeText != undefined) {
                                textNodeText = textNodeText[rowIndexes[j]];
                                // console.log(rowIndexes[j]);
                            } else {
                                textNodeText = null;
                            }
                        }

                        console.log(">>>", textNodeText);
                        rowElements[rowElements.length] = {element: tableData, data: textNodeText};
                    }
                    console.table(rowElements.length, rowElements);
                    return rowElements;
                }
            },
            type: "function",
            child: {
                content: "[use-data]",
                type: "text",
            }
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
            clearInterval(this.asteroidInterval);


            const moveAsteroid = function () {
                var asteroidTransition = d3.transition()
                    .duration(10000)
                    .ease(d3.easeLinear)
                ;

                if (allAsteroidsSelectionD3[asteroidAnimationIndex] != undefined && !allAsteroidsSelectionD3[asteroidAnimationIndex].empty()) {

                    allAsteroidsSelectionD3[asteroidAnimationIndex]
                        .transition(asteroidTransition)
                            .attr("transform", "translate(" + -svgWidth + "," + svgHeight + ")")
                                // .attr("transform", "translate(" + svgWidth + "," + -svgHeight + ")")
                    ;

                    elementData = allAsteroidsSelectionD3[asteroidAnimationIndex].data()[0];

                    templateEngine.process(template, document.getElementById("api-nasa-gov"));

                    asteroidAnimationIndex++;
                } else { // reset
                    setTimeout(function () {
                        asteroidAnimationIndex = 0;
                        asteroidsGroupEnter
                            .attr("transform", "translate(" + svgWidth + "," + -svgHeight + ")");
                    }, 8000);
                }
            };

            moveAsteroid();

            // Use a single interval to activate one asteroid per X time.
            this.asteroidInterval = setInterval(moveAsteroid, 4000);


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
