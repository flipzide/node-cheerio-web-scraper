var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    request = require('request'),
    cheerio = require('cheerio'),
    app = express(),
    bodyParser = require('body-parser');

//support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({extended: true}));

//tell express that we want to use the www folder for our static assets
app.use(express.static(path.join(__dirname, 'www')));

app.post('/scrape', function(req, res){
    res.setHeader('Content-Type', 'application/json');

    request(req.body.url, function(error, response, responseHtml){
        //create the cheerio object
        var resObj = {},
            $ = cheerio.load(responseHtml),
            //create a reference to the meta elements
            $title = $('head title').text();
            $desc = $('meta[name="description"]').attr('content');
            $kwd = $('meta[name="keywords"]').attr('content');
            $ogTitle = $('meta[property="og:title"]').attr('content');
            $ogImage = $('meta[property="og:image"]').attr('content');
            $ogkeywords = $('meta[property="og:keywords"]').attr('content');

            $images = $('img');
            
            if ($ogImage && $ogImage.length){
                console.log($ogImage);
            }

            if ($images && $images.length){
                for (var i = 0; i < $images.length; i++) {
                    console.log($images[i]);
                }
            }

        
        //create the HTTP header's Content-Type property
        res.writeHead(200, {'Content-Type': 'text/html'});

        if ($title) {
            resObj.title = $title;
        }

        if ($desc) {
            resObj.description = $desc;
        }

        if ($kwd) {
            resObj.keywords = $kwd;
        }

        if ($ogImage && $ogImage.length){
            resObj.ogImage = $ogImage;
        }

        if ($ogTitle && $ogTitle.length){
            resObj.ogTitle = $ogTitle;
        }

        if ($ogkeywords && $ogkeywords.length){
            resObj.ogkeywords = $ogkeywords;
        }

        if ($images && $images.length){
            resObj.images = [];

            for (var i = 0; i < $images.length; i++) {
                resObj.images.push($($images[i]).attr('src'));
            }
        }

        //send the response
        res.end(JSON.stringify(resObj));
    }) ;
});

//listen for an HTTP request
app.listen('8081');

//just so we know the server is running
console.log('Navigate your brower to: http://localhost:8081');