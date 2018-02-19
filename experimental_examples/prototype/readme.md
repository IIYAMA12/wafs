# Prototype

```JS
// First constructor
const newConstructor = function (param) {
    console.log("Test param:", param);
};


// Second constructor
const secondNewConstructor = function () {
};


// Use the prototype method to add a new function under the key "newMethod".
secondNewConstructor.prototype.newMethod = function () {
    console.log("hey!");
};

// Use the prototype method to nest the second newConstructor prototypes in to first newConstructor.
newConstructor.prototype = new secondNewConstructor();

// Now construct a new object with the first newConstructor.
const newObject = new newConstructor("give it an argument just for testing");

// Call the nested newMethod prototype function.
newObject.newMethod();
```
