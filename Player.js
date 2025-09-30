/* ===========================
   AMBIL ELEMENT
   =========================== */
const video = document.getElementById("video");
const playPause = document.getElementById("playPause");
const rewind = document.getElementById("rewind");
const forward = document.getElementById("forward");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeBtn = document.getElementById("volumeBtn");
const volumeSliderWrapper = document.querySelector(".volume-slider-wrapper");
const volumeBar = document.getElementById("volumeBar");
const fullscreenBtn = document.getElementById("fullscreen");
const subtitleBtn = document.getElementById("subtitle");
const castBtn = document.getElementById("cast");

/* ===========================
   PLAY / PAUSE
   =========================== */
playPause.addEventListener("click", () => {
  if (video.paused) {
    video.play();
    playPause.innerHTML = '<span class="material-icons">pause</span>';
  } else {
    video.pause();
    playPause.innerHTML = '<span class="material-icons">play_arrow</span>';
  }
});

// Reset tombol saat video selesai
video.addEventListener("ended", () => {
  playPause.innerHTML = '<span class="material-icons">play_arrow</span>';
});

/* ===========================
   REWIND & FORWARD
   =========================== */
rewind.addEventListener("click", () => {
  video.currentTime -= 10;
});

forward.addEventListener("click", () => {
  video.currentTime += 10;
});

/* ===========================
   PROGRESS BAR & WAKTU
   =========================== */
video.addEventListener("timeupdate", () => {
  if (video.duration) {
    const percent = (video.currentTime / video.duration) * 100;
    progress.value = percent;
    currentTimeEl.textContent = formatTime(video.currentTime);

    // Update warna progress
    progress.style.background = `linear-gradient(to right, #fff ${percent}%, #555 ${percent}%)`;
  }
});

// Tampilkan durasi total setelah metadata siap
video.addEventListener("loadedmetadata", () => {
  if (!isNaN(video.duration)) {
    durationEl.textContent = formatTime(video.duration);
  }
});

// Klik progress bar untuk lompat
progress.addEventListener("input", () => {
  if (video.duration) {
    const newTime = (progress.value / 100) * video.duration;
    video.currentTime = newTime;
  }
});

// Jika metadata sudah siap sebelum listener dipasang
if (video.readyState >= 1 && !isNaN(video.duration)) {
  durationEl.textContent = formatTime(video.duration);
}

/* ===========================
   VOLUME
   =========================== */
function updateVolumeIcon() {
  if (video.muted || video.volume === 0) {
    volumeBtn.innerHTML = '<span class="material-icons">volume_off</span>';
  } else if (video.volume < 0.5) {
    volumeBtn.innerHTML = '<span class="material-icons">volume_down</span>';
  } else {
    volumeBtn.innerHTML = '<span class="material-icons">volume_up</span>';
  }
}

function toggleMute() {
  video.muted = !video.muted;
  if (!video.muted && video.volume === 0) video.volume = 0.5;
  volumeBar.value = video.volume;
  updateVolumeIcon();
}

// Sync awal
volumeBar.value = video.volume;
updateVolumeIcon();

// Single click → toggle slider
// Double click / long press → mute
let lastClick = 0;
let longPressTimer;

volumeBtn.addEventListener("click", () => {
  const now = Date.now();
  if (now - lastClick < 300) {
    toggleMute(); // double click
    lastClick = 0;
    return;
  }
  lastClick = now;

  volumeSliderWrapper.classList.toggle("active");
  volumeBar.value = video.volume;
});

// Long press mute
volumeBtn.addEventListener("pointerdown", () => {
  longPressTimer = setTimeout(() => {
    toggleMute();
    volumeSliderWrapper.classList.remove("active");
  }, 600);
});
["pointerup", "pointerleave", "pointercancel"].forEach(evt =>
  volumeBtn.addEventListener(evt, () => clearTimeout(longPressTimer))
);

// Geser volume
volumeBar.addEventListener("input", (e) => {
  const val = parseFloat(e.target.value);
  if (!isNaN(val)) {
    video.volume = val;
    if (video.muted && val > 0) video.muted = false;
    updateVolumeIcon();
  }
});

// Klik luar → tutup slider
document.addEventListener("click", (e) => {
  if (!volumeSliderWrapper.classList.contains("active")) return;
  if (!volumeSliderWrapper.contains(e.target) && !volumeBtn.contains(e.target)) {
    volumeSliderWrapper.classList.remove("active");
  }
});
volumeSliderWrapper.addEventListener("click", (e) => e.stopPropagation());

/* ===========================
   FULLSCREEN
   =========================== */
fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    video.parentElement.requestFullscreen();
    fullscreenBtn.innerHTML = '<span class="material-icons">fullscreen_exit</span>';
  } else {
    document.exitFullscreen();
    fullscreenBtn.innerHTML = '<span class="material-icons">fullscreen</span>';
  }
});

/* ===========================
   SUBTITLE & CAST (Dummy)
   =========================== */
subtitleBtn.addEventListener("click", () => {
  alert("Fitur subtitle belum diaktifkan ❗");
});

castBtn.addEventListener("click", () => {
  alert("Fitur cast ke TV belum diaktifkan ❗");
});

/* ===========================
   HELPER: Format Waktu
   =========================== */
function formatTime(time) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  } else {
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
}
