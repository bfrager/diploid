$(function() {
    var $body = $('body');
    var $diploid = $('#diploid');
    var $time = $('#time');


    var paused = false;

    //line
    var line = $('#line');
    var lineX1 = null;
    var lineY1 = null;
    var lineX2 = null;
    var lineY2 = null;
    var lineP1 = [];
    var lineP2 = [];

    //global speed
    var speed = 2;

    var playerArray = [];
    var blockArray = [];

    var grid = 75;
    var blockAmount = 15;
    var blockCount = 0;
    var blockSpeed = 1;

    var start;
    var elapsedTime = 0;
    var timer;

    //for timer
    /*var m = 0;
     var s = 0;*/

    var Player = function (selectorID, ghostID, lKeyCode, rKeyCode, uKeyCode, dKeyCode) {
        var p = this;
        p.sel = '#' + selectorID;
        p.name = 'Player ' + selectorID;

        p.getCenter = function () {
            p.centerX = (parseInt($(p.sel).css("left")) + (parseInt($(p.sel).width()) / 2 ));
            p.centerY = (parseInt($(p.sel).css("top")) + (parseInt($(p.sel).height()) / 2 ));
        };

        //is player currently trying to move?
        p.moveLeft = false;
        p.moveRight = false;
        p.moveUp = false;
        p.moveDown = false;

        //create ghost divs for each player to 'move ahead' and see if moves are 'valid'
        $diploid.append('<div id="' + ghostID + '" class="ghost"></div>');
        p.g = $('#' + ghostID);

        $(p.g).css({'left': $(p.sel).position().left, 'top': $(p.sel).position().top});

        //player control key bindings
        $body.keydown(function (e) {
            var p1k = e.which;
            if (p1k == lKeyCode) {
                p.moveLeft = true
            }
            if (p1k == rKeyCode) {
                p.moveRight = true
            }
            if (p1k == uKeyCode) {
                p.moveUp = true
            }
            if (p1k == dKeyCode) {
                p.moveDown = true
            }
        });
        $body.keyup(function (e) {
            var p1k = e.keyCode;
            if (p1k == lKeyCode) {
                p.moveLeft = false
            }
            if (p1k == rKeyCode) {
                p.moveRight = false
            }
            if (p1k == uKeyCode) {
                p.moveUp = false
            }
            if (p1k == dKeyCode) {
                p.moveDown = false
            }
        });

        p.move = function () {
            var pMoved = 0;
            if (p.moveLeft) {
                $(p.g).css({'left': '-=' + speed});
                pMoved = 1
            }
            if (p.moveRight) {
                $(p.g).css({'left': '+=' + speed});
                pMoved = 1
            }
            if (p.moveUp) {
                $(p.g).css({'top': '-=' + speed});
                pMoved = 1
            }
            if (p.moveDown) {
                $(p.g).css({'top': '+=' + speed});
                pMoved = 1
            }
            if (pMoved) {
                if (!checkOutOfBounds($(p.g), $diploid)) {
                    $(p.sel).css({'top': $(p.g).position().top, 'left': $(p.g).position().left});
                } else {
                    $(p.g).css({'top': $(p.sel).position().top, 'left': $(p.sel).position().left});
                }
            }
        };

        //add this player to the player array so that both players can be targeted together quickly
        playerArray.push(p);
    };

    var p1 = new Player('p1', 'ghost1', 65, 68, 87, 83);
    var p2 = new Player('p2', 'ghost2', 37, 39, 38, 40);

    //block object
    var Block = function (selectorID) {
        var b = this;
        b.sel = '#' + selectorID;

        b.w = Math.round(Math.random() * grid) + grid;
        b.h = Math.round(Math.random() * grid) + grid;

        b.alive = true;

        $diploid.prepend('<div id="' + selectorID + '" class="block"></div>');
        $(b.sel).css({'left': (Math.random() * $diploid.width())});
        $(b.sel).css('width', b.w);
        $(b.sel).css('height', b.h);
        //$(b.sel).css('top', ($diploid.height() + (Math.random() * $diploid.height())));
        $(b.sel).css('top', ($diploid.height()));

        //each block object has it's own intersect detection
        b.checkCorners = function (x, y) {
            return (((lineY2 - lineY1) * x) + ((lineX1 - lineX2) * y)) + ((lineX2 * lineY1) - (lineX1 * lineY2));
        };

        b.checkIntersection = function () {
            b.cornerCheckTL = b.checkCorners(b.BLX, b.BRY);
            b.cornerCheckTR = b.checkCorners(b.TRX, b.BRY);
            b.cornerCheckBL = b.checkCorners(b.BLX, b.TLY);
            b.cornerCheckBR = b.checkCorners(b.TRX, b.TLY);

            if ((b.cornerCheckBL < 0 && b.cornerCheckBR < 0 && b.cornerCheckTL < 0 && b.cornerCheckTR < 0) || (b.cornerCheckBL > 0 && b.cornerCheckBR > 0 && b.cornerCheckTL > 0 && b.cornerCheckTR > 0)) {
                return false;
            } else if ((lineX1 > b.TRX && lineX2 > b.TRX) || (lineX1 < b.BLX && lineX2 < b.BLX) || ((lineY1 > b.BRY && lineY2 > b.BRY)) || (lineY1 < b.TLY && lineY2 < b.TLY)) {
                return false;
            } else {
                //do something when line gets interrupted
                console.log('COLLISION DETECTED');
            }
        };

        b.checkCollision = function (obj1, obj2) {
            var pos1 = obj1.position();
            var pos2 = obj2.position();
            var left1 = pos1.left;
            var right1 = left1 + obj1.width();
            var top1 = pos1.top;
            var bottom1 = top1 + obj1.height();
            var left2 = pos2.left;
            var right2 = left2 + obj2.width();
            var top2 = pos2.top;
            var bottom2 = top2 + obj2.height();
            return ((right1 > left2 && (bottom1 > top2 && top1 < bottom2)) && (left1 < right2 && (top1 < bottom2 && bottom1 > top2)));
        };

        b.moveBlock = function () {
            if (!paused) {
                b.BLX = $(b.sel).position().left;
                b.TLY = $(b.sel).position().top;
                b.TRX = $(b.sel).position().left + $(b.sel).width();
                b.BRY = $(b.sel).position().top + $(b.sel).height();

                b.checkIntersection();

                for (var p = 0; p < playerArray.length; p += 1) {
                    if (b.checkCollision($(playerArray[p].sel), $(b.sel))) {
                        //console.log(playerArray[p].name);
                    }
                }

                if (b.alive == true) {
                    /*if(!($(b.sel).position().top <= ($(b.sel).height() * -1))) {
                     moveBlockUp(b);
                     console.log(b);
                     } else {
                     b.regen();
                     }*/


                }
            }
        };
        //gets fired ONCE because jQuery animate has its own setInterval steps
        moveBlockUp(b);

        b.tick = setInterval(b.moveBlock, 10);
        b.regen = function () {
            //console.log(blockArray);
            blockArray.shift();
            clearInterval(b.tick);
            b.alive = false;
            newBlock();
            $(b.sel).remove();
            b = null;
        };
        blockArray.push(b);
    };

    function newBlock() {
        blockCount += 1;
        //console.log('Block Count: ' + blockCount);
        var blockID = 'block' + blockCount;
        var block = new Block(blockID);
    }

    function generateBlocks(num) {
        for (var i = 1; i <= num; i += 1) {
            newBlock();
        }
    }

    function moveBlockUp(who) {
        //$(who.sel).css('top', '-=' + blockSpeed);

        /*******/

        var whereTo = $(who.sel).position().top - $diploid.height();

        $(who.sel).animate({
            'top': ($(who.sel).height() * -1)
        },5000,'linear',function(){

        }).delay(Math.floor(Math.random() * (grid * $diploid.height())));
        console.log();
    }

    //create startGame for setInterval() in initDeploid()
    var startGame = null;

    function alignLine() {
        //retrieve each player's updated center point bedore aligning the line
        p1.getCenter();
        p2.getCenter();

        //set line segment coordinates based on updated player center points
        $(line).attr({
            'x1': p1.centerX,
            'y1': p1.centerY,
            'x2': p2.centerX,
            'y2': p2.centerY
        });

        //set variables for updated line x/y attributes
        lineX1 = $(line).attr('x1');
        lineY1 = $(line).attr('y1');
        lineX2 = $(line).attr('x2');
        lineY2 = $(line).attr('y2');

        // X/Y array for each line point
        lineP1 = [lineX1,lineY1];
        lineP2 = [lineX2,lineY2];
    }

    function checkOutOfBounds(obj,bounds) {
        var objLeft = obj.position().left;
        var objRight = objLeft + obj.width();
        var objTop = obj.position().top;
        var objBottom = objTop + obj.height();

        var boundsLeft = 0;
        var boundsRight = bounds.width();
        var boundsTop = 0;
        var boundsBottom = bounds.height();

        return (objLeft < boundsLeft || objRight > boundsRight || objTop < boundsTop || objBottom > boundsBottom);
    }

    function tick() {
        if(!paused) {
            for(var i = 0; i < playerArray.length; i += 1) {
                playerArray[i].move();
            }
            alignLine();
        }
    }

    //initialize the game
    function initDiploid() {
        alignLine();
        generateBlocks(blockAmount);

        start = new Date();


        timer = setInterval(function(){
            var now = new Date();
            elapsedTime = Math.floor((now - start)/1000);

            $time.html(elapsedTime)},1000);
        startGame = setInterval(tick, 10);
    }

    //pause/unpause game with spacebar
    $body.on('keypress', function(evt){
        console.log(evt);
        if(evt.which == 32){
            // without scrolling the page down
            evt.preventDefault();
            if(!paused) {
                paused = true;
            }else {
                paused = false;
            }
        }
    });
    initDiploid();
});