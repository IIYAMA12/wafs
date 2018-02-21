(function () {
    // Takes care of the routes.
    app.routes = {
        init () {


            // navigate directly when visiting the page without the navigation. Else it might get bugged, because the hash isn't triggered when it is the same url.
            let sectionName = this.getCurrentRoute();
            if (sectionName != undefined) {
                app.sections.toggle(sectionName);
            } else {
                app.sections.toggle("startscreen");
            }

            /*
                 MDN web docs: "The hashchange event is fired when the fragment identifier of the URL has changed (the part of the URL that follows the # symbol, including the # symbol)."
                 https://developer.mozilla.org/en-US/docs/Web/Events/hashchange
            */
            window.addEventListener("hashchange", (e) => {
                const sectionName = location.hash.split('#')[1];
                app.sections.toggle(sectionName);
            });
        },

        getCurrentRoute () {
            return location.href.split('#')[1];
        }
    };
})();
