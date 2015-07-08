$(function(){
    var body = $('body');
    var diploid = $('#diploid');

    //var testBlock = $('#testBlock');
    /*var blockBLX = null;
    var blockTLY = null;
    var blockTRX = null;
    var blockBRY = null;*/

    //line
    var line = $('#line');
    var lineX1 = null;
    var lineY1 = null;
    var lineX2 = null;
    var lineY2 = null;
    var lineP1 = [];
    var lineP2 = [];

    //global speed
    var speed = 3;

    var playerArray = [];

    var blockArray = [];

    var Player = function(selectorID,ghostID,lKeyCode,rKeyCode,uKeyCode,dKeyCode) {
        var player = this;
        player.sel = $('#' + selectorID);

        //
        player.getCenter = function() {
            player.centerX = (parseInt($(player.sel).css("left")) + (parseInt($(player.sel).width()) / 2 ));
            player.centerY = (parseInt($(player.sel).css("top")) + (parseInt($(player.sel).height()) / 2 ));
        };

        //is player currently trying to move?
        player.moveLeft = false;
        player.moveRight = false;
        player.moveUp = false;
        player.moveDown = false;

        //create ghost divs for each player to 'move ahead' and see if moves are 'valid'
        diploid.prepend('<div id="'+ghostID+'" class="ghost"></div>');
        player.g = $('#'+ghostID);

        $(player.g).css({'left': $(player.sel).position().left, 'top': $(player.sel).position().top});

        //player control key bindings
        $(body).keydown(function(e) {
            var p1k = e.keyCode;
            if (p1k==lKeyCode) {player.moveLeft = true}
            if (p1k==rKeyCode) {player.moveRight = true}
            if (p1k==uKeyCode) {player.moveUp = true}
            if (p1k==dKeyCode) {player.moveDown = true}
        });
        $(body).keyup(function(e) {
            var p1k = e.keyCode;
            if (p1k==lKeyCode) {player.moveLeft = false}
            if (p1k==rKeyCode) {player.moveRight = false}
            if (p1k==uKeyCode) {player.moveUp = false}
            if (p1k==dKeyCode) {player.moveDown = false}
        });

        player.move = function() {
            var pMoved = 0;
            if(player.moveLeft) {$(player.g).css({'left': '-=' + speed}); pMoved = 1}
            if(player.moveRight) {$(player.g).css({'left': '+=' + speed}); pMoved = 1}
            if(player.moveUp) {$(player.g).css({'top': '-=' + speed}); pMoved = 1}
            if(player.moveDown) {$(player.g).css({'top': '+=' + speed}); pMoved = 1}
            if(pMoved) {
                if(!checkOutOfBounds($(player.g), $(diploid))) {
                    $(player.sel).css({'top': $(player.g).position().top, 'left': $(player.g).position().left});
                } else {
                    $(player.g).css({'top': $(player.sel).position().top, 'left': $(player.sel).position().left});
                }
            }
        };

        //add this player to the player array so that both players can be targeted together quickly
        playerArray.push(player);
    };

    var p1 = new Player('p1','ghost1',65,68,87,83);
    var p2 = new Player('p2','ghost2',37,39,38,40);

    //block object
    var Block = function(selectorID,blockX,blockW,blockH) {
        var block = this;
        block.sel = '#' + selectorID;

        $(diploid).prepend('<div id="' + selectorID + '" class="block"></div>');
        $(block.sel).css({'left': blockX});
        $(block.sel).css('width', blockW);
        $(block.sel).css('height', blockH);


        //block object has it's own intersect detection

        block.checkCorners = function(x,y) {
            return (((lineY2 - lineY1) * x) + ((lineX1 - lineX2) * y)) + ((lineX2 * lineY1) - (lineX1 * lineY2));
        };

        block.moveBlock = function() {
            block.BLX = $(block.sel).position().left;
            block.TLY =  $(block.sel).position().top;
            block.TRX = $(block.sel).position().left + $(block.sel).width();
            block.BRY = $(block.sel).position().top + $(block.sel).height();

            block.checkIntersection();
        };

        block.checkIntersection = function() {
            block.cornerCheckTL = block.checkCorners(block.BLX,block.BRY);
            block.cornerCheckTR = block.checkCorners(block.TRX,block.BRY);
            block.cornerCheckBL = block.checkCorners(block.BLX,block.TLY);
            block.cornerCheckBR = block.checkCorners(block.TRX,block.TLY);

            if((block.cornerCheckBL < 0 && block.cornerCheckBR < 0 && block.cornerCheckTL < 0 && block.cornerCheckTR < 0) || (block.cornerCheckBL > 0 && block.cornerCheckBR > 0 && block.cornerCheckTL > 0 && block.cornerCheckTR > 0)) {
                return false;
            } else if((lineX1 > block.TRX && lineX2 > block.TRX) || (lineX1 < block.BLX && lineX2 < block.BLX) || ((lineY1 > block.BRY && lineY2 > block.BRY)) || (lineY1 < block.TLY && lineY2 < block.TLY)) {
                return false;
            } else {
                console.log('WE HAVE INTERSECTION!!!');
            }
        };
        blockArray.push(block);
    };

    var block1 = new Block('newBlock',40,200,75);
    var block2 = new Block('newBlock2',600,100,250);
    console.log('Number of blocks: ' + blockArray.length);

    console.log(blockArray);

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
        for(i = 0; i < playerArray.length; i += 1) {
            playerArray[i].move();
        }
        for(i = 0; i < blockArray.length; i += 1) {
            blockArray[i].moveBlock();
            for(var p = 0; p < playerArray.length; p += 1) {
                if(checkCollision($(playerArray[p].sel),$(blockArray[i].sel))) {
                    console.log($(p1) + ' collided with a block!');
                }
            }
        }
        alignLine();
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