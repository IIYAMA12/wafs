const slideshowContainer = (function (datavisCanvas) {

    const canvastSize = 1000;

    const svgWidth = canvastSize,
        svgHeight = canvastSize;




    const slideshowContainer = {
        init () {
            const asteroidGroup = this.canvas.select("g");


            asteroidGroup
                .attr("width", svgWidth)
                .attr("height", svgHeight)
            ;
            // this.asteroidGroup = asteroidGroup;
            return true;
        },
        canvas: datavisCanvas,
        load (data) {



            let asteroidGroup = this.canvas.select("g");
            const earthGroup = this.canvas.select("g:nth-child(2)");
            const earth = earthGroup.select("g > image");

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

            // Remove all old items.
            asteroidGroup
                .exit()
                    .remove();

            // Create on enter.
            asteroidGroupEnter = asteroidGroup
                    .enter();




            const asteroidsGroupEnter = asteroidGroupEnter
                .append("g")
                    .attr("transform", "translate(" + svgWidth + "," + -svgHeight + ")")

            ;


            const repeatEarthAnimation = function (rotation) {

                // it is required to make a new transition to make sure it doesn't get bugged. If not, then: Error: too late; already started
                var earthTransition = d3.transition();

                earth
                    .attr("transform", "rotate(" + rotation + ")");

                earth.transition(earthTransition)
                    .duration(2000)
                    .attr("transform", "rotate(" + (179 + rotation) + ")")
                        .on("end", function () {
                            repeatEarthAnimation(rotation + 180);
                        });
            };
            repeatEarthAnimation(0);


            var earthGrowTransition = d3.transition();


            earth.on("mouseover", function() {
                earthGroup.transition();
                setTimeout(function (){
                    earthGroup.transition(earthGrowTransition)
                        .duration(3000)
                        .attr("transform", "scale(3)");
                }, 50);
            });

            earth.on("mouseout", function() {
                earthGroup.transition();
                setTimeout(function (){
                    earthGroup.transition(earthGrowTransition)
                        .duration(3000)
                        .attr("transform", "scale(1)");
                }, 50);
            });





            let allAsteroidsSelectionD3 = [];

            asteroidsGroupEnter.each(function(d, i) {
                allAsteroidsSelectionD3[allAsteroidsSelectionD3.length] = d3.select(this);
            });


            let asteroidAnimationIndex = 0;
            // clearInterval(this.asteroidInterval);


            const moveAsteroid = function () {

                var asteroidTransition = d3.transition();

                if (allAsteroidsSelectionD3[asteroidAnimationIndex] != undefined && !allAsteroidsSelectionD3[asteroidAnimationIndex].empty()) {

                    allAsteroidsSelectionD3[asteroidAnimationIndex]
                        .transition(asteroidTransition)
                        .duration(12000)
                        .ease(d3.easeSinInOut)
                            .attr("transform", "translate(" + -svgWidth + "," + svgHeight + ")")
                            .on("end", function () {
                                moveAsteroid();
                            })
                    ;

                    const elementData = allAsteroidsSelectionD3[asteroidAnimationIndex].data()[0];

                    const template = app.sections.template.get("slideshow");
                    templateEngine.render(template, document.getElementById("nasa-slideshow"), elementData);

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
                .range([40, 600]);

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
            return true;
        },
        unload () {
            this.canvas.select("g").selectAll("g").transition(); // stop animation (animation events goes ON even if the objects are removed...)
            this.canvas.select("g").selectAll("g").remove();
            return true;
        }
    };

    slideshowContainer.init();
    return slideshowContainer;
})(d3.select("#nasa-slideshow svg"));
