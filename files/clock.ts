/**
 * @class Clock
 * @description wrapper to hold method and other properties for the timer clock
 */

class Clock{


    private elem:HTMLElement;
    private timeoutId:any;
    private intervalId:any;
    private time:number;
    private tempTime:number;

    constructor(name:string,time:number=60000){
        this.elem=document.getElementById(name);
        this.time=time;
        this.tempTime=time;
        this.elem.textContent=`0${Math.floor((time/1000)/60)}:${(time/1000)%60}0`;
    }


    public setTime(time:number):void{
        this.time=time;
        this.tempTime=time;
        this.elem.textContent=`0${Math.floor((time/1000)/60)}:${(time/1000)%60}0`;
    }

    //setting the clock
    public startClock(cb1:Function,cb2:Function):void{

        let time:number=0;

        this.timeoutId=setTimeout(()=>{
            this.resetClock();
            cb1();
        },this.time);

        this.intervalId=setInterval(()=>{
            time+=1000;
            cb2(time);
            this.changeTime();
        },1000);

    }

    private changeTime():void{
        this.tempTime-=1000;
        let sec:number=this.tempTime/1000;
        this.elem.textContent=`0${Math.floor(sec/60)}:${sec%60}`;

        if(this.tempTime===20000){
            this.elem.style.color="#c23616";
        }
    }

    public resetClock():void{
        this.elem.style.backgroundColor="none";
        this.setTime(this.time);
        clearTimeout(this.timeoutId);
        clearInterval(this.intervalId);
    }


}

//let clock=new Clock("countDown",120000);
//clock.startClock(()=>{});