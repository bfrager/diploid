$(function(){
    var p1 = $('#p1');
    var p2 = $('#p2');
    var line = $('#line');

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
        startGame = setInterval(tick, 10);
    }

    $('#stop').click(function(){
        clearInterval(startGame);
    });

    initDiploid();
});

