$(function(){
    var body = $('body');
    var diploid = $('#diploid');
    var p1 = $('#p1');
    var p1W = $(p1).width();
    var p1H = p1W;

    var p2 = $('#p2');
    var p2W = $(p2).width();
    var p2H = p2W;

    var line = $('#line');

    var speed = 3;

    //player move states:
    var p1MoveLeft = false;
    var p1MoveRight = false;
    var p1MoveUp = false;
    var p1MoveDown = false;

    var p2MoveLeft = false;
    var p2MoveRight = false;
    var p2MoveUp = false;
    var p2MoveDown = false;

    //build ghost players to check for move validity before moving real players:
    diploid.prepend("<div id='ghost1' class='ghost'></div>");
    diploid.prepend("<div id='ghost2' class='ghost'></div>");
    var g1 = $('#ghost1');
    var g2 = $('#ghost2');
    $(g1).css({'left': $(p1).position().left, 'top': $(p1).position().top});
    $(g2).css({'left': $(p2).position().left, 'top': $(p2).position().top});


    //player 1 key listeners
    $(body).keydown(function(p1) {
        // prevent arrow keys from scrolling the page
        //event.preventDefault();
        p1k = p1.keyCode;
        if (p1k==65) {console.log('left down');p1MoveLeft = true}
        if (p1k==68) {console.log('right down');p1MoveRight = true}
        if (p1k==87) {console.log('up down');p1MoveUp = true}
        if (p1k==83) {console.log('down down');p1MoveDown = true}
    });
    $(body).keyup(function(p1) {
        p1k = p1.keyCode;
        if (p1k==65) {console.log('left up');p1MoveLeft = false}
        if (p1k==68) {console.log('right up');p1MoveRight = false}
        if (p1k==87) {console.log('up up');p1MoveUp = false}
        if (p1k==83) {console.log('down up');p1MoveDown = false}
    });

    //player 2 key listeners
    $(body).keydown(function(p2) {
        // prevent arrow keys from scrolling the page
        //event.preventDefault();
        p2k = p2.keyCode;
        if (p2k==37) {console.log('left down');p2MoveLeft = true;}
        if (p2k==39) {console.log('right down');p2MoveRight = true;}
        if (p2k==38) {console.log('up down');p2MoveUp = true;}
        if (p2k==40) {console.log('down down');p2MoveDown = true;}
    });
    $(body).keyup(function(p2) {
        p2k = p2.keyCode;
        if (p2k==37) {console.log('left up');p2MoveLeft = false;}
        if (p2k==39) {console.log('right up');p2MoveRight = false;}
        if (p2k==38) {console.log('up up');p2MoveUp = false;}
        if (p2k==40) {console.log('down up');p2MoveDown = false;}
    });

    function alignLine() {
        var player1CenterX = (parseInt($(p1).css("left")) + (parseInt($(p1).width()) / 2 ));
        var player1CenterY = (parseInt($(p1).css("top")) + (parseInt($(p1).height()) / 2 ));
        var player2CenterX = (parseInt($(p2).css("left")) + (parseInt($(p2).width()) / 2 ));
        var player2CenterY = (parseInt($(p2).css("top")) + (parseInt($(p2).height()) / 2 ));

        $(line).attr('x1', player1CenterX);
        $(line).attr('y1',player1CenterY);
        $(line).attr('x2', player2CenterX);
        $(line).attr('y2',player2CenterY);
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

        return !(objLeft < boundsLeft || objRight > boundsRight || objTop < boundsTop || objBottom > boundsBottom);
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

    function tick() {
        if(p1MoveLeft) {$(p1).css({'left': '-=' + speed});}
        if(p1MoveRight) {$(p1).css({'left': '+=' + speed});}
        if(p1MoveUp) {$(p1).css({'top': '-=' + speed});}
        if(p1MoveDown) {$(p1).css({'top': '+=' + speed});}

        if(p2MoveLeft) {$(p2).css({'left': '-='+speed});}
        if(p2MoveRight) {$(p2).css({'left': '+=' + speed});}
        if(p2MoveUp) {$(p2).css({'top': '-=' + speed});}
        if(p2MoveDown) {$(p2).css({'top': '+=' + speed});}

        alignLine();
        console.log();
        if(checkCollision($(p1),$('#testBlock'))) {
            console.log('COLLISION DETECTED!');
        }
    }

    //initialize the game
    function initDiploid() {
        alignLine();
        startGame = setInterval(tick, 10);
        console.log($(p1));
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

