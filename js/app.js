$(function(){
    var body = $('body');
    var diploid = $('#diploid');

    var testBlock = $('#testBlock');
    var blockBLX = null;
    var blockTLY = null;
    var blockTRX = null;
    var blockBRY = null;

    //line
    var line = $('#line');
    var lineP1X = null;
    var lineP1Y = null;
    var lineP2X = null;
    var lineP2Y = null;
    var lineP1 = [];
    var lineP2 = [];

    //global speed
    var speed = 3;

    //build ghost players to check for move validity before moving real players:
    /*diploid.prepend("<div id='ghost1' class='ghost'></div>");
    diploid.prepend("<div id='ghost2' class='ghost'></div>");*/

    var Player = function Player(selectorID,ghostID) {
        this.sel = $('#' + selectorID);
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
        diploid.prepend('<div id="'+ghostID+'" class="ghost"></div>');
        this.g = $('#'+ghostID);
        console.log($(this.g));
    };

    var p1 = new Player('p1',"ghost1");
    var p2 = new Player('p2','ghost2');

    //create startGame for setInterval() in initDeploid()
    var startGame = null;


    /*var g1 = $('#ghost1');
    var g2 = $('#ghost2');*/
    $(p1.g).css({'left': $(p1.sel).position().left, 'top': $(p1.sel).position().top});
    $(p2.g).css({'left': $(p2.sel).position().left, 'top': $(p2.sel).position().top});

    //player 1 key listeners
    $(body).keydown(function(e) {
        var p1k = e.keyCode;
        if (p1k==65) {p1.moveLeft = true}
        if (p1k==68) {p1.moveRight = true}
        if (p1k==87) {p1.moveUp = true}
        if (p1k==83) {p1.moveDown = true}
    });
    $(body).keyup(function(e) {
        var p1k = e.keyCode;
        if (p1k==65) {p1.moveLeft = false}
        if (p1k==68) {p1.moveRight = false}
        if (p1k==87) {p1.moveUp = false}
        if (p1k==83) {p1.moveDown = false}
    });

    //player 2 key listeners
    $(body).keydown(function(e) {
        var p2k = e.keyCode;
        if (p2k==37) {p2.moveLeft = true;}
        if (p2k==39) {p2.moveRight = true;}
        if (p2k==38) {p2.moveUp = true;}
        if (p2k==40) {p2.moveDown = true;}
    });
    $(body).keyup(function(e) {
        var p2k = e.keyCode;
        if (p2k==37) {p2.moveLeft = false;}
        if (p2k==39) {p2.moveRight = false;}
        if (p2k==38) {p2.moveUp = false;}
        if (p2k==40) {p2.moveDown = false;}
    });

    function alignLine() {
        var player1CenterX = (parseInt($(p1.sel).css("left")) + (parseInt($(p1.sel).width()) / 2 ));
        var player1CenterY = (parseInt($(p1.sel).css("top")) + (parseInt($(p1.sel).height()) / 2 ));
        var player2CenterX = (parseInt($(p2.sel).css("left")) + (parseInt($(p2.sel).width()) / 2 ));
        var player2CenterY = (parseInt($(p2.sel).css("top")) + (parseInt($(p2.sel).height()) / 2 ));

        $(line).attr('x1', player1CenterX);
        $(line).attr('y1',player1CenterY);
        $(line).attr('x2', player2CenterX);
        $(line).attr('y2',player2CenterY);

        lineP1X = $(line).attr('x1');
        lineP1Y = $(line).attr('y1');
        lineP2X = $(line).attr('x2');
        lineP2Y = $(line).attr('y2');

        lineP1 = [lineP1X,lineP1Y];
        lineP2 = [lineP2X,lineP2Y];

        //length of line:
        /* var lineW = Math.abs($(line).attr('x1') - $(line).attr('x2'));
        var lineH = Math.abs($(line).attr('y1') - $(line).attr('y2'));
        var lineLength = Math.round(Math.sqrt((lineW * lineW) + (lineH * lineH)));*/
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

    function checkCollision(obj1,obj2) {
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
    }

    /********** Collision detection for line **********/
    function checkCorners(x,y) {
        return (((lineP2Y - lineP1Y) * x) + ((lineP1X - lineP2X) * y)) + ((lineP2X * lineP1Y) - (lineP1X * lineP2Y));
    }
    function checkIntersection() {
        var cornerCheckTL = checkCorners(blockBLX,blockBRY);
        var cornerCheckTR = checkCorners(blockTRX,blockBRY);
        var cornerCheckBL = checkCorners(blockBLX,blockTLY);
        var cornerCheckBR = checkCorners(blockTRX,blockTLY);
        if((cornerCheckBL < 0 && cornerCheckBR < 0 && cornerCheckTL < 0 && cornerCheckTR < 0) || (cornerCheckBL > 0 && cornerCheckBR > 0 && cornerCheckTL > 0 && cornerCheckTR > 0)) {
            console.log('no intersection :(');
            return false;
        } else if((lineP1X > blockTRX && lineP2X > blockTRX) || (lineP1X < blockBLX && lineP2X < blockBLX) || ((lineP1Y > blockBRY && lineP2Y > blockBRY)) || (lineP1Y < blockTLY && lineP2Y < blockTLY)) {
            console.log('no intersection :(');
            return false;
        } else {
            console.log('WE HAVE INTERSECTION!!!');
        }
    }
    /********************/

    function moveTestBlock() {
        $(testBlock).css({'top': $(testBlock).position().top -.5});
        blockBLX = $(testBlock).position().left;
        blockTLY =  $(testBlock).position().top;
        blockTRX = $(testBlock).position().left + $(testBlock).width();
        blockBRY = $(testBlock).position().top + $(testBlock).height();

        checkIntersection();
    }

    function tick() {
        var p1Moved = 0;
        if(p1.moveLeft) {$(p1.g).css({'left': '-=' + speed}); p1Moved = 1}
        if(p1.moveRight) {$(p1.g).css({'left': '+=' + speed}); p1Moved = 1}
        if(p1.moveUp) {$(p1.g).css({'top': '-=' + speed}); p1Moved = 1}
        if(p1.moveDown) {$(p1.g).css({'top': '+=' + speed}); p1Moved = 1}
        if(p1Moved) {
            if(!checkOutOfBounds($(p1.g), $(diploid))) {
                $(p1.sel).css({'top': $(p1.g).position().top, 'left': $(p1.g).position().left});
            } else {
                $(p1.g).css({'top': $(p1.sel).position().top, 'left': $(p1.sel).position().left});
            }
        }

        var p2Moved = 0;
        if(p2.moveLeft) {$(p2.g).css({'left': '-='+speed}); p2Moved = 1}
        if(p2.moveRight) {$(p2.g).css({'left': '+=' + speed}); p2Moved = 1}
        if(p2.moveUp) {$(p2.g).css({'top': '-=' + speed}); p2Moved = 1}
        if(p2.moveDown) {$(p2.g).css({'top': '+=' + speed}); p2Moved = 1}
        if(p2Moved) {
            if(!checkOutOfBounds($(p2.g), $(diploid))) {
                $(p2.sel).css({'top': $(p2.g).position().top, 'left': $(p2.g).position().left});
            } else {
                $(p2.g).css({'top': $(p2.sel).position().top, 'left': $(p2.sel).position().left});
            }
        }

        if(checkCollision($(p1.sel),$(testBlock))) {
            console.log('Player 1 collided with a block!');
        }
        if(checkCollision($(p2.sel),$(testBlock))) {
            console.log('Player 2 Collided with a block!');
        }
        alignLine();
        moveTestBlock();
    }

    //initialize the game
    function initDiploid() {
        alignLine();
        startGame = setInterval(tick, 10);
    }

    //stop game with spacebar
    $(body).keydown(function(s){
        if(s.keyCode == 32){
            // without scrolling the page down
            event.preventDefault();
            clearInterval(startGame);
            console.log('Game Stopped!');
        }
    });
    initDiploid();
});

