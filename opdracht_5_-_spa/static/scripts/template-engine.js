const templateEngine = (function () {
    const templateEngine = {
        process: function (template, parentElement) {
            console.log("process");
            console.log(template);


            if (template != undefined && template.length > 0) {
                const apply = this.apply; // << optimisation
                for (let i = 0; i < template.length; i++) {
                    apply(template[i], parentElement);
                }
            }
        },
        addContent: function (parent, type, content) {
            if (parent != undefined && content != undefined) {
                if (type == undefined) {
                    type = "html";
                }
                console.log(parent);
                switch(type) {
                    case "html": // do not use html, as it can't be removed.
                        return parent.innerHTML += content;
                    case "text":
                        return (function () {
                            const newElement = document.createTextNode(content);
                            parent.textContent = "";
                            parent.append(newElement);
                            return true;
                        })();
                    case "tag":
                        return (function () {
                            newElement = document.createElement(content);
                            parent.append(newElement);
                            console.log("newElement", newElement);
                            return newElement;
                        })();
                }
            }
        },
        apply: function (instruction, parentElement) {
            let query = "";


            const newQuery = instruction.query;
            if (newQuery != undefined && newQuery != "") {

                query += " " + newQuery;
            }
            console.log("newQuery", query, instruction);


            if (instruction) {
                let content = instruction.content;
                if (content != undefined && parentElement != undefined) {
                    console.log(parentElement);
                    if (query != undefined && query != "") {
                        parentElement = parentElement.querySelector(query);
                    }
                    if (parentElement != undefined) {

                        let method = instruction.method;
                        if (method == undefined) {
                            method = "replace";
                        }
                        if (method == "replace") {
                            let oldElement = instruction.element;
                            
                            if (oldElement != undefined) {
                                if (app.utility.isElement(oldElement)) {

                                    if (app.utility.isElement(oldElement.parentNode)) {
                                        oldElement.parentNode.removeChild(oldElement);
                                    }
                                }
                                instruction.element = null;
                            }
                        }
                        parentElement = templateEngine.addContent(parentElement, instruction.type, content);
                        if (parentElement != undefined) {
                            instruction.element = parentElement;
                            console.log("parentElement", parentElement);
                            // if (instruction.type == "tag") {
                            //     query += " " + content;
                            // }
                        }
                    }
                }
            }

            // if (instruction.type != "tag") {
            //     const newQueryAfter = instruction.queryAfter;
            //     if (newQueryAfter != undefined && newQueryAfter != "") {
            //         query += " " + newQueryAfter;
            //     }
            // }
            // console.log("newQueryAfter", query, instruction);
            if (parentElement != undefined) {
                const instructionChildren = instruction.children;
                if (instructionChildren != undefined && instructionChildren.length > 0) {

                    const apply = templateEngine.apply; // << optimisation
                    for (let i = 0; i < instructionChildren.length; i++) {
                        apply(instructionChildren[i], parentElement);
                    }
                }
            }
            return true;
        }
    };

    return templateEngine;
})();
