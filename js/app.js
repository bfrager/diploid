$(function() {
    var $body = $('body');
    var $diploid = $('#diploid');

    var $promptStart = $('#start-prompt');

    var p1;
    var p1StartingX = $diploid.width() / 3;
    var p2StartingX = $diploid.width() * (2/3);
    var p2;

    var paused = false;
    var isFirstGame = true;
    var gameStarted;
    var startingLives = 5;
    var winner = null;
    var $winnerModal = $('#winner');
    var $winnerMsg = $('#winner h1');
    var loser = null;

    //line
    var $line = $('#line');
    var lineX1 = null;
    var lineY1 = null;
    var lineX2 = null;
    var lineY2 = null;
    var lineP1 = [];
    var lineP2 = [];

    //global speed
    var speed = 4;
    var pArray = [];
    var blockArray = [];

    var grid = 150;
    var blockAmount = 15;
    var blockCount = 0;
    var blockDuration = 4000;

    var start;
    var $p1score = $('#p1-health');
    var $p2score = $('#p2-health');

    //PLAYER OBJECT
    var Player = function (selectorID, ghostID, lKeyCode, rKeyCode, uKeyCode, dKeyCode, startingX,scoreScreen) {
        $diploid.append('<div class="orb" id="' + selectorID + '"></div>');

        var p = this;
        p.ID = '#' + selectorID;
        p.name = 'Player ' + selectorID;
        p.score = 0;
        p.scoreScreen = scoreScreen;
        p.startingX = startingX;
        var $psel = $(p.ID);

        p.lives = startingLives;

        p.scoreScreen.html(p.lives);

        p.getCenter = function () {
            p.centerX = (parseInt($psel.css("left")) + (parseInt($psel.width()) / 2 ));
            p.centerY = (parseInt($psel.css("top")) + (parseInt($psel.height()) / 2 ));
        };

        //is player currently trying to move?
        p.moveLeft = false;
        p.moveRight = false;
        p.moveUp = false;
        p.moveDown = false;

        //create ghost divs for each player to 'move ahead' and see if moves are 'valid'
        $diploid.append('<div id="' + ghostID + '" class="ghost"></div>');
        p.g = '#' + ghostID;
        var $pg = $(p.g);

        $pg.css({'left': $psel.position().left, 'top': $psel.position().top});

        //player control key bindings

        p.keyDown = function (evt) {
            var pk = evt.which;
            if (pk == lKeyCode) {
                evt.preventDefault();
                p.moveLeft = true
            }
            if (pk == rKeyCode) {
                evt.preventDefault();
                p.moveRight = true
            }
            if (pk == uKeyCode) {
                evt.preventDefault();
                p.moveUp = true
            }
            if (pk == dKeyCode) {
                evt.preventDefault();
                p.moveDown = true
            }
        };

        p.keyUp = function (evt) {
            var pk = evt.which;
            if (pk == lKeyCode) {
                evt.preventDefault();
                p.moveLeft = false
            }
            if (pk == rKeyCode) {
                evt.preventDefault();
                p.moveRight = false
            }
            if (pk == uKeyCode) {
                evt.preventDefault();
                p.moveUp = false
            }
            if (pk == dKeyCode) {
                evt.preventDefault();
                p.moveDown = false
            }
        };

        p.move = function () {
            var pMoved = 0;
            if (p.moveLeft) {
                $pg.css({'left': '-=' + speed});
                pMoved = 1
            }
            if (p.moveRight) {
                $pg.css({'left': '+=' + speed});
                pMoved = 1
            }
            if (p.moveUp) {
                $pg.css({'top': '-=' + speed});
                pMoved = 1
            }
            if (p.moveDown) {
                $pg.css({'top': '+=' + speed});
                pMoved = 1
            }
            if (pMoved) {
                if (!checkOutOfBounds($pg, $diploid)) {
                    $psel.css({'top': $pg.position().top, 'left': $pg.position().left});
                } else {
                    $pg.css({'top': $psel.position().top, 'left': $psel.position().left});
                }
            }
        };

        //add associated HTML selectors to this player's personal array
        p.html = [p.ID, p.g];

        //add this player to the player array so that both players can be targeted together quickly
        pArray.push(p);
    };

    //BLOCK OBJECT
    var Block = function (selectorID) {
        var b = this;

        $diploid.prepend('<div id="' + selectorID + '" class="block"></div>');

        b.ID = '#' + selectorID;
        var $bsel = $(b.ID);

        b.w = Math.round(Math.random() * grid) + grid;
        b.h = Math.round(Math.random() * grid) + grid;
        b.l = Math.round(Math.random() * $diploid.width());

        b.alive = true;

        $bsel.css({'left': b.l});
        $bsel.css('width', b.w);
        $bsel.css('height', b.h);
        $bsel.css('top', ($diploid.height()));

        //each block object has it's own intersect detection
        b.checkCorners = function (x, y) {return (((lineY2 - lineY1) * x) + ((lineX1 - lineX2) * y)) + ((lineX2 * lineY1) - (lineX1 * lineY2));};

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
                hitFlicker();
                console.log('The Line Broke! Both players lose');
                for(var p = 0; p < pArray.length; p += 1) {
                    pArray[p].lives -= 1;
                    pArray[p].scoreScreen.html(pArray[p].lives);
                    console.log(pArray[p].name + ' has ' + pArray[p].lives + ' lives now.');
                }
                startRound();
            }
        };

        b.checkHits = function () {
            if (!paused) {
                b.BLX = $bsel.position().left;
                b.TLY = $bsel.position().top;
                b.TRX = $bsel.position().left + $bsel.width();
                b.BRY = $bsel.position().top + $bsel.height();

                for (var p = 0; p < pArray.length; p += 1) {
                    if (checkCollision($(pArray[p].ID), $bsel)) {
                        hitFlicker();
                        pArray[p].lives -= 1;
                        pArray[p].scoreScreen.html(pArray[p].lives);
                        console.log(pArray[p].name + 'has ' + pArray[p].lives + ' lives!');
                        startRound();
                        break;
                    }
                }
                b.checkIntersection();
            }
        };
        //gets fired ONCE because jQuery animate has its own setInterval steps
        function moveBlockUp() {
            var randomStartTime = Math.floor(Math.random() * $diploid.height()) * grid/4;
            $bsel.delay(randomStartTime).animate(
                {'top': ($bsel.height() * -1)},
                {
                    step: function(){
                        b.checkHits();
                    },
                    duration: blockDuration,
                    easing: 'linear',
                    complete: function(){
                        b.regen();
                    }
                }
            )}

        b.regen = function () {
            blockArray.shift();
            b.alive = false;
            $bsel.remove();
            b = null;
            newBlock();
        };

        moveBlockUp(b);
        blockArray.push(b);
    };

    function newBlock() {
        var blockID = 'block' + blockCount;
        var block = new Block(blockID);
        blockCount += 1;
    }

    function generateBlocks(num) {
        for (var i = 1; i <= num; i += 1) {
            newBlock();
        }
    }

    function checkCollision (obj1, obj2) {
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

    function hitFlicker() {
        $('#hit-flicker').show().fadeOut('fast');
    }

    //create startGame for setInterval() in initDeploid()
    var gamePlay = null;

    function alignLine() {
        //retrieve each player's updated center point bedore aligning the line
        p1.getCenter();
        p2.getCenter();

        //set line segment coordinates based on updated player center points
        $line.attr({
            'x1': p1.centerX,
            'y1': p1.centerY,
            'x2': p2.centerX,
            'y2': p2.centerY
        });

        //set variables for updated line x/y attributes
        lineX1 = $line.attr('x1');
        lineY1 = $line.attr('y1');
        lineX2 = $line.attr('x2');
        lineY2 = $line.attr('y2');

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
            for(var i = 0; i < pArray.length; i += 1) {
                pArray[i].move();
                pArray[i].score += 1;
            }
            alignLine();
        }
    }

    //clear all blocks
    function clearBlocks() {
        $('.block').clearQueue().stop().remove();
        //$('.block').clearQueue().stop();
        blockArray = [];
    }

    //initialize the game
    function startRound() {
        clearBlocks();

        //create players on first game
        if(isFirstGame){
            $('.orb').clearQueue().stop(true,true).remove();
            pArray = [];
            p1 = new Player('p1', 'ghost1', 65, 68, 87, 83,p1StartingX,$p1score);
            p2 = new Player('p2', 'ghost2', 37, 39, 38, 40,p2StartingX,$p2score);
            alignLine();
            gamePlay = setInterval(tick, 10);
            isFirstGame = false;

            $winnerModal.fadeOut();
            $winnerMsg.html('');
        }

        generateBlocks(blockAmount);
        gameStarted = true;

        resetPlayers();
    }
    function rebind(p) {
        $body.on('keydown', pArray[p].keyDown);
        $body.on('keyup',pArray[p].keyUp);
    }

    //temporarily remove mobility while animating, then re-enable;
    function resetPlayers() {

        for(var p = 0; p < pArray.length; p += 1) {
            pArray[p].moveLeft = false;
            pArray[p].moveRight = false;
            pArray[p].moveUp = false;
            pArray[p].moveDown = false;

            $body.off('keydown', pArray[p].keyDown);
            $body.off('keyup', pArray[p].keyUp);

            if(pArray[p].lives != 0) {
                $(pArray[p].ID+','+pArray[p].g).animate(
                    {
                        top: $diploid.height()/2,
                        left: pArray[p].startingX
                    },
                    {
                        duration: 600,
                        complete: rebind(p)
                    }
                );
            } else {
                console.log('GAME OVER!!!!!');
                clearBlocks();
                function clearGamePlay() {
                    clearInterval(gamePlay);
                    console.log('Game play cleared');
                    isFirstGame = true;
                }
                $(pArray[p].ID+','+pArray[p].g).animate(
                    {
                        top: $diploid.height()/2,
                        left: pArray[p].startingX
                    },
                    {
                        duration: 600,
                        complete: clearGamePlay
                    }
                );

                checkWinner();
                //bring overlay to announce winner
            }

        }
    }

    function resetPlayerScores() {
        for(var p = 0; p < pArray.length; p += 1) {
            pArray[p].lives = startingLives;
            pArray[p].scoreScreen.html(pArray[p].lives);
            console.log(pArray[p].scoreScreen);
        }
    }

    function checkWinner() {
        var scoreArray = [];
        for(var p = 0; p < pArray.length; p += 1) {
            scoreArray.push(pArray[p].lives);
        }
        if(scoreArray[0] > scoreArray[1]){
            winnerMsg = 'Player 1 Wins!';
            winner = pArray[0];

        } else if(scoreArray[0] < scoreArray[1]) {
            //console.log('Player 2 Wins!');
            winnerMsg = 'Player 2 Wins!';
            winner = pArray[1];
        } else {
            //console.log('You both need to work on your team skills.');
            winnerMsg = 'You both need to work on your team skills.';
        }
        $(winner.ID).addClass('winning-dance');

        $winnerModal.fadeIn();
        $winnerMsg.html(winnerMsg).fadeIn();
    }

    //restart game with spacebar
    $body.on('keypress', function(evt){
        if(evt.which == 32){
            evt.preventDefault();
            $promptStart.fadeOut();
            gameStarted = false;
            startRound();
            resetPlayerScores();
        }
    });
});