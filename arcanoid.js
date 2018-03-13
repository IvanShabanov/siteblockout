/********************************************/
var curposX;
var curposY;
var maxy = 0;
var wh = 0;
var ww = 0;
var lives = 3;
var max_bricks = 40;
var max_hieght = 1200;
var max_speed = 7;
var xs = 5;
var ys = -5;
var x = 0;
var y = 0;
var max_zindex = 1;
var padposX = 0;
var padposY = 0;
var game_status = 0;
/********************************************/
function InitGame() {
    wh = $(window).height();
    ww = $(window).width();

    $('*').each(function () {
        var zindex = parseInt($(this).css('z-index'));
        if (zindex > max_zindex) {
            max_zindex = zindex + 1;
        }
    })
    $('*:not(:has(*))').each(function () {
        var ok = CheckBrick(this);
    });
    $('*:not(:has(.GameBricks))').each(function () {
        var ok = CheckBrick(this);
    });

    if (maxy > max_hieght) {
        maxy = max_hieght;
    }
    $('.GameBall').remove();
    $('.GamePad').remove();
    $('.GameScores').remove();

    $('body').append('<div class="GameBall"></div>')
    $('body').append('<div class="GamePad"></div>')
    $('body').append('<div class="GameScores"></div>');

    $('.GameBall').css('top', maxy + 50);
    $('.GamePad').css('top', maxy + 150);
    $('.GamePad, .GameBall, .GameScores, .GameBricks').css('z-index', max_zindex);
    var ball_offset = $('.GameBall').offset();
    xs = 5;
    ys = -5;
    x = ball_offset.left;
    y = ball_offset.top;
    padposX = parseInt($('.GamePad').css('left'));
    padposY = parseInt($('.GamePad').css('top'));
    $('html, body').mousemove(function (event) {
        /*var offsetX = parseInt($(this).css('marginLeft'));*/
        curposX = event.pageX /* - offsetX*/ ;
        curposY = event.pageY;

    });

    $('html, body').bind('touchmove', function (jQueryEvent) {
        jQueryEvent.preventDefault();
        var event = window.event;
        var offsetX = parseInt($(this).css('marginLeft'));
        curposX = event.touches[0].pageX - offsetX;
        curposY = event.touches[0].pageY;
    });

    GameScrollScreen();
    statusBar();
};
/********************************************/
function CheckBrick(el) {
    var ok = $(el).is(':visible');
    var display = $(el).css('display');
    var position = $(el).css('position');
    var offset = $(el).offset();
    var h = parseInt($(el).height());
    var w = parseInt($(el).width());

    if ($(el).is(':hidden')) {
        ok = false;
    }
    if (position == 'fixed') {
        ok = false;
    }
    if (typeof offset !== 'undefined') {
        if ((offset.left > ww - max_speed) || (offset.left < max_speed) || (offset.top < 20 + max_speed) || (offset.top > max_hieght) || (h < 2 * max_speed) || (w < 2 * max_speed)) {
            ok = false;
        }

    } else {
        ok = false;
    };
    if ($('.GameBricks').length >= max_bricks) {
        ok = false;
    }
    if (Math.random() > 0.5) {
        ok = false;
    }
    if (ok == true) {
        if (offset.top > maxy) {
            maxy = offset.top + 150;
        };
        $(el).addClass('GameBricks');
    }

    return ok;
}
/********************************************/

function statusBar() {
    var htmltext = 'Bricks left: ' + $('.GameBricks').length + ' &nbsp; Lives: ' + lives;
    if (game_status == 1) {
        htmltext = htmltext + ' <button onclick="game_status=0;statusBar();">pause</button>';
    }
    if (game_status == 0) {
        htmltext = htmltext + ' <button onclick="game_status=1;statusBar();Game();">play</button>';
    }

    $('.GameScores').html(htmltext);
    if ($('.GameBricks').length == 0) {
        setTimeout(function () {
            alert('You win!!!');
            history.go(-1);
        }, 2000);
    }

}
/********************************************/
function BrickOut(el, xs, ys) {
    var mt = parseInt($(el).css('margin-top'));
    var ml = parseInt($(el).css('margin-left'));
    mt = mt + (20 * ys);
    ml = ml + (20 * xs);
    $(el).removeClass('GameBricks');
    $(el).animate({
            'margin-top': mt,
            'margin-left': ml,
        },
        500);
    $(el).addClass('GameBrickOut');
    statusBar();
}
/*****************************************/
function GameScrollScreen() {
    var scrollto = y - 250;

    if (scrollto > padposY + 150 - wh) {
        scrollto = padposY + 150 - wh;
    }

    if (scrollto < 0) {
        scrollto = 0;
    }

    //$("html, body").stop();
    $("html, body").animate({
        'scrollTop': scrollto
    }, 10);

}
/********************************************/
function NextStep() {
    Game();
}
/********************************************/
function Game() {
    if (game_status == 1) {

        var nextstepX = 0
        var nextstepY = 0;
        wh = $(window).height();
        ww = $(window).width();

        maxy = 200;
        $('.GameBricks').each(function () {
            var t = $(this).offset().top;
            var l = $(this).offset().left;
            var h = $(this).height();
            var w = $(this).width();
            if ((t > padposY) || (t + h < 10) || (l + w < 10) || (l > ww)) {
                $(this).removeClass('GameBricks');
                statusBar();
            } else {
                if (t + h > maxy) {
                    maxy = t + h + 250;
                };
            };
            if ((x > l - 10) && (x < l + w + 10) && (y > t - 10) && (y < t + h + 10)) {
                BrickOut(this, xs, ys);
                if (((y - ys) < t) || ((y - ys) > (t + h))) {
                    ys = -ys;
                } else if (((x - xs) < l) || ((x - xs) > (l + w))) {
                    xs = -xs;
                };

            };
        });
        nextstepX = Math.round((curposX - padposX) / 10);
        nextstepY = Math.round((maxy - padposY) / 10);
        if (nextstepY < -3) {
            nextstepY = -3;
        }
        padposX = padposX + nextstepX;
        padposY = padposY + nextstepY - 0.01;
        if (padposY < 150) {
            padposY = 150;
        }

        $('.GamePad').css({
            'left': padposX,
            'top': padposY
        });
        if ((x + 10 > padposX - 50) && (x - 10 < padposX + 50) && (y + 10 > padposY) && (y - 10 < padposY + 20)) {
            ys = -10;
            xs = (x - padposX) / 5 + nextstepX;
        }

        if (y > padposY + 50) {
            lives = lives - 1;
            statusBar();
            if (lives == 0) {
                alert('Game over');
                history.go(-1);
            }
            alert('Your lose a ball');
            y = padposY - 350;
            x = padposX;
            ys = -10;

        }

        if (x > ww - 10) {
            xs = -Math.abs(xs);
        }
        if (x < 10) {
            xs = Math.abs(xs);
        }
        if (y < 10) {
            ys = Math.abs(ys);
        }
        if (xs > max_speed) {
            xs = max_speed;
        }
        if (xs < -max_speed) {
            xs = -max_speed;
        }
        if (ys > max_speed) {
            ys = max_speed;
        }
        if (ys < -max_speed) {
            ys = -max_speed;
        }
        x = x + xs;
        y = y + ys;
        $('.GameBall').css({
            'top': y,
            'left': x
        });
        GameScrollScreen();

        setTimeout(function () {
            NextStep();
        }, 20);
    };

};

/********************************************/
$(document).ready(function () {
    setTimeout(InitGame(), 5000);
});
/********************************************/
