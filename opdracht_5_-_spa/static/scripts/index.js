(function () {
    let app;

    app = {
        init : function () {
            this.routes.init();
        },
        routes : {
            init : function () {


                // navigate directly when visiting the page without the navigation. Else it might get bugged, because the hash isn't triggered when it is the same url.
                let initialSectionName = window.location.href.split('#')[1];
                if (initialSectionName != undefined) {
                    app.sections.toggle(initialSectionName);
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
        sections : {
            toggle : function (route) {

                const sectionData = this.data[route];
                if (sectionData != undefined) {

                    var sectionID = sectionData.id;

                    // show the right section
                    const sections = document.querySelectorAll("body > *");
                    for (let index = 0; index < sections.length; index++) {
                        const element = sections[index];
                        element.classList.add("hidden");
                    }
                    document.getElementById(sectionID).classList.remove("hidden");
                }
            },
            data : {
                startscreen : {
                    id : "startscreen"
                },
                bestPractices : {
                    id : "best-practices"
                },
                navigation : {
                    id : "main-nav"
                },
            }
        }
    }

    app.init();
})();
