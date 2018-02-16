# Template engine

First of al, this really doesn't like a template engine. Neither it will do just that. It is for you to judge what this suppose to be.

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
If you want to insert elements while generating. Use the keynames `children` or `child` depending on the amount of elements. The keyname `children` stands for the ability to insert multiple child’s. You will need to wrap them around an array.

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


###

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
