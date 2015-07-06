$(function(){
    var body = $('body');
    var p1 = $('#p1');
    var p2 = $('#p2');
    var line = $('#line');

    //player 1 key listeners
    $(body).keydown(function(p1) {
        // prevent arrow keys from scrolling the page
        //event.preventDefault();
        p1k = p1.keyCode;
        if (p1k==37) {console.log('left down')}
        if (p1k==39) {console.log('right down')}
        if (p1k==38) {console.log('up down')}
        if (p1k==40) {console.log('down down')}
    });
    $(body).keyup(function(p1) {
        p1k = p1.keyCode;
        if (p1k==37) {console.log('left up')}
        if (p1k==39) {console.log('right up')}
        if (p1k==38) {console.log('up up')}
        if (p1k==40) {console.log('down up')}
    });

    //player 2 key listeners
    $(body).keydown(function(p2) {
        // prevent arrow keys from scrolling the page
        //event.preventDefault();
        p2k = p2.keyCode;
        if (p2k==65) {console.log('left down')}
        if (p2k==68) {console.log('right down')}
        if (p2k==87) {console.log('up down')}
        if (p2k==83) {console.log('down down')}
    });
    $(body).keyup(function(p2) {
        p2k = p2.keyCode;
        if (p2k==65) {console.log('left up')}
        if (p2k==68) {console.log('right up')}
        if (p2k==87) {console.log('up up')}
        if (p2k==83) {console.log('down up')}
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

