var wpmValue = document.getElementById("wpmValue"), timeValue = document.getElementById("timeValue"), errorValue = document.getElementById("errorValue");
/**
 * @class TypingChart
 * @description class to make changes to the canvas element according to the typing input
 */
var TypingChart = /** @class */ (function () {
    function TypingChart() {
        var _this = this;
        this.canvasElem = document.getElementById("typingInfoChart");
        this.ctx = this.canvasElem.getContext("2d");
        this.width = 0;
        this.height = 0;
        this.canvasLength = 0;
        this.canvasBreadth = 0;
        this.axisColor = "#40739e";
        //intializing the points and paths to empty array 
        this.points = [];
        this.wpmData = [];
        this.errorPoints = [];
        this.updateDimensions();
        this.createAxis();
        this.labelAxis();
        this.plotPoints();
        this.drawDotLines();
        //adding the eventListener to the canvas element
        var hoverInfo = document.querySelector(".hoverInfo");
        this.canvasElem.addEventListener("mousemove", function (e) {
            var _a = [e.offsetX, e.offsetY], x = _a[0], y = _a[1];
            popupWrapper.style.transform = "translate(" + x + "px," + y + "px)";
            if (!hoverInfo.classList.contains("hidden")) {
                hoverInfo.classList.add("hidden");
            }
            _this.refreshContent(e.offsetX, e.offsetY);
        }, false);
        var wrapper = document.querySelector(".chart").getBoundingClientRect();
        this.canvasElem.addEventListener("touchmove", function (e) {
            var _a, _b;
            var _c = [e.touches[0].pageX, e.touches[0].pageY], x = _c[0], y = _c[1];
            _a = [Math.abs(x - wrapper.left), Math.abs(y - wrapper.top)], x = _a[0], y = _a[1];
            //fixed to second decimal place
            _b = [parseInt(x.toFixed(2)), parseInt(y.toFixed(2))], x = _b[0], y = _b[1];
            //console.log(x,y);
            popupWrapper.style.transform = "translate(" + x + "px," + y + "px)";
            if (!hoverInfo.classList.contains("hidden")) {
                hoverInfo.classList.add("hidden");
            }
            _this.refreshContent(x, y);
        }, false);
        document.querySelector(".chartWrapper").addEventListener("mouseleave", function (e) {
            popupWrapper.style.transform = "translate(0px,0px)";
            if (hoverInfo.classList.contains("hidden")) {
                hoverInfo.classList.remove("hidden");
            }
            //reset the values in the hovering object
            _this.resetContent();
        });
        //reseting the position of the draggable to its initial position 
        this.canvasElem.addEventListener("touchend", function (e) {
            popupWrapper.style.transform = "translate(0px,0px)";
            if (hoverInfo.classList.contains("hidden")) {
                hoverInfo.classList.remove("hidden");
            }
            _this.resetContent();
        }, false);
        //draw the default content on the canvas 
        this.drawDefault();
    }
    //reset the content of the popup on mouseleave
    TypingChart.prototype.resetContent = function () {
        wpmValue.textContent = "0";
        timeValue.textContent = "0s";
        errorValue.textContent = "0";
    };
    TypingChart.prototype.refreshContent = function (x, y) {
        var diff = 1000, index = 0;
        for (var i = 0; i < this.points.length; i++) {
            var tmp = Math.abs(this.points[i].x - x);
            if (tmp < diff) {
                diff = tmp;
                index = i;
            }
        }
        var data = this.wpmData[index] || { wpm: 0, time: 0, error: 0 };
        wpmValue.textContent = "" + data.wpm;
        timeValue.textContent = data.time / 1000 + "s";
        errorValue.textContent = "" + data.error;
    };
    TypingChart.prototype.drawDefault = function () {
        this.ctx.clearRect(0, 0, this.canvasElem.width, this.canvasElem.height);
        this.createAxis();
        this.labelAxis();
        this.drawDotLines();
    };
    //public method to add wpm,time and error to the wpmData array
    TypingChart.prototype.addWpmData = function (wpm, time, error) {
        if (wpm === void 0) { wpm = 0; }
        if (time === void 0) { time = 0; }
        if (error === void 0) { error = 0; }
        this.wpmData.push({ wpm: wpm, time: time, error: error });
        //adding the points when new data is received
        this.addPoints({ wpm: wpm, time: time, error: error });
        //adding the error points when new data is recieved
        this.addErrorPoints({ wpm: wpm, time: time, error: error });
    };
    //private method to add points to the "points" array
    TypingChart.prototype.addPoints = function (data) {
        this.points.push({ x: this.getTimeCoords(data.time), y: this.getWpmCoords(data.wpm) });
    };
    //private method to add error point to errorPoints array
    TypingChart.prototype.addErrorPoints = function (data) {
        this.errorPoints.push({ x: this.getTimeCoords(data.time), y: this.getErrorCoords(data.error) });
    };
    TypingChart.prototype.updateDimensions = function () {
        //slice(0,-2) to get rid of "px"
        var canvasWrapper = document.querySelector(".chart");
        var width = Number(getComputedStyle(canvasWrapper).getPropertyValue("width").slice(0, -2));
        var height = Number(getComputedStyle(canvasWrapper).getPropertyValue("height").slice(0, -2));
        //console.log(width,height,this.canvasElem.width,this.canvasElem.height);
        this.canvasElem.setAttribute("width", "" + width);
        this.canvasElem.setAttribute("height", "" + height);
        this.width = this.canvasElem.width;
        this.height = this.canvasElem.height;
        this.canvasLength = this.height - 20;
        this.canvasBreadth = this.width - 40;
        this.drawDefault();
        this.points = []; //removing all the prevoius data
        this.errorPoints = [];
        for (var i = 0; i < this.wpmData.length; i++) {
            this.addPoints(this.wpmData[i]); //inserting new data 
            this.addErrorPoints(this.wpmData[i]);
        }
        if (runningStatus === Status.reset) {
            this.startRender();
        }
        //console.log("dimensions of the canvas",this.canvasElem.width,this.canvasElem.height);
    };
    //label the absica(x-coordinate)
    TypingChart.prototype.labelAxis = function () {
        this.ctx.save();
        this.ctx.font = "15px monospace";
        this.ctx.fillStyle = "#4cd137";
        //get the width of the text "words per minute"
        var width = this.ctx.measureText("words per minute").width;
        this.ctx.translate(15, this.height - width / 2);
        this.ctx.rotate(-(Math.PI / 180) * 90);
        this.ctx.fillText("Words per minute", 0, 0);
        this.ctx.restore();
        //labelling of the x axis
        this.ctx.save();
        this.ctx.font = "15px monospace";
        this.ctx.fillStyle = "#4cd137";
        width = this.ctx.measureText("Time").width;
        this.ctx.translate((this.width - width) / 2, this.height - 8);
        this.ctx.fillText("Time", 0, 0);
        this.ctx.restore();
        this.ctx.save();
        this.ctx.font = "15px monospace";
        this.ctx.fillStyle = "#4cd137";
        width = this.ctx.measureText("error").width;
        this.ctx.translate(this.width - 15, (this.height / 2) - width / 2);
        this.ctx.rotate((Math.PI / 180) * 90);
        this.ctx.fillText("Error", 0, 0);
        this.ctx.restore();
    };
    //function to create the graph
    TypingChart.prototype.createAxis = function () {
        this.ctx.save();
        //drawing the x-axis on the canvas
        this.ctx.strokeStyle = "#4834d4";
        this.ctx.lineWidth = 1;
        this.ctx.globalCompositeOperation = "destination-over";
        this.ctx.beginPath();
        this.ctx.moveTo(20 + 0.5, 0 + 0.5);
        this.ctx.lineTo(20 + 0.5, this.height - 20 + 0.5);
        this.ctx.lineTo(this.width - 20 + 0.5, this.height - 20 + 0.5);
        this.ctx.moveTo(this.width - 20 + 0.5, 0 + 0.5);
        this.ctx.lineTo(this.width - 20 + 0.5, this.height - 20 + 0.5);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
    };
    TypingChart.prototype.getWpmCoords = function (wpm) {
        return this.canvasLength - ((wpm / 100) * this.canvasLength);
    };
    TypingChart.prototype.getTimeCoords = function (time) {
        return ((time / currentTime) * this.canvasBreadth) + 20;
    };
    TypingChart.prototype.getErrorCoords = function (error) {
        return this.canvasLength - (error / 20) * this.canvasLength;
    };
    //private method to draw the dotted lines in the graph
    TypingChart.prototype.drawDotLines = function () {
        this.ctx.save();
        this.ctx.strokeStyle = "white";
        //looping to draw the dotted lines parallel to the x-axis
        for (var i = 5000; i < 60000; i += 5000) {
            this.ctx.lineWidth = 0.3;
            this.ctx.setLineDash([2, 10]);
            var xCoord = this.getTimeCoords(i);
            this.ctx.beginPath();
            this.ctx.moveTo(xCoord + 0.5, this.height - 20);
            this.ctx.lineTo(xCoord + 0.5, 0);
            this.ctx.closePath();
            this.ctx.stroke();
        }
        this.ctx.restore();
    };
    //draw the points in the graph
    TypingChart.prototype.plotPoints = function () {
        var len = this.points.length;
        this.ctx.save();
        this.ctx.globalCompositeOperation = "source-over";
        //looping thorugh the points array to draw points
        for (var i = 0; i < len; i++) {
            var p = new Path2D();
            p.arc(this.points[i].x, this.points[i].y, 1, 0, 2 * Math.PI);
            //console.log(this.points[i]);
            this.ctx.fillStyle = "#8e44ad";
            this.ctx.fill(p);
        }
        this.ctx.restore();
    };
    //method to draw the quadratic line between the points 
    TypingChart.prototype.joinPoints = function () {
        this.ctx.save();
        this.ctx.strokeStyle = "#9b59b6";
        this.ctx.lineWidth = 1;
        this.ctx.globalCompositeOperation = "destination-over";
        var len = this.points.length;
        for (var i = 0; i < len - 1; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.points[i].x, this.points[i].y);
            this.ctx.lineTo(this.points[i + 1].x, this.points[i + 1].y);
            this.ctx.closePath();
            //this.ctx.quadraticCurveTo(this.points[i].x,this.points[i+1].y,this.points[i+1].x,this.points[i+1].y);
            this.ctx.stroke();
        }
        this.ctx.restore();
    };
    //method to fill the space
    TypingChart.prototype.fillPoints = function () {
        var len = this.points.length;
        this.ctx.save();
        this.ctx.fillStyle = "#00d8d6";
        this.ctx.globalAlpha = 1;
        this.ctx.lineWidth = 0;
        for (var i = 0; i < len - 1; i++) {
            this.ctx.globalCompositeOperation = "destination-over";
            this.ctx.beginPath();
            this.ctx.moveTo(this.points[i].x, this.points[i].y);
            this.ctx.lineTo(this.points[i + 1].x, this.points[i + 1].y);
            this.ctx.lineTo(this.points[i + 1].x, this.canvasLength);
            this.ctx.lineTo(this.points[i].x, this.canvasLength);
            this.ctx.closePath();
            this.ctx.fill();
        }
        this.ctx.restore();
    };
    //draw points in the canvas for error
    TypingChart.prototype.drawErrorPoints = function () {
        var len = this.errorPoints.length;
        //fill the space of the error points
        this.ctx.save();
        this.ctx.fillStyle = "#353b48";
        this.ctx.globalAlpha = 0.7;
        this.ctx.lineWidth = 0;
        this.ctx.globalCompositeOperation = "source-over";
        for (var i = 0; i < len - 1; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.errorPoints[i].x, this.errorPoints[i].y);
            this.ctx.lineTo(this.errorPoints[i + 1].x, this.errorPoints[i + 1].y);
            this.ctx.lineTo(this.errorPoints[i + 1].x, this.canvasLength);
            this.ctx.lineTo(this.errorPoints[i].x, this.canvasLength);
            this.ctx.closePath();
            this.ctx.fill();
        }
        this.ctx.restore();
        //draw the line between the points
        this.ctx.save();
        this.ctx.strokeStyle = "#4834d4";
        this.ctx.lineWidth = 1;
        this.ctx.globalCompositeOperation = "source-over";
        for (var i = 0; i < len - 1; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.errorPoints[i].x, this.errorPoints[i].y);
            this.ctx.lineTo(this.errorPoints[i + 1].x, this.errorPoints[i + 1].y);
            this.ctx.closePath();
            this.ctx.stroke();
        }
        this.ctx.restore();
    };
    //public method to render the canvas element
    TypingChart.prototype.startRender = function () {
        //clearing the canvas before drawing new objects
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.createAxis();
        this.labelAxis();
        this.drawDotLines();
        //for plotting the error to time points in the graph
        this.drawErrorPoints();
        //for plotting wpm to time points in the graph
        this.plotPoints();
        this.joinPoints();
        this.fillPoints();
        this.animationId = window.requestAnimationFrame(this.startRender.bind(this));
    };
    //public method to stop the render the canvas element
    TypingChart.prototype.stopRender = function () {
        //cancel the animation 
        window.cancelAnimationFrame(this.animationId);
        console.log("animation cancelled");
    };
    TypingChart.prototype.resetCanvas = function () {
        this.wpmData = [];
        this.points = [];
        this.errorPoints = [];
        this.drawDefault();
    };
    return TypingChart;
}());
