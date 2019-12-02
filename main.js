document.getElementById('player').style.display = 'none';
let content = document.getElementById("content2");
let openUrl= "https://shrouded-ocean-69872.herokuapp.com/kkbox/charts?territory=TW";
let xhr = new XMLHttpRequest();
xhr.open('GET',openUrl,true);  
xhr.send(null);
xhr.onreadystatechange = function showCharts () {
  if(this.readyState === 4 && this.status === 200){
    let data = JSON.parse(this.responseText);
    let chart = [];

    data['data'].forEach(function(element,index){
      let itemObj = {};
      itemObj.title = element['title'];
      itemObj.image = element['images'][0]['url'];
      itemObj.idUrl = element['id'];
      chart.push(itemObj);
    });

    let charts = new Vue({
      el:'#chart',
      data: {
        chart: chart
      },
      methods: {
        showAlbums: function (itemObj) {
          window.showAlbums(itemObj.idUrl, itemObj.image, itemObj.title);
        }
      }
    })

    $('#loading').fadeOut(500);
    window.history.pushState(content.innerHTML, null, null);
  }
}

function showAlbums(idUrl, imageUrl) {
  $('#loading').show();
  let openUrl = "https://shrouded-ocean-69872.herokuapp.com/kkbox/charts/" + idUrl + "?territory=TW";
  let xhr2 = new XMLHttpRequest();
  let chartContent = document.getElementById("chart");
  chartContent.innerHTML = '';
  xhr2.open('GET',openUrl,true);
  xhr2.send(null);
  xhr2.onreadystatechange = function(){
    if(this.readyState === 4 && this.status === 200){
      let data = JSON.parse(this.responseText);
      let album = [];

      data['tracks']['data'].forEach(function(element,index){
        let itemObj = {};
        itemObj.songImg = element['album']['images'][0]['url'];
        itemObj.songName = element['name'];
        itemObj.artistName = element['album']['artist']['name'];
        album.push(itemObj);
      });

      let albums = new Vue({
        el:'#album',
        data: {
          album: album,
          albumImg: imageUrl,
        },
        methods: {
          playYoutubeVideo: function (itemObj) {
            window.playYoutubeVideo(itemObj.songName, itemObj.artistName)
          }
        }
      })
    
      $('#loading').fadeOut(500);
      window.history.pushState(content.innerHTML, null, null);
      let tracks = document.querySelector("#album > div.col-sm-8.col-md-8.pt-3").children;
    }
  }   
}
let currentSong = 0;
let tracks = [];
let repeatable = false;
let stochastic = false;
let player;
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
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
  let playbtn = document.querySelector('#play');
  if (event['data'] != -1) {
    document.getElementById('player').style.display = 'inline';
  }
  if (event['data'] == 1) {
    playbtn.classList.remove('fa-play-circle');
    playbtn.classList.add('fa-pause-circle');
  } else if (event['data'] == 2 || event['data'] == 0) {
    playbtn.classList.remove('fa-pause-circle');
    playbtn.classList.add('fa-play-circle');
  }
  if (event['data'] == 0) {
    nextSong();
  }
}

function playYoutubeVideo(songName, artistName) {
  let url = 'https://shrouded-ocean-69872.herokuapp.com/youtube/search?q=' + songName + ' ' + artistName + '&type=video&part=snippet';
  let ytID = new XMLHttpRequest();
  ytID.open('GET',url,true);
  ytID.setRequestHeader("accept", "application/json");
  ytID.send(null);
  ytID.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200){
      let data = JSON.parse(this.responseText);
      let videoId = data["items"][0]["id"]["videoId"];
      player.loadVideoById({videoId:videoId,
                            suggestedQuality:String});
    }
  }
  for (var i = 0; i < tracks.length; i++) {
    let songName = tracks[i].querySelector(".songinfo > .songlink > .songinfo1").innerText;
    if (songinfo == songName) {
      currentSong = i;
    }
  }
}


/* Youtube video refactoring by Vue.js
var playBar = new Vue({
  el: '#playBar',
  data: {

  },
  methods: {
    playSong: function(i){
      let state = player.getPlayerState();
      switch (state) {
        case 1:
          player.pauseVideo();
          break;
        case 2:
          player.playVideo();
          break;
      }
    },
    nextSong: function(){
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
    },
    prevSong: function(){
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
    },
    repeatSong: function(){
      repeatbtn.classList.toggle('active');
      if (repeatbtn.classList.contains('active')) {
        repeatable = true;
      } else {
        repeatable = false;
      }
    },
    reandomSong: function(){
      randombtn.classList.toggle('stochastic');
      if (randombtn.classList.contains('stochastic')) {
        stochastic = true;
      } else {
        stochastic = false;
      }
    }
  }
});
*/

/* Youtube Video by Vanilla JS
let playbtn = document.querySelector("#play");
let nextbtn = document.querySelector("#next");
let prevbtn = document.querySelector("#prev");
let repeatbtn = document.querySelector("#repeat");
let randombtn = document.querySelector("#random");

playbtn.addEventListener('click', playVideo);
nextbtn.addEventListener('click', nextSong);
prevbtn.addEventListener('click', prevSong);
repeatbtn.addEventListener('click', repeatPlay);
randombtn.addEventListener('click', randomPlay);

function playVideo() {
  let state = player.getPlayerState();
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

function playSong(i) {
  eval(tracks[i].querySelector(".col-md-10 > a").href);
}

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

function repeatPlay() {
  repeatbtn.classList.toggle('active');
  if (repeatbtn.classList.contains('active')) {
    repeatable = true;
  } else {
    repeatable = false;
  }
}


function randomPlay() {
  randombtn.classList.toggle('stochastic');
  if (randombtn.classList.contains('stochastic')) {
    stochastic = true;
  } else {
    stochastic = false;
  }
}

function searchText() {
  let search = document.querySelector('.search');
  search.classList.remove('search-hide');
  document.querySelector('.search > input').style.width = '125px';
}*/

window.onpopstate = function () {
  content.innerHTML = history.state;
}