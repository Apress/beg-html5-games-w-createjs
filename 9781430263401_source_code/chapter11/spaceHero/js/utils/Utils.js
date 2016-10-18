(function () {

    var Utils = {

    }

    Utils.getRandomNumber = function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    window.Utils = Utils;

}());

