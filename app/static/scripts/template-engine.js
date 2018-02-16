const templateEngine = (function () {
    const templateEngine = {
        process: function (template, parentElement) {
            if (template != undefined && template.length > 0) {
                const apply = this.apply; // << optimisation
                for (let i = 0; i < template.length; i++) {
                    template[i].subRoot = true; // this is for cutting the dom tree only at the bottom.
                    apply(template[i], parentElement);
                }
            }
        },
        addContent: function (parent, type, content, data) {

            if (parent != undefined && content != undefined) {
                if (type == undefined) { // no type? Use html for debug purposes.
                    type = "html";
                }

                switch(type) {
                    case "function": // Let a custom function handle how the elements are created.
                        return (function () {
                            const elementsOrDataWithElement = content(data, parent);
                            // todo retrieve data //
                            if (elementsOrDataWithElement != undefined && elementsOrDataWithElement.length > 0) {
                                const elementsWithData = [];
                                const isElement = app.utility.isElement;
                                for (let i = 0; i < elementsOrDataWithElement.length; i++) {
                                    const elementOrDataWithElement = elementsOrDataWithElement[i];
                                    if (isElement(elementOrDataWithElement)) {
                                        parent.append(elementOrDataWithElement);
                                        elementsWithData[elementsWithData.length] = {element: elementOrDataWithElement, data: data};

                                    } else if (typeof(elementsOrDataWithElement) == "object" && isElement(elementOrDataWithElement.element)) {
                                        elementsWithData[elementsWithData.length] = elementOrDataWithElement;
                                        parent.append(elementOrDataWithElement.element);
                                    }
                                }
                                return elementsWithData;
                            }
                            return false;
                        })();

                    case "html": // html injection
                        return (function () {
                            // A wrapper is required to make sure that injected html code is removed. I do not prefer to use this `case`. But might be handy if it comes to that.
                            const newElement = document.createTextNode("div");
                            newElement.innerHTML += content
                            newElement.setAttribute("template-engine-wrapper", true);
                            parent.append(newElement);
                            return [{element: newElement, data: data}];
                        })();

                    case "text": // create textContent
                        return (function () {

                            if (content === "[use-data]"){
                                content = data;
                            }
                            if (content != undefined) {
                                const newElement = document.createTextNode(content);
                                parent.textContent = "";
                                parent.append(newElement);
                                return true;
                            }
                        })();

                    case "tag": // create tag
                        return (function () {
                            if (content === "[use-data]"){
                                content = data;
                            }
                            if (content != undefined) {
                                const newElement = document.createElement(content);
                                parent.append(newElement);
                                return [{element: newElement, data: data}];
                            }
                        })();
                }
            }
        },
        apply: function (instruction, parent, data) {
            let query = "";

            // Set the parent as default start point.
            let parentElements = [parent];

            // Check and prepare query
            const newQuery = instruction.query;
            if (newQuery != undefined && newQuery != "") {
                query = newQuery;
            }

            // we found (new) data, lets flow it in the system.
            if (instruction.data != undefined) {
                data = instruction.data;
            }



            if (instruction) {
                let content = instruction.content;
                if (content != undefined && parent != undefined) {

                    if (query != undefined && query != "") {
                        const previousParent = parent.parentElement;
                        if (previousParent != undefined) {

                            // Using a tempolary attribute to use for the query selector. Which is used to support selections like this: `> tagName`. It is a hack!
                            parent.setAttribute("template-enige-temp", true);


                            parentElements = previousParent.querySelectorAll("[template-enige-temp] " + query.trim());

                            parent.removeAttribute("template-enige-temp");


                        }
                    }
                    if (parentElements != undefined && parentElements.length > 0) {

                        // experimental methods to no replace. Shouldn't be used at the moment because it might cause some unexpected results. Use the `function` type in template instead.
                        let method = instruction.method;
                        if (method == undefined) {
                            method = "replace";
                        }

                        if (method == "replace") {

                            // Get all old elements.
                            let oldElements = instruction.elements;

                            if (oldElements != undefined) {

                                // are the oldElements and are they are the subRoot. (Which is the first layer of elements)
                                if (instruction.subRoot && oldElements.length > 0) {

                                    const isElement = app.utility.isElement; // get utility element validator

                                    // Remove old subRoot elements.
                                    for (let i = 0; i < oldElements.length; i++) {
                                        const oldElement = oldElements[i];
                                        if (isElement(oldElement)) {
                                            oldElement.parentNode.removeChild(oldElement);
                                        }
                                    }
                                }

                                // Delete the references just to be clean.
                                delete instruction.elements;
                            }
                        }

                        // get all children from the instruction
                        let instructionChildren = instruction.children;
                        // add .child support
                        if (instructionChildren == undefined && instruction.child != undefined) {
                            instructionChildren = [instruction.child];
                        }

                        // collection of all elements. The bottom layer of the element will be used to cut off.
                        instruction.elements = [];

                        // these are the elements from the query all selection
                        for (let i = 0; i < parentElements.length; i++) {
                            const parentElement = parentElements[i];



                            // Make the new elements.
                            const newElementsWithData = templateEngine.addContent(parentElement, instruction.type, content, data);

                            // Validate the outcome.
                            if (newElementsWithData != undefined && newElementsWithData !== true && newElementsWithData.length > 0) {

                                // Go through all new created elements.
                                for (let elementIndex = 0; elementIndex < newElementsWithData.length; elementIndex++) {


                                    const newElementWithData = newElementsWithData[elementIndex];
                                    if (newElementWithData != undefined) {
                                        const newElement = newElementWithData.element;
                                        // collect the new created elements
                                        instruction.elements[instruction.elements.length] = newElement;

                                        // apply all new instructions
                                        if (instructionChildren != undefined && instructionChildren.length > 0) {

                                            // All new instructions apply to new elements.
                                            const apply = templateEngine.apply; // << optimisation

                                            for (let j = 0; j < instructionChildren.length; j++) {
                                                apply(instructionChildren[j], newElement, newElementWithData.data);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return true;
        }
    };

    return templateEngine;
})();