const developmentStates = {

	dataUnavailable: true, // before Promise (warning)

	rejectJSONRequest: false,

	disableLocalStorage: false

};


const app = (function () {
	'use strict';

	const app = {
		init () {
			this.JSONHttpRequest.init(); // order matters!
			gridItemsContainer.init();
			slideshowContainer.init();

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
