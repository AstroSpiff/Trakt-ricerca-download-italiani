// ==UserScript==
// @name        Trakt Alternative Watch - Legacy Version
// @namespace   https://github.com/sergeyhist/Trakt.tv-Hist-UserScripts/blob/main/trakt-watch-now.user.js
// @match       *://trakt.tv/*
// @grant       GM_addStyle
// @version     4.0
// @author      Hist
// @description Watch Now Alternative Version
// @icon        https://github.com/sergeyhist/Trakt.tv-Hist-UserScripts/blob/main/logos/logo.png?raw=true
// @downloadURL https://github.com/sergeyhist/Trakt.tv-Hist-UserScripts/raw/main/scripts/trakt-watch-now-legacy.user.js
// @homepageURL https://github.com/sergeyhist/Trakt.tv-Hist-UserScripts
// ==/UserScript==
'use strict';
var watchstyle = `
    .streaming-links,
    #watch-now-country-select,
    #watch-now-powered-by {
        display: none!important;
    }
    #watch-now-modal {
        top: 10%!important;
        left: 5%!important;
        bottom: 5%!important;
        width: 90%!important;
        margin-left: 0px!important;
    }
    #watch-now-content {
        height: 100%;
        overflow: auto;
    }
    .watchsources a {
        display: inline-block;
        font-family: proxima nova;
        margin-block: 10px;
        margin-left: 20px;
        text-decoration: none!important;
        width: 120px;
        vertical-align: top;
        text-align: center;
        color: inherit;
    }
    .watchsources a .icon {
        padding-inline: 1px;
        background-color: #333;
        color: #fff;
        font-size: 12px;
        line-height: 1;
        height: 60px;
        word-wrap: break-word;
        position: relative;
        border: solid #222 2px;
        border-radius: 10px;
    }
    .watchsources a .icon img {
        width: 100%;
        height: 100%;
        padding-block: 10px;
        padding-inline: 10px;
        transition: all .5s;
    }
    .watchsources a .icon img:hover {
        cursor: pointer;
        padding-block: 2px;
        padding-inline: 2px;
    }
    .watchsources .title {
        text-transform: uppercase;
        font-family: proxima nova semibold;
        margin-bottom: 10px;
        color: #666;
        border-bottom: solid 1px #ddd;
        padding-left: 30px;
    }
    #cb_cname, #cb_year, #cb_season, #cb_episode {
        margin-inline: 2px;
    }
    input#cb_year_text, input#cb_season_text, input#cb_episode_text {
        width: 70px;
    }
    input#cb_cname_text {
        width:200px;
    }
    #watch-search {
        display: block;
        color: #fff;
        background-color: rgba(0,0,0,.7);
        padding: 20px 30px;
        font-size: 22px;
        font-family: proxima nova;
        text-align: left;
    }
    #watch-search-string {
        margin: 0!important;
    }
    .watch_search_option {
        display: inline-table;
        width: 150px;
        font-size: 16px;
    }
    .watch_search_option label {
        font-size: 18px;
        font-weight: 100;
    }
    .watch_search_option input {
        font-size: 16px;
        border-radius: 4px;
        border: solid #000 1px;
        color: #000;
        background-color: #fff;
    } 
`;
GM_addStyle(watchstyle);
var sources_list = [
    {
        type: 'online',
        name: 'Youtube',
        color: 'white',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/youtube.png?raw=true',
        link: `https://www.youtube.com/results?search_query=%s`
    },
    {
        type: 'online',
        name: 'Yes!Movies',
        color: '#ba3a56',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/yesmovies.png?raw=true',
        link: `https://yesmovies.ag/searching/%s.html`
    },
    {
        type: 'online',
        name: 'FMovies',
        color: '#47a7bf',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/fmovies.png?raw=true',
        link: `https://ffmovies.co/search?keyword=%s`
    },
    {
        type: 'online',
        name: 'LookMovie-Movies',
        color: 'black',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/lookmovie.png?raw=true',
        link: `https://lookmovie.io/movies/search/?q=%s`
    },
    {
        type: 'online',
        name: 'LookMovie-Series',
        color: 'black',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/lookmovie.png?raw=true',
        link: `https://lookmovie.io/shows/search?q=%s`
    },
    {
        type: 'online',
        name: 'Vidcloud',
        color: 'black',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/vidcloud.png?raw=true',
        link: `https://vidcloud9.com/search.html?keyword=%s`
    },
    {
        type: 'online',
        name: 'Soap2day',
        color: 'black',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/soap2day.png?raw=true',
        link: `https://soap2day.to/search/keyword/%s`
    },
    {
        type: 'online',
        name: 'BatFlix',
        color: 'black',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/batflix.png?raw=true',
        link: `https://ww2.batflix.org/search?q=%s`
    },
    {
        type: 'online',
        name: 'OpenloadMovies',
        color: 'black',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/openload.png?raw=true',
        link: `https://openloadmov.net/?s=%s`
    },
    {
        type: 'online',
        name: 'LunchFlix',
        color: 'white',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/lunchflix.png?raw=true',
        link: `https://www.lunchflix.org/?s=%s`
    },
    {
        type: 'online',
        name: 'HiMovies',
        color: 'black',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/himovies.png?raw=true',
        link: `https://www3.himovies.to/search/%s`
    },
    {
        type: 'online',
        name: 'PutLocker',
        color: 'white',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/putlocker.png?raw=true',
        link: `https://ww2.putlocker123.to/search/%s`
    },
    {
        type: 'online',
        name: 'Rarefilmm',
        color: 'black',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/rarefilm.png?raw=true',
        link: `https://rarefilmm.com/?s=%s`
    },
    {
        type: 'online',
        name: 'Dramacool',
        color: 'black',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/dramacool.png?raw=true',
        link: `https://dramacool.so/search?type=movies&keyword=%s`
    },
    {
        type: 'online',
        name:'KimCartoon',
        color: 'black',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/kimcartoon.png?raw=true',
        link: `https://kimcartoon.to/AdvanceSearch?cartoonName=%s`
    },
    {
        type: 'online',
        name: 'AniMixPlay',
        color: 'black',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/animix.png?raw=true',
        link: `https://animixplay.to/?q=%s`
    },
    {
        type: 'online',
        name: 'KickAssAnime',
        color: 'black',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/kickass.png?raw=true',
        link: `https://www2.kickassanime.rs/search?q=%s`
    },
    {
        type: 'online',
        name: 'AniWatch',
        color: 'black',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/aniwatch.png?raw=true',
        link: `https://aniwatch.me/search?q=%s`
    },
    {
        type: 'ddl',
        name:'HDEncode',
        color: 'black',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/hdencode.png?raw=true',
        link: `https://hdencode.com/?s=%s`
    },
    {
        type: 'ddl',
        name:'RLSBB',
        color: 'black',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/rlsb.png?raw=true',
        link: `http://search.rlsbb.ru/?s=%s`
    },
    {
        type: 'ddl',
        name:'Scene-Rls',
        color: 'black',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/scenerelease.png?raw=true',
        link: `http://scene-rls.com/?s=%s`
    },
    {
        type: 'ddl',
        name:'AnimeKaizoku',
        color: 'white',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/kaizoku.png?raw=true',
        link: `https://animekaizoku.com/?s=%s`
    },
    {
        type: 'torrent',
        name: 'RARBG',
        color: 'white',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/rarbg.png?raw=true',
        link: `https://rarbgtor.org/torrents.php?search=%s`
    },
    {
        type: 'torrent',
        name:'1337x',
        color: 'black',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/1337x.png?raw=true',
        link: `https://1337x.to/search/%s/1/`
    },
    {
        type: 'torrent',
        name: 'The Pirate Bay',
        color: 'black',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/tpb.png?raw=true',
        link: `https://thepiratebay.org/search/%s/0/3/0`
    },
    {
        type: 'torrent',
        name:'Nyaa',
        color: 'white',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/nyaa.png?raw=true',
        link: `https://nyaa.si/?f=0&c=1_0&q=%s`
    },
    {
        type: 'torrent',
        name: 'Anidex',
        color: 'white',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/anidex.png?raw=true',
        link: `https://anidex.info/?q=%s`
    },
    {
        type: 'torrent',
        name: 'ShanaProject',
        color: 'black',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/shana.png?raw=true',
        link: `https://www.shanaproject.com/search/?title=%s`
    },
    {
        type: 'torrent',
        name: 'Rutracker',
        color: 'white',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/rutracker.png?raw=true',
        link: `https://rutracker.org/forum/tracker.php?nm=%s`
    },
    {
        type: 'torrent',
        name: 'AvistaZ',
        color: 'black',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/avistaz.png?raw=true',
        link: `https://avistaz.to/torrents?in=1&search=%s`
    },
    {
        type: 'torrent',
        name: 'CinemaZ',
        color: 'black',
        image: 'https://github.com/sergeyhist/Trakt.tv-Watch-Now-Alternative/blob/main/logos/cinemaz.png?raw=true',
        link: `https://cinemaz.to/torrents?in=1&search=%s`
    }
];
var play_item= ['#ondeck-wrapper','#recently-watched-wrapper','#recommendations-shows','#recommendations-movies','div.row.posters#sortable-grid','#schedule-wrapper',
'.frame:not(.people,.lists,.users)','#history-items','#collection-items','#rating-items','#seasons-episodes-sortable','#actor-credits',
'#recent-wrapper','#progress-wrapper','#recommendations-wrapper','#recent-episodes'];
$(function () {
    for (const element of play_item) {  
        playButtons(element);
}});
$('html').on('show.bs.modal','#watch-now-modal', function (e) {
    var checktitle=setInterval( function () {
        var check_title=$('#watch-now-modal').find('.title-wrapper');
        if (check_title.length) {
            clearInterval(checktitle);
            var name_of_item='';
            var episode_name='';
            var episode_number='';
            var season_number='';
            var year_number='';
            var special_season='';
            var special_episode='';
            $('#watch-now-content .titles').css({"display":"none"});
            $('#watch-now-content .titles').after(`<div id="watch-search"><p type="text" id="watch-search-string"></p></div>`);
            $('#watch-now-modal').find('#watch-search').append(`<div class="watch_search_options"/>`);
            $('#watch-now-modal').find('.watch_search_options').append(`
                <div class="watch_search_option">
                <input type="checkbox" id="cb_year">
                <label for="cb_year">Year</label>
                <input type="text" id="cb_year_text" style="display:none"></div>`);
            $('html').on("change", "#cb_year", function () {
                if (this.checked == true){
                    year_number=$('#watch-now-modal').find('.year').text();
                    $('#watch-now-modal').find('#cb_year_text').css({"display":"block"});
                    $('#cb_year_text').val(`${year_number}`);
                    } else {
                    $('#watch-now-modal').find('#cb_year_text').css({"display":"none"});
                    $('#cb_year_text').val('');
                    }
            });
            episode_name=$('#watch-now-modal').find('.main-title-sxe').text();
            $('#watch-now-modal').find('.watch_search_options').append(`
                <div class="watch_search_option">
                <input type="checkbox" id="cb_season">
                <label for="cb_season">Season</label>
                <input type="text" id="cb_season_text" style="display:none"></div>`);
            $('html').on("change", "#cb_season", function () {
                if (this.checked == true){
                    season_number=episode_name.split("x")[0];
                    special_season=episode_name.split(" ")[0];
                    if (season_number != '') {season_number='s0'+season_number};
                    if (special_season == 'Special') {season_number=special_season};
                    if ($('#watch-now-modal').find('h1').text().match(/:/) != null ) {
                        if ($('#watch-now-modal').find('h1').text().split(":")[1].match(/ Season/) != null ) {
                            season_number='s0'+$('#watch-now-modal').find('h1').text().split(' ').pop();}};
                    $('#watch-now-modal').find('#cb_season_text').css({"display":"block"});
                    $('#cb_season_text').val(`${season_number}`);
                    } else {
                    $('#watch-now-modal').find('#cb_season_text').css({"display":"none"});
                    $('#cb_season_text').val('');
                    }
            });
            $('#watch-now-modal').find('.watch_search_options').append(`
                <div class="watch_search_option">
                <input type="checkbox" id="cb_episode">
                <label for="cb_episode">Episode</label>
                <input type="text" id="cb_episode_text" style="display:none"></div>`);
            $('html').on("change", "#cb_episode", function () {
                if (this.checked == true){
                    episode_number=episode_name.split("x")[1];
                    special_episode=episode_name.split(" ")[1];
                    if (episode_number == null) {episode_number=''} else {episode_number='e'+episode_number};
                    if (special_season == 'Special') {episode_number=' '+special_episode};
                    $('#watch-now-modal').find('#cb_episode_text').css({"display":"block"});
                    $('#cb_episode_text').val(`${episode_number}`);
                    } else {
                    $('#watch-now-modal').find('#cb_episode_text').css({"display":"none"});
                    $('#cb_episode_text').val('');
                    }
            });
            name_of_item=searchName();
            $('#watch-now-modal').find('.watch_search_options').append(`
                <div class="watch_search_option">
                <input type="checkbox" id="cb_cname">
                <label for="cb_cname">Custom-name</label>
                <input type="text" id="cb_cname_text" style="display:none"></div>`);
            $('html').on("change", "#cb_cname", function () {
                if (this.checked == true){
                    $('#watch-now-modal').find('#cb_cname_text').css({"display":"block"});
                    $('#cb_cname_text').val(`${name_of_item}`);
                    } else {
                    $('#watch-now-modal').find('#cb_cname_text').css({"display":"none"});
                    $('#cb_cname_text').val('');
                    }
            });
            $('#watch-now-modal').find('.title-wrapper').after(`<div class="watchsources"/>`);
            $('#watch-now-modal').find('.watchsources').append(`<div class="online_sources"/>`);
            $('#watch-now-modal').find('.online_sources').before(`<div class="title">Online Sources:</div>`);
            $('#watch-now-modal').find('.watchsources').append(`<div class="torrent_sources"/>`);
            $('#watch-now-modal').find('.torrent_sources').before(`<div class="title">Torrent Sources:</div>`);
            $('#watch-now-modal').find('.watchsources').append(`<div class="ddl_sources"/>`);
            $('#watch-now-modal').find('.ddl_sources').before(`<div class="title">DDL Sources:</div>`);
            addSites();   
            var searchinterval=setInterval( function () {
                if (cb_cname.checked == true) {name_of_item=$('#cb_cname_text').val();} else {name_of_item=searchName()};
                if (cb_year.checked == true) {year_number=' '+$('#cb_year_text').val()} else {year_number=$('#cb_year_text').val()};
                if (cb_season.checked == true) {season_number=' '+$('#cb_season_text').val()} else {season_number=$('#cb_season_text').val()};
                if (cb_episode.checked == true) {
                    if ($('#cb_season_text').val().length) {episode_number=$('#cb_episode_text').val()} else {episode_number=' '+$('#cb_episode_text').val()}
                } else {episode_number=$('#cb_episode_text').val()};
                $('#watch-now-modal #watch-search-string').html(`${name_of_item+year_number+season_number+episode_number}`)
                $('#watch-now-modal').on('hidden.bs.modal', function () {clearInterval(searchinterval)});
            },200);
            $('#watch-now-modal .watch_sources_item').on("click", function () {
                var search_item_id=this.id.split("-")[1];
                var search_link=sources_list[search_item_id].link.replace('%s', $('#watch-now-modal #watch-search-string').html());
                window.open(search_link, "_blank");
            });
        }},100);
});

