(function () {
    window.game = window.game || {};
    var Device = {}
    Device.prepare = function () {
        if (typeof window.orientation !== 'undefined') {
            window.onorientationchange = this.onOrientationChange;
            if (createjs.Touch.isSupported()) {
                createjs.Touch.enable(stage);
            }
            this.onOrientationChange();
        } else {
            window.onresize = this.resizeGame;
            this.resizeGame();
        }
    }
    Device.onOrientationChange = function () {
        var me = this;
        setTimeout(me.resizeGame, 100);
    }
    Device.resizeGame = function () {
        var nTop, nLeft, scale;
        var gameWrapper = document.getElementById('gameWrapper');
        var w = window.innerWidth;
        var h = window.innerHeight;
        var nWidth = window.innerWidth;
        var nHeight = window.innerHeight;
        var widthToHeight = canvas.width / canvas.height;
        var nWidthToHeight = nWidth / nHeight;
        if (nWidthToHeight > widthToHeight) {
            nWidth = nHeight * widthToHeight;
            scale = nWidth / canvas.width;
            nLeft = (w / 2) - (nWidth / 2);
            gameWrapper.style.left = (nLeft) + "px";
            gameWrapper.style.top = "0px";
        }
        else {
            nHeight = nWidth / widthToHeight;
            scale = nHeight / canvas.height;
            nTop = (h / 2) - (nHeight / 2);
            gameWrapper.style.top = (nTop) + "px";
            gameWrapper.style.left = "0px";
        }
        canvas.setAttribute("style", "-webkit-transform:scale(" + scale +
            ")");
        window.scrollTo(0, 0);
    }
    window.game.Device = Device;
}());
