// List of Albums
var albums = [];

// Example Album
 var albumPicasso = {
     title: 'The Colors',
     artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1881',
     albumArtUrl: 'assets/images/album_covers/01.png',
     songs: [
         { title: 'Blue', duration: '4:26' },
         { title: 'Green', duration: '3:14' },
         { title: 'Red', duration: '5:01' },
         { title: 'Pink', duration: '3:21'},
         { title: 'Magenta', duration: '2:15'}
     ]
 };
albums.push(albumPicasso); //push albumPicasso into the "albums" list
 
 // Another Example Album
 var albumMarconi = {
     title: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { title: 'Hello, Operator?', duration: '1:01' },
         { title: 'Ring, ring, ring', duration: '5:01' },
         { title: 'Fits in your pocket', duration: '3:21'},
         { title: 'Can you hear me now?', duration: '3:14' },
         { title: 'Wrong phone number', duration: '2:15'}
     ]
 };
albums.push(albumMarconi); //push albumMarconi into the "albums" list

 // Third Example Album
 var albumQueen = {
     title: 'A Night at The Oper',
     artist: 'Marconi',
     label: 'EMI',
     year: '1975',
     albumArtUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png',
     songs: [
         { title: 'Love of My Life', duration: '3:38' },
         { title: 'The Prophet\'s song', duration: '8:21' },
         { title: 'Bohemian Rapsody', duration: '5:57'},
         { title: 'You\'re my Best Friend', duration: '2:50' },
         { title: '39', duration: '3:30'}
     ]
 };
albums.push(albumQueen); //push albumQueen into the "albums" list

 var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     return template;
 };

 var setCurrentAlbum = function(album) {
     // #1
     var albumTitle = document.getElementsByClassName('album-view-title')[0];
     var albumArtist = document.getElementsByClassName('album-view-artist')[0];
     var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
     var albumImage = document.getElementsByClassName('album-cover-art')[0];
     var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
 
     // #2
     albumTitle.firstChild.nodeValue = album.title;
     albumArtist.firstChild.nodeValue = album.artist;
     albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
     albumImage.setAttribute('src', album.albumArtUrl);
 
     // #3
     albumSongList.innerHTML = '';
 
     // #4
     for (var i = 0; i < album.songs.length; i++) {
         albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
     }
 };
 
var currentAlbum = 0; //make sure current Album is initially set to zero

var changeAlbum = function(album) {
    currentAlbum++;
    if(currentAlbum >= albums.length) currentAlbum = 0;
    setCurrentAlbum(albums[currentAlbum]);
}

 window.onload = function() {
     setCurrentAlbum(albumPicasso);
     var albumCover = document.getElementsByClassName('album-cover-art')[0];
     albumCover.addEventListener("click", changeAlbum);
 };