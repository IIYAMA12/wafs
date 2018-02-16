var promise1 = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve("We did it!");
    }, 1000);
});

promise1.then(function (result) {
    console.log("Promise resolved", result);
});
