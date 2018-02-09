
let secondNewConstructor = function () {
    this.yeah2 = "yeah2!";
};

secondNewConstructor.prototype.hey = function () {
    console.log("hey!");
};

let newConstructor = function (param) {
    console.log(param);
    this.yeah = "yeah!";
};

newConstructor.prototype = new secondNewConstructor();

let newObject2 = new newConstructor("test1");



console.log(newObject2.hey());
// newObject.prototype

var b = {};

var example = b.example = {example : "example"};

console.log(example, b.example);
