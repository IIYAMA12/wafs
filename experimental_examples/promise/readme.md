
# Promise


```JS
var promise1 = new Promise(function (resolve, reject) {
    setTimeout(function () {
        if (Math.random() > 0.5) {
            resolve("We did it!");
        } else {
            reject("We failed!");
        }
    }, 1000);
});
```


```JS
promise1.then(function (result) {
    console.log("Promise resolved:", result);
}).catch(function (result) {
    console.log("Promise reject:", result);
});
```
