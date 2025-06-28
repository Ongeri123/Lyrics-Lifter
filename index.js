const getSongBtn = document.getElementById("getSong");
const artistInput = document.getElementById("artistname");
const songInput = document.getElementById("songname");

const lyricsSection = document.querySelector(".lyricsPocket");
const albumSection = document.querySelector(".albumImgPocket");
const playSection = document.querySelector(".playSong");

getSongBtn.addEventListener("click", () => {
  const artist = artistInput.value.trim();
  const song = songInput.value.trim();

  if (!artist || !song) {
    alert("Please enter both artist and song name");
    return;
  }

  // 1. Fetch lyrics from lyrics.ovh
  fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`)
    .then(res => res.json())
    .then(data => {
      const lyrics = data.lyrics || "Lyrics not found.";
      lyricsSection.innerHTML = `<h1>Lyrics</h1><pre style="white-space:pre-wrap;color:white;">${lyrics}</pre>`;
    })
    .catch(() => {
      lyricsSection.innerHTML = `<h1>Lyrics</h1><p style="color:white;">Lyrics not found.</p>`;
    });

  // 2. Fetch track info from iTunes API
  fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(artist + " " + song)}&entity=song&limit=1`)
    .then(res => res.json())
    .then(data => {
      const track = data.results[0];
      if (!track) {
        albumSection.innerHTML = `<h1>Album Photo</h1><p>No artwork found.</p>`;
        playSection.innerHTML = `<h1>PlaySong</h1><p>No preview found.</p>`;
        return;
      }

      // Album art
      albumSection.innerHTML = `
        <h1>Album Photo</h1>
        <img src="${track.artworkUrl100.replace("100x100", "300x300")}" alt="Album Art" style="border-radius:10px;" />
        <p><strong>${track.trackName}</strong><br>${track.artistName}</p>
      `;

      // Audio preview
      playSection.innerHTML = `
        <h1>PlaySong</h1>
        <audio controls>
          <source src="${track.previewUrl}" type="audio/mpeg">
          Your browser does not support the audio tag.
        </audio>
      `;
    })
    .catch(err => {
      console.error(err);
      albumSection.innerHTML = `<h1>Album Photo</h1><p>Error fetching album.</p>`;
      playSection.innerHTML = `<h1>PlaySong</h1><p>Error playing preview.</p>`;
    });
});
