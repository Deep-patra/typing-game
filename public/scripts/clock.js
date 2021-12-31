/**
 * @class Clock
 * @description wrapper to hold method and other properties for the timer clock
 */
var Clock = /** @class */ (function () {
    function Clock(name, time) {
        if (time === void 0) { time = 60000; }
        this.elem = document.getElementById(name);
        this.time = time;
        this.tempTime = time;
        this.elem.textContent = "0" + Math.floor((time / 1000) / 60) + ":" + (time / 1000) % 60 + "0";
    }
    Clock.prototype.setTime = function (time) {
        this.time = time;
        this.tempTime = time;
        this.elem.textContent = "0" + Math.floor((time / 1000) / 60) + ":" + (time / 1000) % 60 + "0";
    };
    //setting the clock
    Clock.prototype.startClock = function (cb1, cb2) {
        var _this = this;
        var time = 0;
        this.timeoutId = setTimeout(function () {
            _this.resetClock();
            cb1();
        }, this.time);
        this.intervalId = setInterval(function () {
            time += 1000;
            cb2(time);
            _this.changeTime();
        }, 1000);
    };
    Clock.prototype.changeTime = function () {
        this.tempTime -= 1000;
        var sec = this.tempTime / 1000;
        this.elem.textContent = "0" + Math.floor(sec / 60) + ":" + sec % 60;
        if (this.tempTime === 20000) {
            this.elem.style.color = "#c23616";
        }
    };
    Clock.prototype.resetClock = function () {
        this.elem.style.backgroundColor = "none";
        this.setTime(this.time);
        clearTimeout(this.timeoutId);
        clearInterval(this.intervalId);
    };
    return Clock;
}());
//let clock=new Clock("countDown",120000);
//clock.startClock(()=>{});