function playButtons(playobject) {
    var consoleplayflag=0;
    if ($('html').find(`${playobject}`).length) {
        var playinterval=setInterval( function() {
                if (playobject == '#schedule-wrapper') {
                    $('#schedule-wrapper').find('.btn-watch-now').remove()
                };
                $(`${playobject}`).find('.grid-item').each( function () {if ($(this).attr('data-url') != null) {
                    if ($(this).attr('data-person-id') != null) {clearInterval(playinterval)} else {
                        var play_item_link=$(this).attr('data-url');
                        $(this).find('.watch-now').remove();
                        $(this).find('.list').after(`<a class="watch-now" id="alternative-watch" data-source-counts="{'at':2,'au':6,'bg':1,'ca':2,'cz':1,'de':4,'dk':1,'es':1,'fi':1,'fr':3,'gr':1,'hu':1,'in':1,'it':2,'no':1,'nz':1,'pl':2,'pt':1,'ro':1,'se':1,'us':8}" data-source-slugs="{'at':['amazon_video','maxdome_store'],'au':['apple_itunes','binge','fetch_tv','foxtel_now','google_play_movies','telstra_tv'],'bg':['hbo_go'],'ca':['apple_itunes','google_play_movies'],'cz':['hbo_go'],'de':['amazon_video','apple_itunes','google_play_movies','maxdome_store'],'dk':['hbo'],'es':['hbo'],'fi':['hbo'],'fr':['apple_itunes','canal_vod','orange_vod'],'gr':['netflix'],'hu':['hbo_go'],'in':['amazon_prime_video'],'it':['infinity','sky_go'],'no':['hbo'],'nz':['tvnz'],'pl':['hbo_go','player'],'pt':['hbo_portugal'],'ro':['hbo_go'],'se':['hbo'],'us':['amazon_video','apple_itunes','cw_seed','fandangonow','google_play_movies','netflix','the_cw','vudu']}"
                        data-target="#watch-now-modal" data-toggle="modal" data-url="${play_item_link}" data-original-title="" title=""><div class="base"></div>
                        <div class="trakt-icon-play2-thick"></div></a>`); 
                        if (consoleplayflag == 0) {consoleplayflag=1; console.log(`${playobject} - find buttons...`)};
                    };
                }});
            if ($(`${playobject}`).find('#alternative-watch').length) {clearInterval(playinterval)};
        },100);
    }
}

function searchName() {
    var long_name=$('#watch-now-modal').find('h3').text();
    var short_name=long_name.substring('Where to watch '.length);
    if (long_name == "Where to watch ") {
        short_name=$('#watch-now-modal').find('h1').text();
    if ( $('#watch-now-modal').find('h1').text().match(/:/) != null ) {
        if ( short_name.split(":")[1].match(/ Season/) != null ) {
            short_name=short_name.split(":")[0];
        } else {
            short_name=short_name.substring(0,short_name.length-5);
        }
    } else {
        short_name=short_name.substring(0,short_name.length-5);}
    }
    return short_name;
}


function addSites() {
    for(var i=0;i < sources_list.length;i++) {
        var source_type='.'+sources_list[i].type+'_sources';
        $('#watch-now-modal').find(`${source_type}`).append(`<a class="watch_sources_item" target="_blank" id="watch_sources_item-${i}"><div class="icon" style="background-color:${sources_list[i].color};"><img src="${sources_list[i].image}" alt="${sources_list[i].name}"></div><div class="price">${sources_list[i].name}<br></div></a>`);
    }
}