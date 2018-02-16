// First constructor

const newConstructor = function (param) {
    this.yeah = "yeah!";
};


// Second constructor

const secondNewConstructor = function () {
    this.yeah2 = "yeah2!";
};


// Use the prototype method to add a new function under the key "key".
secondNewConstructor.prototype.hey = function () {
    console.log("hey!");
};

// Use the prototype method to nest the second newConstructor prototypes in to first newConstructor.
newConstructor.prototype = new secondNewConstructor();

// Now construct a new object with the first newConstructor.
const newObject = new newConstructor("give it an argument just for testing");

// Call the nested hey prototype function. 
newObject.hey();
