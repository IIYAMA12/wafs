'use strict';


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


// -------------------------------------------- //

// -------------------------------------------- //



// proxy / Meta programming
var handlerOfProxy = {
    get : function (target, name) {
        if (name == "testKey") {
            return true;
        }

        return false;
    }
}

var proxyTestObject = {
    testKey : "value"
}

var newProxy = new Proxy(proxyTestObject, handlerOfProxy);

// -------------------------------------------- //

// -------------------------------------------- //

// revoke a proxy

var newRevocableProxy = Proxy.revocable(proxyTestObject, {
    get : function (target, name) {
        return true;
    }
});


newRevocableProxy.revoke(); // disable the Proxy by the handler
/*
    TypeError: illegal operation attempted on a revoked proxy debugger eval
*/