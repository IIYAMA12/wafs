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
... ???
