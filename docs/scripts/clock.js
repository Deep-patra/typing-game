/**
 * @class Clock
 * @description wrapper to hold method and other properties for the timer clock
 */
class Clock {
    constructor(name, time = 60000) {
        this.elem = document.getElementById(name);
        this.time = time;
        this.tempTime = time;
        this.elem.textContent = `0${Math.floor((time / 1000) / 60)}:${(time / 1000) % 60}0`;
    }
    setTime(time) {
        this.time = time;
        this.tempTime = time;
        this.elem.textContent = `0${Math.floor((time / 1000) / 60)}:${(time / 1000) % 60}0`;
    }
    //setting the clock
    startClock(cb1, cb2) {
        let time = 0;
        this.timeoutId = setTimeout(() => {
            this.resetClock();
            cb1();
        }, this.time);
        this.intervalId = setInterval(() => {
            time += 1000;
            cb2(time);
            this.changeTime();
        }, 1000);
    }
    changeTime() {
        this.tempTime -= 1000;
        let sec = this.tempTime / 1000;
        this.elem.textContent = `0${Math.floor(sec / 60)}:${sec % 60}`;
        if (this.tempTime === 20000) {
            this.elem.style.color = "#c23616";
        }
    }
    resetClock() {
        this.elem.style.backgroundColor = "none";
        this.setTime(this.time);
        clearTimeout(this.timeoutId);
        clearInterval(this.intervalId);
    }
}
//let clock=new Clock("countDown",120000);
//clock.startClock(()=>{});
