
const datavisComponent = (function (datavisCanvas) {
    console.log(datavisCanvas);
    const datavisComponent = {
        init: function () {
            const asteroidGroup = datavisComponent.canvas.select("g");
            this.asteroidGroup = asteroidGroup;
        },
        canvas: datavisCanvas,
        load: function (data) {
            let asteroidGroup = datavisComponent.canvas.select("g");


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
                    });




            asteroidGroupEnter = asteroidGroup
                    .enter();



            const asteroidsGroupEnter = asteroidGroupEnter
                .append("g");



            asteroidsGroupEnter.append("circle")
                .attr("r", function (d, i) {
                    if (d) {
                        // console.log("d.estimated_diameter_max", d.data.estimated_diameter.kilometers);
                        return d.data.estimated_diameter.kilometers.estimated_diameter_max * 100;
                    }
                    return 0;
                })
                .attr("cy", 10)
                .attr("cx", 10)
                .attr("fill", "rgba(0,0,0,0)")
                .attr("stroke", "black");

        }
    };
    datavisComponent.init();
    return datavisComponent;
})(d3.select("#api-nasa-gov svg"));
