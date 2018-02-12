(function () {
	let app;

	app = {
		init: function () {
			this.routes.init();
		},
		routes: {
			init: function () {


				// navigate directly when visiting the page without the navigation. Else it might get bugged, because the hash isn't triggered when it is the same url.
				let sectionName = window.location.href.split('#')[1];
				if (sectionName != undefined) {
					app.sections.toggle(sectionName);
				}

				/*
					 MDN web docs: "The hashchange event is fired when the fragment identifier of the URL has changed (the part of the URL that follows the # symbol, including the # symbol)."
					 https://developer.mozilla.org/en-US/docs/Web/Events/hashchange
				*/
				window.addEventListener("hashchange", function (e) {
					let sectionName = e.newURL.split('#')[1];
					app.sections.toggle(sectionName);
				});
			},
		},
		sections: {
			toggle: function (route) {
				const sections = document.querySelectorAll("body > *");

				for (let index = 0; index < sections.length; index++) {
					const element = sections[index];
					element.id == !window.location.href.split('#')[1] ?
						element.classList.add("hidden") :
						element.classList.remove("hidden");
				}
			},
		}
	}

	app.init();
})();
