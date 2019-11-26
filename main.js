document.getElementById('player').style.display = 'none';
  var navContent = document.getElementById('content');
  var content = document.getElementById("content2");
  var album = document.getElementById("album");
  var openUrl= "https://shrouded-ocean-69872.herokuapp.com/kkbox/charts?territory=TW";
  var xhr = new XMLHttpRequest();
  xhr.open('GET',openUrl,true);  
  xhr.send(null);
  xhr.onreadystatechange = function showAlbums () {
    if(this.readyState === 4 && this.status === 200){
      var data = JSON.parse(this.responseText);
      for ( var i = 0; i < data['data'].length ; i++) {
        var title = data["data"][i]["title"];
        var imageUrl = data["data"][i]['images'][0]['url'];
        var node = document.createElement("DIV");
        var image = document.createElement("IMG");
        var link = document.createElement("A");
        var chartsName = document.createElement("DIV");
        var IDUrl = data["data"][i]['id'];
        node.setAttribute("class", "col-12 col-sm-12 col-md-6 col-lg-3 px-2 py-4");
        link.setAttribute("href", "javascript:showCharts(\""+IDUrl+"\",\""+imageUrl+"\")");
        link.setAttribute("class", "album-songs-title");
        image.setAttribute("src", imageUrl);
        image.setAttribute("class", "chartIMG");
        chartsName.setAttribute("class", "chartName d-flex justify-content-center align-items-center mt-2");
        chartsName.innerHTML = title;
        node.appendChild(link);
        link.appendChild(image);
        link.appendChild(chartsName);
        album.appendChild(node);
      }
      $('#loading').fadeOut(500);
      window.history.pushState(content.innerHTML, null, null);
    }
  }
  function showCharts(IDUrl, imageUrl) {
    $('#loading').show();
    var openUrl = "https://shrouded-ocean-69872.herokuapp.com/kkbox/charts/" + IDUrl + "?territory=TW";
    var clientID = new XMLHttpRequest();
    var album = document.getElementById("album");
    album.innerHTML = '';
    clientID.open('GET',openUrl,true);
    clientID.send(null);
    clientID.onreadystatechange = function(){
      if(this.readyState === 4 && this.status === 200){
        var datas = JSON.parse(this.responseText);
        window.scrollTo(0, 0);
        var title = document.querySelector("#content > div > h2");
        var albumtitle = datas["title"];
        var albumimgDIV = document.createElement("DIV");
        var albumIMG = document.createElement("IMG");
        var songtotal = document.createElement("DIV");
        var button = document.createElement("BUTTON");
        var buttonDIV = document.createElement("DIV");
        buttonDIV.setAttribute("class", "albumbtn");
        button.setAttribute("class", "col-12 col-sm-12 col-md-12 btn btn-warning btn");
        button.setAttribute("type", "button");
        button.innerHTML = "全部播放";
        button.setAttribute("onclick", "playSong(0)");
        albumimgDIV.setAttribute("class", "col-sm-12 col-md-4 pt-3 pl-3 albumimg");
        songtotal.setAttribute("class", "col-sm-8 col-md-8 pt-3");
        albumIMG.setAttribute("src", imageUrl);
        album.appendChild(albumimgDIV);
        albumimgDIV.appendChild(albumIMG);
        albumimgDIV.appendChild(buttonDIV);
        buttonDIV.appendChild(button);
        title.innerHTML = albumtitle;
        for ( var i = 0; i < datas["tracks"]["data"].length; i++) {
          var songimgDIV = document.createElement("DIV");
          var songinfoDIV = document.createElement("DIV");
          var songtotalrow = document.createElement("DIV");
          var songlink = document.createElement("A");
          var songimgIMG = document.createElement("IMG");
          var songinfoP = document.createElement("H2");
          var songinfoP2 = document.createElement("SPAN");
          var link = document.createElement("A");
          var songimg = datas["tracks"]["data"][i]["album"]["images"][0]["url"];
          var songinfo = datas["tracks"]["data"][i]["name"];
          var artistinfo = datas["tracks"]["data"][i]["album"]["artist"]["name"];
          songtotalrow.setAttribute("class", "row songtotal");
          songimgDIV.setAttribute("class", "my-1 col-sm-3 col-md-8 col-4 songimg");
          songinfoDIV.setAttribute("class", "my-1 col-sm-9 col-md-10 col-8 songinfo");
          songinfoP.setAttribute("class", "songinfo1");
          songinfoP2.setAttribute("class", "songinfo2");
          songimgIMG.setAttribute("src", songimg);
          songlink.setAttribute("href", "javascript:playYoutubeViedo(\""+songinfo+"\",\""+artistinfo+"\")");
          songlink.setAttribute("class", "songlink")
          link.setAttribute("href", "javascript:playYoutubeViedo(\""+songinfo+"\",\""+artistinfo+"\")");
          songinfoP.innerHTML = songinfo;
          songinfoP2.innerHTML = artistinfo; 
          songimgDIV.appendChild(link);
          songinfoDIV.appendChild(songlink);
          link.appendChild(songimgIMG);
          songlink.appendChild(songinfoP);
          songlink.appendChild(songinfoP2);
          songtotal.appendChild(songtotalrow);
          songtotalrow.appendChild(songimgDIV);
          songtotalrow.appendChild(songinfoDIV);
          album.appendChild(songtotal);
        }
        $('#loading').fadeOut(500);
        window.history.pushState(content.innerHTML, null, null);
        tracks = document.querySelector("#album > div.col-sm-8.col-md-8.pt-3").children;
      }
    }   
  }

  var player;
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '150',
      width: '200',
      videoId: ' ',
      playerVars: {
      'controls': 1,
      'rel': 0,
      'modestbranding': 1,    
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }

  function onPlayerReady(event) {
    event.target.playVideo();
  }

  function onPlayerStateChange(event) {
    if(event['data'] != -1) {
      document.getElementById('player').style.display = 'inline';
    }

    if(event['data'] == 1) {
      let playbtn = document.getElementById('play');
      playbtn.classList.remove('fa-play-circle');
      playbtn.classList.add('fa-pause-circle');
    } else if (event['data'] == 2 || event['data'] == 0) {
      playbtn.classList.remove('fa-pause-circle');
      playbtn.classList.add('fa-play-circle');
    }

    if(event['data'] == 0) {
      nextSong();
    }
  }

  function playYoutubeViedo(songinfo, artistinfo) {
    var url = 'https://shrouded-ocean-69872.herokuapp.com/youtube/search?q=' + songinfo + ' ' + artistinfo + '&type=video&part=snippet';
    var ytID = new XMLHttpRequest();
    ytID.open('GET',url,true);
    ytID.setRequestHeader("accept", "application/json");
    ytID.send(null);
    ytID.onreadystatechange = function() {
      if(this.readyState === 4 && this.status === 200){
        var data = JSON.parse(this.responseText);
        var videoId = data["items"][0]["id"]["videoId"];
        player.loadVideoById({videoId:videoId,
                              suggestedQuality:String});
      }
    }
    for (var i = 0; i < tracks.length; i++) {
      let songName = tracks[i].querySelector(".songinfo > a > .songinfo1").innerHTML;
      if ( songinfo == songName) {
        currentSong = i;
      }
    }
  }

  var playbtn = document.querySelector("#play");
  playbtn.addEventListener('click', playVideo);
  function playVideo() {
    var state = player.getPlayerState();
    switch (state) {
      case 1:
        player.pauseVideo();
        break;
      case 2:
        player.playVideo();
        break;
    }
  }
  
  function stopVideo() {
    player.stopVideo();
  }
  
  var nextbtn = document.querySelector("#next");
  var prevbtn = document.querySelector("#prev");
  var repeatbtn = document.querySelector("#repeat");
  var randombtn = document.querySelector("#random");
  var currentSong = 0;
  var tracks = [];
  var repeatable = false;
  var stochastic = false;

  function playSong(i) {
    eval(tracks[i].querySelector(".col-md-10 > a").href);
  }

  nextbtn.addEventListener('click', nextSong);
  function nextSong() {
    if (stochastic) {
      let randnum = Math.floor(Math.random()*(tracks.length-1));
      playSong((currentSong == randnum) ? Math.floor(Math.random()*(tracks.length-1)) : randnum);
    }
    if (currentSong != tracks.length-1) {
      playSong(++currentSong);
    } else if (repeatable) {
      playSong(0);
    } else {
      stopVideo();
    }
  }
  
  prevbtn.addEventListener('click', prevSong);
  function prevSong() {
    if (stochastic) {
      let randnum = Math.floor(Math.random()*(tracks.length-1));
      playSong((currentSong == randnum) ? Math.floor(Math.random()*(tracks.length-1)) : randnum);
    }
    if (currentSong != 0) {
      playSong(--currentSong);
    } else {
      currentSong = tracks.length;
      playSong(--currentSong);
    }
  }

  repeatbtn.addEventListener('click', repeatPlay);
  function repeatPlay() {
    repeatbtn.classList.toggle('active');
    if (repeatbtn.classList.contains('active')) {
      repeatable = true;
    } else {
      repeatable = false;
    }
  }

  randombtn.addEventListener('click', randomPlay);
  function randomPlay() {
    randombtn.classList.toggle('stochastic');
    if (randombtn.classList.contains('stochastic')) {
      stochastic = true;
    } else {
      stochastic = false;
    }
  }

  function searchText() {
    var search = document.querySelector('.search');
    search.classList.remove('search-hide');
    document.querySelector('.search > input').style.width = '125px';
  }

  window.onpopstate = function () {
    content.innerHTML = history.state;
  }