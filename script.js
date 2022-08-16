// todo(vmyshko): comments for HTML
// update all inputs which supposed for numbers
// to type="number", instead of type="text"

//--------------

// todo(vmyshko): use consts instead vars

var body = document.querySelector("body");
var generateBtn = document.querySelector(".generate-button");
var startMenu = document.querySelector("#start-menu");
var galleryMenu = document.querySelector(".menu-header.gallery");
var resultGallery = document.querySelector("#result-gallery");

var firstGen = document.querySelector("#firstGen");
var secondGen = document.querySelector("#secondGen");
var clearBG = document.querySelector("#clearBG");

// switcher: 1 or 2 Generator
// todo(vmyshko): use .addEventListener
firstGen.onclick = function () {
    // todo(vmyshko): use .classList.add() //(update all usages)
    firstGen.className = "options-button selected";
    secondGen.className = "options-button";
};
secondGen.onclick = function () {
    firstGen.className = "options-button";
    secondGen.className = "options-button selected";
};

// ON-OFF: clear BG button
clearBG.onclick = function () {
    // todo(vmyshko): use .classList.contains() //(update all usages)
    if (clearBG.className == "options-switcher") {
        clearBG.className = "options-switcher selected-switcher";
        // todo(vmyshko): put those 'on' and 'off' to html. and just hide/show here
        // or at least put span to html, and change text here using .textContent =''
        clearBG.innerHTML = "<span>ON</span>";
    } else {
        clearBG.className = "options-switcher";
        clearBG.innerHTML = "<span>OFF</span>";
    }
};

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function generate() {
    // todo(vmyshko): use .classList.add
    startMenu.className = "hide";
    galleryMenu.className = "menu-header gallery";

    for (i = 1; i <= quantity.value; i++) {
        var canvasElement = document.createElement("canvas");

        canvasElement.id = "canvas" + i;
        body.appendChild(canvasElement);

        // todo(vmyshko): redundant variable, you can reuse canvasElement here
        var canvas = document.getElementById("canvas" + i);
        var ctx = canvas.getContext("2d");

        canvas.width = iconWidth.value;
        canvas.height = iconHeight.value;

        var width = canvas.width;
        var height = canvas.height;

        ///////////////////////////////////
        // code of generator
        ///////////////////////////////////

        var clearPixel = "rgba(255, 255, 255, 0)";

        // fill or not to fill... background
        var colorBG = "white";
        if (clearBG.className == "options-switcher selected-switcher") {
            ctx.fillStyle = colorBG;
            ctx.fillRect(0, 0, width, height);
        }

        // todo(vmyshko): it would be better to lay on code variables rather than classnames from html
        // todo(vmyshko): create var for instance, genModeIndex or just genMode,
        // and put there mode name, or mode index, e.g. 1 or 2, 3...etc.
        if (firstGen.className == "options-button selected") {
            //////////////////////////////////////////////////
            //////////////////////////////////////////////////

            // todo(vmyshko): extract all code related to generator-1 to separate function, or even separate file
            // and pass required variables to that func (like, canvas ctx, and pixel size etc.)

            function randomColor() {
                var x = randomNumber(0, 1);
                // todo(vmyshko): simplify with return-s, no need for extra variable
                var color = "red";
                if (x > 0.5) {
                    color = "black";
                } else {
                    color = clearPixel;
                }
                return color;
            }

            var pixelW = width * 0.1;
            var pixelH = height * 0.1;

            ////////////////////////////////
            //////// central first pixel

            // todo(vmyshko): try to extract to functions all duplicated code parts, and parametrize it with arguments
            // i.e. : create printPixel() fn, or drawPixel(),
            // which should receive canvas context, x,y coordinates and color,
            // so function call could look like so:
            // drawPixel(ctx, 4, 2, 'red');
            // or for this particular case:
            // drawPixel(ctx,  width / 2 - pixelW / 2, height / 2 - pixelH / 2, randomColor());
            // not so good still, cause you rely on those calculations, but you can simplify those as well
            // for instance, you have about 160 occurences for 'pixelW / 2',
            // and same amount for 'width / 2 - pixelW / 2',
            // so you can easily extract it to separate variable like:
            // const baseWidth = width / 2 - pixelW / 2;
            // and reuse it in all places (but better to do it 1 time in function described above)
            // and then pass to func only those args that matter/do change

            // you can do the same to 'height / 2 - pixelH / 2' this part, it occurs 80 times!

            // this will be the FIRST optimization phase, then you'll probably see next optimization steps...

            ctx.fillStyle = randomColor(); //
            ctx.fillRect(width / 2 - pixelW / 2, height / 2 - pixelH / 2, pixelW, pixelH);

            ////////////////////////////////
            //////// first expanded pixels
            // axe
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2, height / 2 - pixelH / 2 - pixelH, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2, height / 2 - pixelH / 2 + pixelH, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW, height / 2 - pixelH / 2, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW, height / 2 - pixelH / 2, pixelW, pixelH);
            // corner segment
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW, height / 2 - pixelH / 2 - pixelH, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW, height / 2 - pixelH / 2 - pixelH, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW, height / 2 - pixelH / 2 + pixelH, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW, height / 2 - pixelH / 2 + pixelH, pixelW, pixelH);

            ////////////////////////////////
            //////// second expanded pixels
            // axe
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2, height / 2 - pixelH / 2 - pixelH * 2, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2, height / 2 - pixelH / 2 + pixelH * 2, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 2, height / 2 - pixelH / 2, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 2, height / 2 - pixelH / 2, pixelW, pixelH);
            //// corner segment
            // corner axe
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 2, height / 2 - pixelH / 2 - pixelH * 2, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 2, height / 2 - pixelH / 2 - pixelH * 2, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 2, height / 2 - pixelH / 2 + pixelH * 2, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 2, height / 2 - pixelH / 2 + pixelH * 2, pixelW, pixelH);
            //
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW, height / 2 - pixelH / 2 - pixelH * 2, pixelW, pixelH);
            ctx.fillRect(width / 2 + pixelW / 2 + pixelW, height / 2 - pixelH / 2 - pixelH, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW, height / 2 - pixelH / 2 + pixelH * 2, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 2, height / 2 - pixelH / 2 + pixelH, pixelW, pixelH);

            ctx.fillRect(width / 2 - pixelW / 2 + pixelW, height / 2 - pixelH / 2 - pixelH * 2, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 2, height / 2 - pixelH / 2 + pixelH, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW, height / 2 - pixelH / 2 + pixelH * 2, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 2, height / 2 - pixelH / 2 - pixelH, pixelW, pixelH);

            ////////////////////////////////
            //////// third expanded pixels
            // axe
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2, height / 2 - pixelH / 2 - pixelH * 3, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2, height / 2 - pixelH / 2 + pixelH * 3, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 3, height / 2 - pixelH / 2, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 3, height / 2 - pixelH / 2, pixelW, pixelH);
            //// corner segment
            // corner axe
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 3, height / 2 - pixelH / 2 - pixelH * 3, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 3, height / 2 - pixelH / 2 - pixelH * 3, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 3, height / 2 - pixelH / 2 + pixelH * 3, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 3, height / 2 - pixelH / 2 + pixelH * 3, pixelW, pixelH);
            //
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 2, height / 2 - pixelH / 2 - pixelH * 3, pixelW, pixelH);
            ctx.fillRect(width / 2 + pixelW / 2 + pixelW * 2, height / 2 - pixelH / 2 - pixelH * 2, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 2, height / 2 - pixelH / 2 + pixelH * 3, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 3, height / 2 - pixelH / 2 + pixelH * 2, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 2, height / 2 - pixelH / 2 - pixelH * 3, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 3, height / 2 - pixelH / 2 + pixelH * 2, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 2, height / 2 - pixelH / 2 + pixelH * 3, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 3, height / 2 - pixelH / 2 - pixelH * 2, pixelW, pixelH);

            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW, height / 2 - pixelH / 2 - pixelH * 3, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 3, height / 2 - pixelH / 2 - pixelH, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 3, height / 2 - pixelH / 2 + pixelH, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW, height / 2 - pixelH / 2 + pixelH * 3, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW, height / 2 - pixelH / 2 + pixelH * 3, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 3, height / 2 - pixelH / 2 + pixelH, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 3, height / 2 - pixelH / 2 - pixelH, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW, height / 2 - pixelH / 2 - pixelH * 3, pixelW, pixelH);

            ////////////////////////////////
            //////// third expanded pixels
            // axe
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2, height / 2 - pixelH / 2 - pixelH * 4, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2, height / 2 - pixelH / 2 + pixelH * 4, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 4, height / 2 - pixelH / 2, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 4, height / 2 - pixelH / 2, pixelW, pixelH);
            //// corner segment
            // corner axe
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 4, height / 2 - pixelH / 2 - pixelH * 4, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 4, height / 2 - pixelH / 2 - pixelH * 4, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 4, height / 2 - pixelH / 2 + pixelH * 4, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 4, height / 2 - pixelH / 2 + pixelH * 4, pixelW, pixelH);
            //
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW, height / 2 - pixelH / 2 - pixelH * 4, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 4, height / 2 - pixelH / 2 - pixelH, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 4, height / 2 - pixelH / 2 + pixelH, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW, height / 2 - pixelH / 2 + pixelH * 4, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW, height / 2 - pixelH / 2 + pixelH * 4, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 4, height / 2 - pixelH / 2 + pixelH, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 4, height / 2 - pixelH / 2 - pixelH, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW, height / 2 - pixelH / 2 - pixelH * 4, pixelW, pixelH);

            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 2, height / 2 - pixelH / 2 - pixelH * 4, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 4, height / 2 - pixelH / 2 - pixelH * 2, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 4, height / 2 - pixelH / 2 + pixelH * 2, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 2, height / 2 - pixelH / 2 + pixelH * 4, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 2, height / 2 - pixelH / 2 + pixelH * 4, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 4, height / 2 - pixelH / 2 + pixelH * 2, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 4, height / 2 - pixelH / 2 - pixelH * 2, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 2, height / 2 - pixelH / 2 - pixelH * 4, pixelW, pixelH);

            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 3, height / 2 - pixelH / 2 - pixelH * 4, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 4, height / 2 - pixelH / 2 - pixelH * 3, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 4, height / 2 - pixelH / 2 + pixelH * 3, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 3, height / 2 - pixelH / 2 + pixelH * 4, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 3, height / 2 - pixelH / 2 + pixelH * 4, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 4, height / 2 - pixelH / 2 + pixelH * 3, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 4, height / 2 - pixelH / 2 - pixelH * 3, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 3, height / 2 - pixelH / 2 - pixelH * 4, pixelW, pixelH);

            // ctx.fillRect(width/2-pixelW/2, height/2-pixelH/2, pixelW, pixelH);

            //////////////////////////////////////////////////
            //////////////////////////////////////////////////
        } else if (secondGen.className == "options-button selected") {
            //////////////////////////////////////////////////
            //////////////////////////////////////////////////

            // todo(vmyshko): this func repeats twice, you can move it to global scope and just reuse
            function randomColor() {
                x = randomNumber(0, 1);
                var color = "red";
                if (x > 0.5) {
                    color = "black";
                } else {
                    color = clearPixel;
                }
                return color;
            }

            // todo(vmyshko): keep that one which is most readable and understandable for you
            function trueFalse() {
                // var x = true;
                // todo(vmyshko): better to put 'less than' cause random starts to generate from 0 to 0.999...
                // so the 1st half is below 0.5, and second one is 0.5 AND above.
                // but this is minor issue, just FYI
                if (randomNumber(0, 1) > 0.5) {
                    // x = true;
                    return true;
                } else {
                    // x = false;
                    return false;
                }
                // return x;
            }

            function trueFalse() {
                return Math.random() < 0.5;
            }

            // todo(vmyshko): move to global? or encapsulate inside fn for drawing pixels
            // it also can be made global and be reused here, like:
            // drawPixel(ctx, 1, 2, 'red')
            // or for this case:
            // drawPixel(ctx, width / 2 - pixelW / 2, 0, clearPixel);

            var pixelW = width * 0.1;
            var pixelH = height * 0.1;

            // central column
            ctx.fillStyle = clearPixel;
            ctx.fillRect(width / 2 - pixelW / 2, 0, pixelW, pixelH);
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2, 0 + pixelH, pixelW, pixelH);
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2, 0 + pixelH * 2, pixelW, pixelH);
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2, 0 + pixelH * 3, pixelW, pixelH);
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2, 0 + pixelH * 4, pixelW, pixelH);
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2, 0 + pixelH * 5, pixelW, pixelH);
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2, 0 + pixelH * 6, pixelW, pixelH);
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2, 0 + pixelH * 7, pixelW, pixelH);
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2, 0 + pixelH * 8, pixelW, pixelH);
            ctx.fillStyle = clearPixel;
            ctx.fillRect(width / 2 - pixelW / 2, 0 + pixelH * 9, pixelW, pixelH);

            // first Expanded Columns
            ctx.fillStyle = clearPixel;
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW, 0, pixelW, pixelH);
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW, 0 + pixelH, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW, 0 + pixelH, pixelW, pixelH);
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW, 0 + pixelH * 2, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW, 0 + pixelH * 2, pixelW, pixelH);
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW, 0 + pixelH * 3, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW, 0 + pixelH * 3, pixelW, pixelH);
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW, 0 + pixelH * 4, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW, 0 + pixelH * 4, pixelW, pixelH);
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW, 0 + pixelH * 5, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW, 0 + pixelH * 5, pixelW, pixelH);
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW, 0 + pixelH * 6, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW, 0 + pixelH * 6, pixelW, pixelH);
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW, 0 + pixelH * 7, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW, 0 + pixelH * 7, pixelW, pixelH);
            ctx.fillStyle = randomColor();
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW, 0 + pixelH * 8, pixelW, pixelH);
            ctx.fillRect(width / 2 - pixelW / 2 - pixelW, 0 + pixelH * 8, pixelW, pixelH);
            ctx.fillStyle = clearPixel;
            ctx.fillRect(width / 2 - pixelW / 2 + pixelW, 0 + pixelH * 9, pixelW, pixelH);

            // second Expanded Columns
            if (trueFalse()) {
                ctx.fillStyle = clearPixel;
                ctx.fillRect(width / 2 - pixelW / 2 + pixelW, 0, pixelW, pixelH);
                ctx.fillStyle = randomColor();
                ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 2, 0 + pixelH, pixelW, pixelH);
                ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 2, 0 + pixelH, pixelW, pixelH);
                ctx.fillStyle = randomColor();
                ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 2, 0 + pixelH * 2, pixelW, pixelH);
                ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 2, 0 + pixelH * 2, pixelW, pixelH);
                ctx.fillStyle = randomColor();
                ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 2, 0 + pixelH * 3, pixelW, pixelH);
                ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 2, 0 + pixelH * 3, pixelW, pixelH);
                ctx.fillStyle = randomColor();
                ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 2, 0 + pixelH * 4, pixelW, pixelH);
                ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 2, 0 + pixelH * 4, pixelW, pixelH);
                ctx.fillStyle = randomColor();
                ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 2, 0 + pixelH * 5, pixelW, pixelH);
                ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 2, 0 + pixelH * 5, pixelW, pixelH);
                ctx.fillStyle = randomColor();
                ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 2, 0 + pixelH * 6, pixelW, pixelH);
                ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 2, 0 + pixelH * 6, pixelW, pixelH);
                ctx.fillStyle = randomColor();
                ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 2, 0 + pixelH * 7, pixelW, pixelH);
                ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 2, 0 + pixelH * 7, pixelW, pixelH);
                ctx.fillStyle = randomColor();
                ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 2, 0 + pixelH * 8, pixelW, pixelH);
                ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 2, 0 + pixelH * 8, pixelW, pixelH);
                ctx.fillStyle = clearPixel;
                ctx.fillRect(width / 2 - pixelW / 2 + pixelW, 0 + pixelH * 9, pixelW, pixelH);

                // third Expanded Columns
                if (trueFalse()) {
                    ctx.fillStyle = clearPixel;
                    ctx.fillRect(width / 2 - pixelW / 2 + pixelW, 0, pixelW, pixelH);
                    ctx.fillStyle = randomColor();
                    ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 3, 0 + pixelH, pixelW, pixelH);
                    ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 3, 0 + pixelH, pixelW, pixelH);
                    ctx.fillStyle = randomColor();
                    ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 3, 0 + pixelH * 2, pixelW, pixelH);
                    ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 3, 0 + pixelH * 2, pixelW, pixelH);
                    ctx.fillStyle = randomColor();
                    ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 3, 0 + pixelH * 3, pixelW, pixelH);
                    ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 3, 0 + pixelH * 3, pixelW, pixelH);
                    ctx.fillStyle = randomColor();
                    ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 3, 0 + pixelH * 4, pixelW, pixelH);
                    ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 3, 0 + pixelH * 4, pixelW, pixelH);
                    ctx.fillStyle = randomColor();
                    ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 3, 0 + pixelH * 5, pixelW, pixelH);
                    ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 3, 0 + pixelH * 5, pixelW, pixelH);
                    ctx.fillStyle = randomColor();
                    ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 3, 0 + pixelH * 6, pixelW, pixelH);
                    ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 3, 0 + pixelH * 6, pixelW, pixelH);
                    ctx.fillStyle = randomColor();
                    ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 3, 0 + pixelH * 7, pixelW, pixelH);
                    ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 3, 0 + pixelH * 7, pixelW, pixelH);
                    ctx.fillStyle = randomColor();
                    ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 3, 0 + pixelH * 8, pixelW, pixelH);
                    ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 3, 0 + pixelH * 8, pixelW, pixelH);
                    ctx.fillStyle = clearPixel;
                    ctx.fillRect(width / 2 - pixelW / 2 + pixelW, 0 + pixelH * 9, pixelW, pixelH);

                    // fourth Expanded Columns
                    if (trueFalse()) {
                        ctx.fillStyle = clearPixel;
                        ctx.fillRect(width / 2 - pixelW / 2 + pixelW, 0, pixelW, pixelH);
                        ctx.fillStyle = randomColor();
                        ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 4, 0 + pixelH, pixelW, pixelH);
                        ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 4, 0 + pixelH, pixelW, pixelH);
                        ctx.fillStyle = randomColor();
                        ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 4, 0 + pixelH * 2, pixelW, pixelH);
                        ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 4, 0 + pixelH * 2, pixelW, pixelH);
                        ctx.fillStyle = randomColor();
                        ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 4, 0 + pixelH * 3, pixelW, pixelH);
                        ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 4, 0 + pixelH * 3, pixelW, pixelH);
                        ctx.fillStyle = randomColor();
                        ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 4, 0 + pixelH * 4, pixelW, pixelH);
                        ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 4, 0 + pixelH * 4, pixelW, pixelH);
                        ctx.fillStyle = randomColor();
                        ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 4, 0 + pixelH * 5, pixelW, pixelH);
                        ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 4, 0 + pixelH * 5, pixelW, pixelH);
                        ctx.fillStyle = randomColor();
                        ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 4, 0 + pixelH * 6, pixelW, pixelH);
                        ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 4, 0 + pixelH * 6, pixelW, pixelH);
                        ctx.fillStyle = randomColor();
                        ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 4, 0 + pixelH * 7, pixelW, pixelH);
                        ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 4, 0 + pixelH * 7, pixelW, pixelH);
                        ctx.fillStyle = randomColor();
                        ctx.fillRect(width / 2 - pixelW / 2 + pixelW * 4, 0 + pixelH * 8, pixelW, pixelH);
                        ctx.fillRect(width / 2 - pixelW / 2 - pixelW * 4, 0 + pixelH * 8, pixelW, pixelH);
                        ctx.fillStyle = clearPixel;
                        ctx.fillRect(width / 2 - pixelW / 2 + pixelW, 0 + pixelH * 9, pixelW, pixelH);
                    }
                }
            }

            //////////////////////////////////////////////////
            //////////////////////////////////////////////////
        }

        ///////////////////////////////////
        // END
        ///////////////////////////////////
    }
}

// todo(vmyshko): better to use .addEventListener, but not critical
generateBtn.onclick = function () {
    if (
        // todo(vmyshko): use .classList.contains('options-button selected')
        firstGen.className == "options-button selected" ||
        secondGen.className == "options-button selected"
    ) {
        generate();
    }
};