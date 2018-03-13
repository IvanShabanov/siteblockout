<?php
$games = array('arcanoid');
$url = $_GET['url']; 
$content = '';
if ($url != '') {
    $content = file_get_contents($url);

    if ($content === false) {
        $purl = parse_url($url);
        $host = $purl['host'];
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        //curl_setopt($ch, CURLOPT_POST, 1);
        //curl_setopt($ch, CURLOPT_POSTFIELDS,$vars);  //Post Fields
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $headers = [
            'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Encoding: gzip, deflate',
            'Accept-Language: en-US,en;q=0.5',
            'Cache-Control: no-cache',
            'Content-Type: application/x-www-form-urlencoded; charset=utf-8',
            'Host: '.$host,
            'Referer: '.$url, //Your referrer address
            'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:28.0) Gecko/20100101 Firefox/28.0',
            'X-MicrosoftAjax: Delta=true'

        ];

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $content = curl_exec ($ch);

        curl_close ($ch);

    }
};
if ($content) {

    $content = iconv(mb_detect_encoding($content), "UTF-8", $content);

    $gane = $_GET['game'];
    if (!in_array($game, $games)) {
        $game = $games[0];
    }
    $js = file_get_contents($game.'.js');
    $css = file_get_contents($game.'.css');
    $html = file_get_contents($game.'.html');
    $content = str_replace('<title>', '<title>'.$game.' on ', $content);

    $content = preg_replace('/(<head[^>]*>)/i', '$1<base href="'.$url.'"/><meta charset="utf-8">', $content);
    if ($_GET['cropjs'] == 1) {
        $content = preg_replace('#<script(.*?)>(.*?)</script>#is', '', $content);
    }

    /*
    $content = str_replace('<script', '<!-- script', $content);
    $content = str_replace('</script>', '<-- /script -->', $content);
    */
    /*
    $content = str_replace('<iframe', '<!-- iframe', $content);
    $content = str_replace('</iframe>', '<-- /iframe -->', $content);
    */
    $jquery = '<script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>';
    $head = $jquery. '<style>'.$css.'</style><script>'.$js.'</script>'; 
    $content = str_replace('</head>', $head.'</head>', $content);
    $content = str_replace('</body>', $html.'</body>', $content);
    echo $content;
} else {

?>
    <!DOCTYPE html>
    <html>

    <head>
        <title>Play on site</title>
    </head>

    <body>
        <h1>Site games</h1>
        <p>Enter site url and choose game than play</p>
        <p>(c) 2018 Ivan Shabanov</p>
        <form action="" mathod="GET">
            <p>Site url: <input type="text" name="url" placeholder="http://www.site.ru"></p>
            <p>Game: <select name="game">
                <?php
                foreach ($games as $game) {
                 echo '<option value="'.$game.'">'.$game.'</option>';
                };
                ?>
                </select></p>

            <p>Crop Javascript: <input type="checkbox" name="cropjs" value="1" checked="checked"></p>
            <p><button>Play game</button></p>
        </form>
    </body>

    </html>
    <?php } ?>
