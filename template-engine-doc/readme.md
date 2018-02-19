# Template engine

First of al, this system/syntax really doesn't look like a template engine. Neither it will do just that. It is for you to judge what this suppose to be.

[Source code](https://github.com/IIYAMA12/wafs/blob/master/app/static/scripts/template-engine.js)

Lets get started with what it can do. (basics)

## Basics
With basics, I mean really basics. Just let JavaScript generate different types of content. (Except for using functions)


### Building an element
Creating a single section. Each object inside of the template should be considered as an instruction.
* content: This is where you add your content which should matches the `type`.
* type: There are 3 different types. `tag`, `text`, `html`, `function`. Each of them require different content.

* tag: Datatype TEXT, a tagName.
* text: Datatype TEXT, any text you want.
* html: Datatype TEXT, html.
* function: Datatype FUNCTION, a function.


```JS
[
    {
        content: "section",
        type: "tag",
    }
]
```

Result:
```HTML
<section></section>
```

### Building with sub elements
If you want to insert sub elements. Then use the keynames `children` or `child` depending on the amount of elements. The keyname `children` stands for the ability to insert multiple child’s. You will need to wrap them around an array.

```JS
[
    {
        content: "section",
        type: "tag",
        children: [
            {
                content: "h1",
                type:"tag"
            },
            {
                content: "p",
                type: "tag",
            }
        ]
    }
]
```

```HTML
<section>
    <h1></h1>
    <p></p>
</section>
```


### Types in action: `tag`, `text`, `html`

```JS
[
    {
        content: "section",
        type: "tag",
        children: [
            {
                content: "h1",
                type:"tag",
                child: {
                    content: "Title text",
                    type: "text"
                }
            },
            {
                content: "p",
                type: "tag",
                child: {
                    content: "My body text",
                    type: "text"
                }
            }
        ]
    },
    {
        content: "article",
        type: "tag",
        child: {
            content: "p",
            type: "tag",
            child: {
                content: "Another piece of text",
                type: "text"
            }
        }
    },
    {
        content: "<article><p>Dirty html</p></article>",
        type: "html"
    }
]
```

Result:
```HTML
<section>
    <h1>Title text</h1>
    <p>My body text</p>
</section>
<article>
    <p>Another piece of text</p>
</article>
<div template-engine-wrapper="true">
    <article><p>Dirty html</p></article>
</div>
```

### Load template
For loading a template, you have to call the render method of the templateEngine. You have to pass the template into the first argument. The second argument has to be filled in with a DOM element, which where the template starts from applying instructions.

#### Syntax
```JS
    templateEngine.render(array template, Note startAtElement [, mix data]);
```
Required Arguments
* `template` A array value which contains the template.
* `startAtElement` A Note value which contains a dom element, where the engine will start building in.

Optional Arguments
* `data` A variable of any type, which you want to use in the template.

```JS
// The template
const template = [
    // ...
];

// Inside this element is where the template engine will start building up.
const startAtElement = document.getElementById("id");

// Add data to the root. (Note: the data which is flowing inside of the system is the original data. Make a copy of it, if you are going to mutate it inside.)
const data = {};

templateEngine.render(template, startAtElement, data);
```


I do recommended not to delete the template objects. Because when the exactly same template is applied again, all old elements will be `deleted automatic`. In this iteration this will be done by cutting down the subRoot elements on the bottom. Which means it will cut the first layer of elements, that are directly in the main array.


#### SubRoot
```JS
[
    {
        content: "section",
        type: "tag",
    },
    {
        content: "section",
        type: "tag",
    },
    {
        content: "section",
        type: "tag",
    },
]
```

Result: (SubRoot elements)
```HTML
<section></section>
<section></section>
<section></section>
```

## Advanced

### Query selection support

```HTML
<section id="test">
</section>
```

```JS
[
    {
        query: "#test",
        content: "p",
        type: "tag",
        child: {
            content: "I have been found!",
            type:"text"
        }
    }
]
```

Result:
```HTML
<section id="test">
    <p>I have been found!</p>
</section>
```

All queries will be applied to a querySelectorAll function. Keep in mind that the queries do start from the parent.
Queries that do start with `combinators` are also supported:

```CSS
> p {

}

+ article {

}

~ article {

}
```

### Functions
Using functions makes creating content much more easy. This function will be called when the template is processed.
In the first iteration dynamic data has to be placed on top of the template. This will change in the future.

```JS
[
    {
        content: "ul",
        type: "tag",
        child: {
            content: function (data) {
                const elements = [];
                for (let i = 0; i < data.length; i++) {
                    elements[elements.length] = document.createElement("li");
                }
                return elements;
            },
            type: "function",
            data: ["item:1", "item:2", "item:3"]
        }
    }
]
```

Result:
```HTML
<ul>
    <li></li>
    <li></li>
    <li></li>
</ul>
```


#### Sending back
Send multiple elements back.

```JS
[
    {
        content: function () {

            const element = document.createElement("p");
            const secondElement = document.createElement("p");

            return [{element: element}, {element: secondElement}];
        },
        type: "function",
    }
]
```
Send just one element back.
```JS
[
    {
        content: function () {

            const element = document.createElement("p");

            return {element: element};
        },
        type: "function",
    }
]
```

### Attach data on an instruction

```JS
[
    {
        content: "[use-data]",
        type: "tag",
        data: "section"
    }
]
```

Result:
```HTML
<section></section>
```

The keyword `[use-data]` is used by the `text` and `tag` type to use the passed data.
```JS
"[use-data]"
```



### Passing data to a text child
If you want to pass data to an element, then you have to send an object which contains the element as well as the data you want to pass.

```JS
{element: DOM_element, data: data}
```


```JS
[
    {
        content: "ul",
        type: "tag",
        child: {
            content: function (data) {
                const elementsWithData = [];
                for (let i = 0; i < data.length; i++) {
                    elementsWithData[elementsWithData.length] = {element: document.createElement("li"), data: data[i]};
                }
                return elementsWithData;
            },
            type: "function",
            child: {
                content: "[use-data]",
                type: "text"
            }
        },
        data: ["item:1", "item:2", "item:3"]
    }
]
```

Result:
```HTML
<ul>
    <li>item:1</li>
    <li>item:2</li>
    <li>item:3</li>
</ul>
```


### Inheritance
Once data has been send to the first layer of children. The data will be passed automatic to the children of the children.

```JS
[
    {
        content: "ul",
        type: "tag",
        child: {
            content: function () {
                const elementsWithData = [];
                for (let i = 0; i < 4; i++) {
                    elementsWithData[elementsWithData.length] = {element: document.createElement("li"), data: "p"};
                }
                return elementsWithData;
            },
            type: "function",
            child: {
                content: "[use-data]",
                type: "tag",
                child: {
                    content: "[use-data]",
                    type: "text"
                }
            }
        }
    }
]
```

Result:
```HTML
<ul>
    <li><p>p</p></li>
    <li><p>p</p></li>
    <li><p>p</p></li>
    <li><p>p</p></li>
</ul>
```

### Receive data and parent in to a function
When data is add by a parent, a child with the type `function` can receive the data at it's first parameter.

```JS
content: function (data, parent) {
    console.dir(data); // data can be found here!
    console.dir(parent); // parent can be found here!
},
```

```JS
[
    {
        content: "ul",
        type: "tag",
        child: {
            content: function (_, parent) {

                console.dir(parent); // <ul> can be found here!

                const elementsWithData = [];
                for (let i = 0; i < 4; i++) {
                    elementsWithData[elementsWithData.length] = {element: document.createElement("li"), data: "p"};
                }
                return elementsWithData;
            },
            type: "function",
            child: {
                content: function (data, parent) {
                    console.dir(data); // "p" can be found here!
                    console.dir(parent); // <li> can be found here!
                },
                type: "function",
            }
        }
    }
]
```

[Source code](https://github.com/IIYAMA12/wafs/blob/master/app/static/scripts/template-engine.js)
