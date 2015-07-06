$(function(){
    var body = $('body');
    var p1 = $('#p1');
    var p2 = $('#p2');
    var line = $('#line');

    //player move states:
    var p1MoveLeft = false;
    var p1MoveRight = false;
    var p1MoveUp = false;
    var p1MoveDown = false;

    var p2MoveLeft = false;
    var p2MoveRight = false;
    var p2MoveUp = false;
    var p2MoveDown = false;

    //player 1 key listeners
    $(body).keydown(function(p1) {
        // prevent arrow keys from scrolling the page
        //event.preventDefault();
        p1k = p1.keyCode;
        if (p1k==37) {console.log('left down');p1MoveLeft = true;}
        if (p1k==39) {console.log('right down');p1MoveRight = true;}
        if (p1k==38) {console.log('up down');p1MoveUp = true;}
        if (p1k==40) {console.log('down down');p1MoveDown = true;}
    });
    $(body).keyup(function(p1) {
        p1k = p1.keyCode;
        if (p1k==37) {console.log('left up');p1MoveLeft = false;}
        if (p1k==39) {console.log('right up');p1MoveRight = false;}
        if (p1k==38) {console.log('up up');p1MoveUp = false;}
        if (p1k==40) {console.log('down up');p1MoveDown = false;}
    });

    //player 2 key listeners
    $(body).keydown(function(p2) {
        // prevent arrow keys from scrolling the page
        //event.preventDefault();
        p2k = p2.keyCode;
        if (p2k==65) {console.log('left down');p2MoveLeft = true}
        if (p2k==68) {console.log('right down');p2MoveRight = true}
        if (p2k==87) {console.log('up down');p2MoveUp = true}
        if (p2k==83) {console.log('down down');p2MoveDown = true}
    });
    $(body).keyup(function(p2) {
        p2k = p2.keyCode;
        if (p2k==65) {console.log('left up');p2MoveLeft = false}
        if (p2k==68) {console.log('right up');p2MoveRight = false}
        if (p2k==87) {console.log('up up');p2MoveUp = false}
        if (p2k==83) {console.log('down up');p2MoveDown = false}
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

    function tick() {
        // everything that gets checked / run per frame
        alignLine();
        console.log('New Frame!');
    }

    //initialize the game
    function initDiploid() {
        alignLine();
        //startGame = setInterval(tick, 10);
    }

    $('#stop').click(function(){
        clearInterval(startGame);
    });

    initDiploid();
});

