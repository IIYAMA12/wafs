
const developingStatus = true;


const app = (function () {
	'use strict';

	const app = {
		init () {
			this.JSONHttpRequest.init(); // order matters!
			this.routes.init();
			this.sections.init();
			gridItemsContainer.init();
			slideshowContainer.init();
		},
		api: {
			["api-nasa"]: {
				customFunctions: {
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
			}
		}
	};

    // All other scripts loaded?
    window.addEventListener("load", () => {
        app.init();
    });

    return app;
})();


if (developingStatus) {
	// templateEngine.render(, document.body);
}
