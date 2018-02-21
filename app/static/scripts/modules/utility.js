(function () {
    app.utility = { // https://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
        isElement (element) {
            return element instanceof Element;
        }
    };
})();
