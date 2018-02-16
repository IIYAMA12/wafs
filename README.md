# wafs
The course repo for 'Web App From Scratch'

## Advantages and disadvantages of JavaScript libraries/frameworks (lang NL)

### Voordeel
* Minder code schrijven en dus minder tijd kwijt. Het framework doet veel dingen op de achtergrond al voor je. (eigen ervaring)
* Features die gebruik maken van matrix en vector berekeningen, kunnen worden gebruikt zonder dat hier voor geleerd is. Denk hierbij aan de bibliotheek snap.svg, die gespecialiseerd is in svg animaties. Maar ook bijvoorbeeld d3, die complexe grafieken kan creëert. (eigen ervaring)
* Het kan gebruiksvriendelijker ontworpen zijn voor de gebruiker.


### Nadeel
* Het aanroepen van vervangende functies hebben vaak een langere Uitvoertijd tijd in vergelijking met Vanilla javascript. Dit is niet altijd zo omdat het framework er misschien een betere oplossing voor heeft om hetzelfde te doen. Maar meestal wel, omdat elke aanroeping extra tijd kost. Minder functies, betekend snellere code. (eigen ervaring)
* Nieuwe functies kunnen pas gebruikt worden na het upgraden van de code.
* Het upgraden van de framework/bibliotheek kan fouten veroorzaken in jouw systeem. Het is daarom belangrijk om de bugtracker te bekijken voordat je zo een upgrade maakt. Als er geen oplossing is, zit er niks anders op om te downgraden (of her te installeren bij back-end) als dat nog mogelijk is.
* De ondersteuning van het framework/bibliotheek kan vervallen. Dit kan vervelend worden op het moment dat de standaardisering van het web veranderd. Maar ook zou het kunnen dat een nog niet gevonden fout wordt ontdekt.
* Je leert niet de onderliggende principes van Vanilla Javascript.
* Langere downloadtijd benodigd.


[Bron Vanilla Javascript leren voor het werken met frameworks](https://snipcart.com/blog/learn-vanilla-javascript-before-using-js-frameworks)



## Advantages and disadvantages of client-side single page web apps (lang NL)


## Voor en nadelen single-page applicatie (SPA)

### Voordelen
* Een single-page is heel snel. Na het downloaden van alle website code (HTML, CSS, Javascript), hoeft alleen de data/content heen en weer.
* De server hoeft niet meer de pagina te renderen, na dat deze gedownload is. Dat doet clientside nu. Jorik: `Wat waarschijnlijk inhoud dat er minder serverbelasting is op dat gebied.`
* Makkelijker te debuggen. Alle data is clientside, hierdoor kan je makkelijk data vergelijken met de elementen op het scherm. (Jorik: `Er hoeft dus minder gekeken te worden naar sessies op serverside.`)
* Deze applicatie slaat alles op in het geheugen van de client, dat de mogelijkheid bied om na de download de website offline te laten werken.

### Nadelen
* Het is moeilijk om deze voor de zoekmachine te optimaliseren. De zoekmachine van Google indexeert elke beschikbare pagina op het web. Maar zal moeite hebben met AJAX (Asynchronous Javascript en XML), omdat Google niet standaard weet wanneer de website geladen is en of het überhaupt dit zou kunnen downloaden/lezen.
* Bij het downloaden van de pagina wordt gelijk de hele website met frameworks gedownload. Dit is een relatieve grote download in vergelijking met maar één pagina te downloaden.
* Javascript is ten alle tijden benodigd. Mocht deze uitstaan dan kan de website niet geladen worden op de juiste wijzen.
* De applicatie is minder veilig. Omdat er veel data via voornamelijk AJAX gecommuniceerd wordt tussen client en server. Je moet dus meer ingangen dichtmaken. (In het gevonden artikel wordt ook het volgende gezegd: “it enables attackers to inject client-side scripts into web application by other users”. Hoe dit zou gebeuren wordt niet duidelijk uitgelegd.)
* Gevoeliger voor geheugen lekken van Javascript.

## Voor en nadelen multiple-page applicatie

### Voordelen
* Je houdt beter overzicht over de website.
* Goed en makkelijk voor zoekmachines om te doorgronden.

### Nadelen
* Frontend en backend zijn sterk van elkaar afhankelijk.
* Het uitvoeren van de website wordt complexer omdat de bouwer het framework clientside of serverside moet gaan gebruiken. Het kan daarom langer duren voordat de website klaar is.

[Bron: Single-page vs multiple-page application](https://medium.com/@NeotericEU/single-page-application-vs-multiple-page-application-2591588efe58)

## Best practices

// todo //

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
    height: 100vh;
    width: 100vw;
    overflow: hidden; /* to prevent problems with overflow content */
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
[Template engine documentation](https://iiyama12.github.io/wafs/template-engine-doc)

## Experiment examples
* [Experiment prototype](https://iiyama12.github.io/wafs/experimental_examples/prototype)
* [Experiment classes and proxy](https://iiyama12.github.io/wafs/experimental_examples/classes_and_proxy)

## Code review

### Reviews of:
* [VincentKempers](https://github.com/VincentKempers/wafs/issues/7)
* [Kevin Wang](https://github.com/kyunwang/wafs/issues/1)

### Reviews by:
* [VincentKempers](https://github.com/IIYAMA12/wafs/issues/1)
* [Kevin Wang](https://github.com/IIYAMA12/wafs/pull/2)
