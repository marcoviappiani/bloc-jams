

 var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
      + '</tr>'
      ;
 
     var $row = $(template);
     
     var clickHandler = function() {
         // clickHandler logic
         
         var songNumber = parseInt($(this).attr('data-song-number'));
         
         
         
         // play new song
         if (currentlyPlayingSongNumber !== null) {
             var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
             currentlyPlayingCell.html(currentlyPlayingSongNumber);
         }
         
         if(currentlyPlayingSongNumber !== songNumber) {            
             // Play -> Pause
             $(this).html(pauseButtonTemplate);
             setSong(songNumber);
             currentSoundFile.play();
             updateSeekBarWhileSongPlays();
             
             var $volumeFill = $('.volume .fill');
             var $volumeThumb = $('.volume .thumb');
             $volumeFill.width(currentVolume + '%');
             $volumeThumb.css({left: currentVolume + '%'}); 
             
             updatePlayerBarSong();
         } else if (currentlyPlayingSongNumber === songNumber) {
             if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
                 updateSeekBarWhileSongPlays();
            } else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();   
            }
         }
     };
     
     var onHover = function(event) {
         var songNumberCell = $(this).find('.song-item-number');
         var songNumber = parseInt(songNumberCell.attr('data-song-number'));
         
         if(songNumber !== currentlyPlayingSongNumber) {
                 songNumberCell.html(playButtonTemplate);
             }
     };
     
     var offHover = function(event) {
         var songNumberCell = $(this).find('.song-item-number');
         var songNumber = parseInt(songNumberCell.attr('data-song-number'));
         
         //console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
         if (songNumber !== currentlyPlayingSongNumber) {
                 songNumberCell.html(songNumber);
             } 
     };
     
     // #1
     $row.find('.song-item-number').click(clickHandler);
     // #2
     $row.hover(onHover, offHover);
     // #3
     return $row;
 };

 var setCurrentAlbum = function(album) {
     currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     $albumSongList.empty();
 
     // #4
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };

 var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         // #10
         currentSoundFile.bind('timeupdate', function(event) {
             
             var currentTime = this.getTime();
             var totalTime = this.getDuration();
             // #11
             var seekBarFillRatio = currentTime / totalTime;
             var $seekBar = $('.seek-control .seek-bar');
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
             setCurrentTimeInPlayerBar(filterTimeCode(currentTime));
         });
     }
 };

var setCurrentTimeInPlayerBar = function (currentTime) {
    $('.current-time').text(currentTime);
};

var setTotalTimeInPlayerBar = function (totalTime) {
    $('.total-time').text(totalTime);
};

var filterTimeCode = function(timeInSeconds){
    var min;
    var sec;
    timeInSeconds = parseFloat(timeInSeconds);
    min = Math.floor(timeInSeconds / 60);
    sec = Math.floor(timeInSeconds % 60);
    if(sec<10) {sec = "0"+sec;}
    else if(sec == 0) {sec = "00";};
    //console.log(min,sec);
    return min+":"+sec;
};

 var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    // #1
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
    // #2
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

 var setupSeekBars = function() {
     var $seekBars = $('.player-bar .seek-bar');
     
 
     $seekBars.click(function(event) { 
         // #3
         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();
         // #4
         var seekBarFillRatio = offsetX / barWidth;
 
         // #5
         updateSeekPercentage($(this), seekBarFillRatio);
         
         if($(this).parent().attr('class') == 'seek-control') {
             seek(seekBarFillRatio * currentSoundFile.getDuration());
         } else {
             setVolume(seekBarFillRatio * 100);
         }
     });
     
     $seekBars.find('.thumb').mousedown(function(event) {
         // #8
         var $seekBar = $(this).parent();
 
         // #9
         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;
             
             if($(this).parent().attr('class') == 'seek-control') {
             seek(seekBarFillRatio * currentSoundFile.getDuration());
             } else {
                 setVolume(seekBarFillRatio * 100);
             }
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
 
         // #10
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });
 };

 var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };

var updatePlayerBarSong = function() {

    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var totalTime;
    
    currentSoundFile.bind("timeupdate", function(e) {
        totalTime = currentSoundFile.getDuration();
        setTotalTimeInPlayerBar(filterTimeCode(totalTime));    
    });  
};

var setSong = function(songNumber) {
    if (currentSoundFile) {
         currentSoundFile.stop();
     }
    //assigns currentlyPlayingSongNumber and currentSongFromAlbum a new value based on the new song number.
    if(songNumber === null ) {
        currentlyPlayingSongNumber = null;
        currentSongFromAlbum = null;
    } else {
        currentlyPlayingSongNumber = parseInt(songNumber);
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];    
        // #1
        currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         // #2
         formats: [ 'mp3' ],
         preload: true
     });
    }
    setVolume(currentVolume);
};

  var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 };
  
 var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};


var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    // Save the last song number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;

    // Set a new current song
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();

    // Update the Player Bar information
    updatePlayerBarSong();

    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    // Save the last song number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;

    // Set a new current song
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();

    // Update the Player Bar information
    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

 // Album button templates
 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
 var playerBarPlayButton = '<span class="ion-play"></span>';
 var playerBarPauseButton = '<span class="ion-pause"></span>';

 // Store state of playing songs
 //#1
 var currentAlbum = null;
 var currentlyPlayingSongNumber = null;
 var currentSongFromAlbum = null;
 var currentSoundFile = null;
 var currentVolume = 80;

 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');

$(document).ready(function(){
     setCurrentAlbum(albumPicasso);
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
     setupSeekBars();
 });