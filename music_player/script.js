// script.js
const previousButton = document.getElementById("previous");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const shuffleButton = document.getElementById("shuffle");
const repeatButton = document.getElementById("repeat");
const volumeSlider = document.getElementById("volume");
const progressBar = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const playlistSongs = document.getElementById("playlist-songs");

const allSongs = [
    { id: 0, title: "Scratching The Surface", artist: "Quincy Larson", duration: "4:25", src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/scratching-the-surface.mp3", img: "https://picsum.photos/id/1005/400/400" },
    { id: 1, title: "Can't Stay Down", artist: "Quincy Larson", duration: "4:15", src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cant-stay-down.mp3", img: "https://picsum.photos/id/1012/400/400" },
    { id: 2, title: "Still Learning", artist: "Quincy Larson", duration: "3:51", src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/still-learning.mp3", img: "https://picsum.photos/id/1015/400/400" },
    { id: 3, title: "Cruising for a Musing", artist: "Quincy Larson", duration: "3:34", src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cruising-for-a-musing.mp3", img: "https://picsum.photos/id/1020/400/400" },
    { id: 4, title: "Never Not Favored", artist: "Quincy Larson", duration: "3:35", src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/never-not-favored.mp3", img: "https://picsum.photos/id/1027/400/400" },
    { id: 5, title: "From the Ground Up", artist: "Quincy Larson", duration: "3:12", src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/from-the-ground-up.mp3", img: "https://picsum.photos/id/1035/400/400" },
    { id: 6, title: "Walking on Air", artist: "Quincy Larson", duration: "3:25", src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/walking-on-air.mp3", img: "https://picsum.photos/id/1040/400/400" },
    { id: 7, title: "Can't Stop Me. Can't Even Slow Me Down.", artist: "Quincy Larson", duration: "3:52", src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cant-stop-me-cant-even-slow-me-down.mp3", img: "https://picsum.photos/id/1049/400/400" },
    { id: 8, title: "The Surest Way Out is Through", artist: "Quincy Larson", duration: "3:10", src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/the-surest-way-out-is-through.mp3", img: "https://picsum.photos/id/1052/400/400" },
    { id: 9, title: "Chasing That Feeling", artist: "Quincy Larson", duration: "2:43", src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/chasing-that-feeling.mp3", img: "https://picsum.photos/id/1062/400/400" }
];


const audio = new Audio();
audio.volume = 1;

let userData = {
    songs: [...allSongs],
    currentSong: null,
    songCurrentTime: 0
};

/* Utility */
const formatTime = secs => {
    const m = Math.floor(secs / 60) || 0;
    const s = Math.floor(secs - m * 60) || 0;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
}
const getCurrentSongIndex = () => userData.songs.indexOf(userData.currentSong);

/* Render */
const renderSongs = arr => {
    playlistSongs.innerHTML = arr.map(song => `
    <li id="song-${song.id}" class="playlist-song">
      <button class="playlist-song-info" onclick="playSong(${song.id})">
        <span class="playlist-song-title">${song.title}</span>
        <span class="playlist-song-artist">${song.artist}</span>
        <span class="playlist-song-duration">${song.duration}</span>
      </button>
      <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}">
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/><path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg>
      </button>
    </li>`).join('');
};

const highlightCurrentSong = () => {
    document.querySelectorAll(".playlist-song").forEach(el => el.removeAttribute("aria-current"));
    const highlight = document.getElementById(`song-${userData?.currentSong?.id}`);
    if (highlight) highlight.setAttribute("aria-current", "true");
};

const setPlayerDisplay = () => {
    document.getElementById("player-song-title").textContent = userData?.currentSong?.title || "";
    document.getElementById("player-song-artist").textContent = userData?.currentSong?.artist || "";
};

/* Playback */
const playSong = id => {
    const song = userData.songs.find(s => s.id === id);
    audio.src = song.src;
    audio.title = song.title;
    document.querySelector("#player-album-art img").src = song.img || "default.jpg"; // fallback
    audio.currentTime = (userData.currentSong?.id === song.id) ? userData.songCurrentTime : 0;
    userData.currentSong = song;
    playButton.classList.add("playing");
    highlightCurrentSong();
    setPlayerDisplay();
    setPlayButtonAccessibleText();
    audio.play();
};

const pauseSong = () => {
    userData.songCurrentTime = audio.currentTime;
    playButton.classList.remove("playing");
    audio.pause();
};

const playPreviousSong = () => {
    if (userData.currentSong === null) return;
    const idx = getCurrentSongIndex();
    playSong(userData.songs[idx - 1]?.id);
};
const playNextSong = () => {
    if (userData.currentSong === null) { playSong(userData.songs[0].id); return; }
    const idx = getCurrentSongIndex();
    playSong(userData.songs[idx + 1]?.id);
};
const shuffle = () => {
    userData.songs.sort(() => Math.random() - 0.5);
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    renderSongs(userData.songs);
    pauseSong();
    setPlayerDisplay();
    setPlayButtonAccessibleText();
};

/* Delete & Reset */
const deleteSong = id => {
    if (userData.currentSong?.id === id) { userData.currentSong = null; userData.songCurrentTime = 0; pauseSong(); setPlayerDisplay(); }
    userData.songs = userData.songs.filter(s => s.id !== id);
    renderSongs(userData.songs);
    highlightCurrentSong();
    setPlayButtonAccessibleText();
    if (!userData.songs.length) {
        const resetBtn = document.createElement("button");
        resetBtn.id = "reset"; resetBtn.textContent = "Reset Playlist"; resetBtn.ariaLabel = "Reset playlist";
        playlistSongs.appendChild(resetBtn);
        resetBtn.addEventListener("click", () => {
            userData.songs = [...allSongs];
            renderSongs(userData.songs);
            setPlayButtonAccessibleText();
            resetBtn.remove();
        });
    }
};

/* Accessible text */
const setPlayButtonAccessibleText = () => {
    const song = userData.currentSong || userData.songs[0];
    playButton.setAttribute("aria-label", song?.title ? `Play ${song.title}` : "Play");
};

/* Progress */
const updateProgress = () => {
    if (!audio.duration) return;
    const percent = (audio.currentTime / audio.duration) * 100;
    progressBar.value = percent;
    currentTimeEl.textContent = formatTime(audio.currentTime);
};
progressBar.addEventListener("input", () => { if (audio.duration) audio.currentTime = (progressBar.value / 100) * audio.duration; });

/* Volume */
volumeSlider.addEventListener("input", () => { audio.volume = volumeSlider.value; });

/* Repeat */
repeatButton.addEventListener("click", () => {
    audio.loop = !audio.loop;
    repeatButton.classList.toggle("active");
});

/* Events */
previousButton.addEventListener("click", playPreviousSong);
playButton.addEventListener("click", () => userData.currentSong === null ? playSong(userData.songs[0].id) : playSong(userData.currentSong.id));
pauseButton.addEventListener("click", pauseSong);
nextButton.addEventListener("click", playNextSong);
shuffleButton.addEventListener("click", shuffle);

audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("loadedmetadata", () => durationEl.textContent = formatTime(audio.duration));
audio.addEventListener("ended", () => {
    if (!audio.loop) {
        const idx = getCurrentSongIndex();
        if (userData.songs[idx + 1]) playNextSong();
        else { userData.currentSong = null; userData.songCurrentTime = 0; pauseSong(); setPlayerDisplay(); highlightCurrentSong(); setPlayButtonAccessibleText(); }
    }
});

/* Init */
const sortSongs = () => { userData.songs.sort((a, b) => a.title.localeCompare(b.title)); return userData.songs; };
renderSongs(sortSongs());
setPlayButtonAccessibleText();

// Dark mode toggle
document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById('dark-toggle');

    // Load theme from localStorage
    const savedMode = localStorage.getItem("theme");
    if (savedMode === "dark") {
        document.body.classList.add("dark-mode");
        toggleBtn.textContent = "☀️";
    } else {
        toggleBtn.textContent = "🌙";
    }

    // Toggle on click
    toggleBtn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem("theme", isDark ? "dark" : "light");
        toggleBtn.textContent = isDark ? "☀️" : "🌙";
    });
});
