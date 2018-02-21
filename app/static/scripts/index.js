
const developingStatus = true;


const app = (function () {
	'use strict';

	const app = {
		init () {
			this.JSONHttpRequest.init(); // order matters!
			this.routes.init();
			this.sections.init();
		}
	}

    // All other scripts loaded?
    window.addEventListener("load", () => {
        app.init();
    });

    return app;
})();


if (developingStatus) {
	// templateEngine.render(, document.body);
}
