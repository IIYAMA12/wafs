/*

	Settings below disable components in the system.

*/
const developmentStates = {

	dataUnavailable: false, // before Promise (warning)

	rejectJSONRequest: false,

	disableLocalStorage: false

};


const app = (function () {
	'use strict';

	const app = {
		init () {
			// can be found in /modules
			this.JSONHttpRequest.init(); // order matters!

			gridItemsContainer.init();
			slideshowContainer.init();

			// can be found in /modules
			this.sections.init();
			this.routes.init(); // Routes as last. !important!
		}
	};

    // All other scripts loaded?
    window.addEventListener("load", () => {
        app.init();
    });

    return app;
})();
