
# wafs
The course repo for 'Web App From Scratch'

This an experimental Single page web application. It is also one of my first attempts to build one.


[Web app from scratch](https://iiyama12.github.io/wafs/app)

! Warning !
If you did visit this page during the development process, then please delete your localStorage of this page. Else it might give you an error related to: `data.slice isn't a method`. The new data has a different structure, which is now an array instead of an object. The method slice doesn't exist for objects. (I noticed that this issue exist, after using another browser.)

## Table of contents
[Advantages and disadvantages of JavaScript libraries/frameworks](#advantages-and-disadvantages-of-javaScript-libraries/frameworks)




## Advantages and disadvantages of JavaScript libraries/frameworks

### Advantages
* Writing less code, which means it it will cost less time.
* Features that use matrixes and vectors are available, which you can use without learning how they really work. Libraries like snap.svg which are specified in svg animations are making use of this. Also D3 is also included features like that for complex graphs.
* It can be designed more user friendly.


### Disadvantages
* Calling from replaced functions do have often a longer execution time in compare to Vanilla JavaScript. This isn’t always true, because the framework might have a better solution to do something better.
* New functions can only be used after upgrading the code of the framework.
* Updating the framework can create bugs in to your own designed system, as it is technically a part of it. Because of that is it important to check bug tracker before you upgrade. If there is no solution for the bug, then you probably have to downgrade or disable a component if that is possible.
* The support of a framework can be stopped. This can be annoying when there are still bugs in it or if the web standardization is changing.
* You do no longer learn the basic principles of Vanilla Javascript.
* Longer download time.


[Bron Vanilla Javascript leren voor het werken met frameworks](https://snipcart.com/blog/learn-vanilla-javascript-before-using-js-frameworks)



## Advantages and disadvantages of single-page applications (SPA)

### Advantages
* A single-page is very fast. After downloading all website code (HTML, CSS, JavaScript), only the NEW required data/content to be downloaded and send.
* The server doesn’t have to prepare the page, before the page is send to the client. This will be done by the client. Jorik: “That probably means less server cpu usage.”
* Easier to debug. All data is clientside, which means that you can compare the data as well as access the data.
* The application saves everything in the memory of the client, that makes it possible to use the site offline after downloading it.

### Disadvantages
* It is harder to optimise for search engines. The search engine from Google will index every page on the web. But this will be hard with AJAX (Asynchronous Javascript en XML), because Google doesn’t know when the page has been loaded.
* The first time the page will be downloaded, the whole framework is downloaded with it. This is a relative large download in compare of downloading a single page.
* Javascript is always required, as almost nothing will work without it.
* The application is less secure, because a lot of communication has to be done with AJAX. Which means that there are a lot of ways in and out that you have to protect. In the article they even talk about code injections on clients: “it enables attackers to inject client-side scripts into web application by other users”.)
* It is more vulnerable for memory leaks.


### Advantages and disadvantages multiple-page application


### Advantages
* Better overview of the website
* Easier for search engines to analyse.

### Disadvantages
* Frontend and backend do require each other to operate.
* Building of the website becomes more complex because the programmer has to use the framework client side or server side. Because of that it can last longer before the website is finished.

[Bron: Single-page vs multiple-page application](https://medium.com/@NeotericEU/single-page-application-vs-multiple-page-application-2591588efe58)


## APP flow and structure

### Object methods diagram (v2.0)
![Flow diagram](readme_content/flow-diagrams_v2.png)


### Object methods diagram with global flow (v1.0)
![Flow diagram](readme_content/flow-diagrams.png)
This flow shows most of the global methods that are used in the app. It also shows you the global flow. The flow starts with an event which triggers on hash change. This is in the app used to detect if the `virtual`/`fake` page has been changed. After that there is a chain of methods calling each other to: change section, get API data, render the page.

Take a:
```HTML
<br><!-- not in your html of course -->
```


### Hash change flow
![User flow diagram: Hash change](readme_content/flow-diagrams-user.png)
Information about hash change conditions and feedback/error handling.

### Filter and sort flow
![User flow diagram: filter & sort](readme_content/flow-diagrams-filter-sort.png)
Information about the filter and sort flow.

## Best practices


### Prototype
The prototype method seems to be very powerful. Unfortunately I am very new to this method and do not normally use it to achieve my work. It took some time figure out how I could use it to support my code, but here it is:
```js
app.JSONHttpRequest = {
    init () {
        XMLHttpRequest.prototype.addEventListeners = function () {
            this.addEventListener("load", app.JSONHttpRequest.loaded);
            this.addEventListener("progress", app.JSONHttpRequest.progress);
            this.addEventListener("error", app.JSONHttpRequest.error);
            this.addEventListener("abort", app.JSONHttpRequest.abort);
        };
        XMLHttpRequest.prototype.removeEventListeners = function () {
            this.addEventListener("load", app.JSONHttpRequest.loaded);
            this.addEventListener("progress", app.JSONHttpRequest.progress);
            this.addEventListener("error", app.JSONHttpRequest.error);
            this.addEventListener("abort", app.JSONHttpRequest.abort);
        };
    }
}
```
I used the prototype method to add and remove multiple addEventListener's.

Extension readme:
* [Experiment prototype](https://iiyama12.github.io/wafs/experimental_examples/prototype)

## Web app

### Building up the html

At the start of the single page app, you create all your `pages` wrapper elements. In this example I used for the pages 1 navigation and 2 section elements.

```HTML
<nav id="main-nav">
    <h2>Navigation</h2>
    <ul>
        <li><a href="#startscreen">Startscreen</a></li>
        <li><a href="#bestPractices">Best practices</a></li>
    </ul>
</nav>
<section id="startscreen" class="hidden">
    <h2>Startscreen</h2>
    <a href="#navigation">Navigation</a>
</section>
<section id="best-practices" class="hidden">
    <h2>Best practices</h2>
    <a href="#navigation">Navigation</a>
</section>
```
### Basic css required

It is very important to make the body, html and as well as the pages full screen and disable the overflow. Especially if you design the app for all browsers, disabling the overflow for all those elements is very important.

```CSS
body > *, body, html {
    width: 100vw;
    overflow-x: hidden; /* to prevent problems with overflow content */
}
```
To hide pages, a class might be handy.
* `display` with the value `none` is used to remove the bounding-box
* `visibility` is used to stop rendering.

```CSS
.hidden {
    display: none;
    visibility: hidden;
}
```

### JavaScript

Around all the code is a IIFE used to reduce the function scope length. It will make sure that it is less likely for code outside of the IIFE is able to interact with it.
A `IIFE` is a function which is wrapped around other code. After loading the code inside, it will call it self to execute it.

```JavaScript
(function () {
    // IIFE
})();
```


The next step is to write the app object. As it is the `APP` I prefer to write everything which is related to it inside of it.

```JavaScript
(function () {
    let app;

    app = {
        //
    }
})();
```

#### Add the MAIN things our app can do!
Now lets add the MAIN things we can do with the app or what the app should do by itself.
And for our excitement, lets start it up!

```js
(function () {
    let app;

    app = {
        init : function () {
            // We should call this function when the app has been loaded
            console.log("We have been started!");
        },
        routes : {
            // Lets handle our routes. (with the URL of course)
        },
        sections : {
            // Manage the pages
        }
    }

    // Get ready! We are going to start it when the app object has been initialized!
    app.init();
})();
```

#### Hash change detection

The next step is to detect if the URL hash has been changed. We can use the event `hashchange` for that.

##### Hash change example:
* URL: index.html
* URL: index.html#changed


```js

    (function () {
        let app;

        app = {
            init : function () {
                // Let when the page has been loaded, lets set up our routes management.
                this.routes.init();
            },
            routes : {
                // Adding an addEventListener to check if the URL hash has been changed.
                window.addEventListener("hashchange", function (e) {
                    console.log("URL hash has been changed! And the new URL is:", e.newURL)
                });
            },
            sections : {
                // Manage the pages
            }
        }

        // Get ready! We are going to start it when the app object has been initialized!
        app.init();
    })();
```




[Web app from scratch](https://iiyama12.github.io/wafs/app)

```CSS
/*
    NEW NEW NEW NEW NEW NEW
    NEW NEW NEW NEW NEW NEW
    NEW NEW NEW NEW NEW NEW
    NEW NEW NEW NEW NEW NEW
    NEW NEW NEW NEW NEW NEW
    \ \ \ \ \ \ / / / / / /
     \ \ \ \ \ / / / / / /
      \ \ \ \ / / / / / /
       \ \ \ / / / / / /
        \ \ / / / / / /
         \ / / / / / /
*/


```

## CUSTOM Template engine
[Template engine documentation](https://github.com/IIYAMA12/wafs/tree/master/template-engine-doc)
DON'T even try to think about SKIPPING THIS!
```CSS
/*
\ \ \ \ \ \ / / / / / / \ \
 \ \ \ \ \ / / / / / /  \ \
  \ \ \ \ / / / / / / \ \ \
   \ \ \ / / / / / /\ \ \ \
    \ \ / / / / / / \ \ \ \
     \ / / / / / /  \ \ \ \
*/

```

## Function notations

### Function notations I am using by default
```JS
var functionName = function () {
    // ...
}
function functionName () {
    // ...        
}
```


### Arrow function for addEventListener's
Those are only used in addEventListener's to pass the correct `this` predefined variable in to the function scope. (I am not very happy about how they look like. Super UGLY!)
```JS
window.addEventListener("load", () => {
    // ...
});
```

### Shorthand function in objects
Those are used to match my coding style with arrow functions. I am not very happy about those because functions with `function declaration` are much clearer.

```JS
const exampleObject = {
    functionName() {

    }
}
```




[Different function declarations](https://dmitripavlutin.com/6-ways-to-declare-javascript-functions/)


## Experiment examples (extension of this readme)
* [Experiment promise (extension readme)](https://iiyama12.github.io/wafs/experimental_examples/promise)
* [Experiment classes and proxy (extension readme)](https://iiyama12.github.io/wafs/experimental_examples/classes_and_proxy)

## Code review

### Reviews of:
* [VincentKempers](https://github.com/VincentKempers/wafs/issues/7)
* [Kevin Wang](https://github.com/kyunwang/wafs/issues/1)

### Reviews by:
* [VincentKempers](https://github.com/IIYAMA12/wafs/issues/1)
* [Kevin Wang](https://github.com/IIYAMA12/wafs/pull/2)
