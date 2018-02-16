
# Classes and proxy


## Classes
I haven't figured out the real benefit of using classes yet. They feel for the functionality I am aware of limited in some ways. This might be because I am probably not using methods that are taking benefits of classes. It through it was really annoying that a class can't have objects inside which can hold those functions. I tried to hack/build this, within `this` but I failed and yet succeeded. My first impression: I do not see/understand what makes them so special over default objects.

[A post about why Classes](https://stackoverflow.com/questions/30783217/why-should-i-use-es6-classes)

```JS
class Position {
    constructor(x, y, z) {
        this.startX = this.endX = x;
        this.startY = this.endY = y;
        this.startZ = this.endZ = z;
        this.speed = 0;
        this.endTimeAnimation = 0;
        this.animationDuration = 0;

        this.position = {
            set : this.set,
            get : this.get,
            this_ : this
        }
    }
    set (x, y, z) {
        this.startX = this.endX = x;
        this.startY = this.endY = y;
        this.startZ = this.endZ = z;

        return true;
    }
    get () {
        let posX, posY, posZ;

        let this_ = this.this_; // wrapper van this

        if (this_.endTimeAnimation != 0) { // check of er een animatie beschikbaar is.
            console.log("there is an endTime of animation");
            let timeNow = new Date().getTime();
            console.log(timeNow, this_.endTimeAnimation)
            if (timeNow < this_.endTimeAnimation) {
                let progress = ((this_.endTimeAnimation - timeNow) / this_.animationDuration);

                // bereken nieuwe positie
                posX = this_.startX + ((this_.endX - this_.startX) * progress),
                posY = this_.startY + ((this_.endY - this_.startY) * progress),
                posZ = this_.startZ + ((this_.endZ - this_.startZ) * progress);
            }
        }

        return posX != undefined ? [posX, posY, posZ] : [this_.startX, this_.startY, this_.startZ];
    }
}


class Teleportation extends Position {
    setSpeed(speed) {
        if (typeof(speed) == "string") {
            if (speed == "sound") {
                this.speed = 10;
                return true;
            } else if (speed == "light") {
                this.speed = 100;
                return true;
            }
        } else if (typeof(speed) == "number") {
            this.speed = speed;
            return true;
        }
        return false;
    }
    flyTo (endX, endY, endZ) {
        this.endX = Number(endX),
        this.endY = Number(endY),
        this.endZ = Number(endZ);

        if (this.speed > 0) {
            this.animationDuration = 1000 / this.speed; // speed is per second
            let timeNow = new Date().getTime();
            this.endTimeAnimation = timeNow + this.animationDuration;
        }
        return true;
    }
}

let makeTeleportation  = new Teleportation(5, 5, 5);
makeTeleportation.setSpeed(0.1);
makeTeleportation.flyTo(-100, -100, -100);
```

## Proxy

A proxy is an object that has the ability to detect when you are indexing in it to set / get (etc.) data. At that moment you can do your own custom behaviours.



```JS
// proxy / Meta programming
var handlerOfProxy = {
    get : function (target, name) {
        if (name == "testKey") {
            return true;
        }

        return false;
    }
};

var proxyTestObject = {
    testKey : "value"
};

var newProxy = new Proxy(proxyTestObject, handlerOfProxy);
```



```JS
console.log(newProxy.testKey); // true
console.log(newProxy.somethingElse); // false
```


### Revoke able proxy
You are able to stop a proxy in order to debug if processes/your scripts are doing things that they shouldn't be doing.

```JS
var proxyTestObject = {
    testKey : "value"
};

// Make revoke able proxy
var newRevocableProxy = Proxy.revocable(proxyTestObject, {
    get : function (target, name) {
        return true;
    }
});
```


Before we revoke it:
```JS
console.log(newRevocableProxy.test); // true

```


Revoke the proxy:
```JS
newRevocableProxy.revoke(); // disable the Proxy by the handler

```

After we revoke it:
```JS
console.log(newRevocableProxy.test);
/*
    TypeError: illegal operation attempted on a revoked proxy debugger eval
*/
```
