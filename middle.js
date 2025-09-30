// Bagian Header
document.addEventListener("DOMContentLoaded", function () {
  //Pencarian
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", () => {
      if (searchInput.style.display === "block") {
        searchInput.style.display = "none";
      } else {
        searchInput.style.display = "block";
        searchInput.focus();
      }
    });
  }


  //Hamburger Menu
  const hamburger = document.getElementById("hamburger");
  const closeSidebar = document.getElementById("closeSidebar");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if (hamburger && sidebar && overlay) {
    hamburger.addEventListener("click", () => {
      sidebar.classList.add("show");
      overlay.classList.add("show");
    });
  }

  if (overlay && sidebar) {
    overlay.addEventListener("click", () => {
      sidebar.classList.remove("show");
      overlay.classList.remove("show");
    });
  }

  if (closeSidebar && sidebar && overlay) {
    closeSidebar.addEventListener("click", () => {
      sidebar.classList.remove("show");
      overlay.classList.remove("show");
    });
  }
});

// ------------------------------------------------------------------ //
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
let currentIndex = 0;

function showSlide(index) {
  const offset = -index * 100;
  document.querySelector(".slides-container").style.transform = `translateX(${offset}%)`;
  currentIndex = index;

  // Update dot aktif
  dots.forEach(dot => dot.classList.remove("active"));
  dots[index].classList.add("active");
}

// Tombol navigasi sebelumnya
document.getElementById("prev").addEventListener("click", () => {
  const newIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(newIndex);
});

// Tombol navigasi selanjutnya
document.getElementById("next").addEventListener("click", () => {
  const newIndex = (currentIndex + 1) % slides.length;
  showSlide(newIndex);
});

// Navigasi melalui dot
dots.forEach(dot => {
  dot.addEventListener("click", () => {
    const index = parseInt(dot.getAttribute("data-index"));
    showSlide(index);
  });
});

// Auto-slide setiap 5 detik
setInterval(() => {
  const newIndex = (currentIndex + 1) % slides.length;
  showSlide(newIndex);
}, 12000);

// MyList //
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".slide").forEach(slide => {
    const btn = slide.querySelector(".mylist-btn");
    const icon = btn.querySelector(".material-icons");

    // Ambil data film dari data-* atau isi fallback
    const filmData = {
      id: slide.dataset.id?.trim() || slide.querySelector("h2")?.textContent?.trim().toLowerCase().replace(/\s+/g, "-") || "tanpa-id",
      judul: slide.dataset.judul || slide.querySelector("h2")?.textContent || "Tanpa Judul",
      poster: slide.dataset.poster || slide.querySelector(".image")?.style.backgroundImage?.slice(5, -2) || "https://via.placeholder.com/150x220?text=No+Image"
    };

    // Set ikon awal berdasarkan status MyList
    if (isInMyList(filmData.id)) {
      btn.classList.add("active");
      icon.textContent = "bookmark_remove";
    } else {
      btn.classList.remove("active");
      icon.textContent = "bookmark_add";
    }

    // Tombol diklik
    btn.addEventListener("click", () => {
      const wasInList = isInMyList(filmData.id);
      toggleMyList(filmData);
      const nowInList = isInMyList(filmData.id);

      btn.classList.toggle("active", nowInList);
      icon.textContent = nowInList ? "bookmark_remove" : "bookmark_add";

      showToast(nowInList ? "Ditambahkan ke MyList." : "Dihapus dari MyList.");
    });
  });
});

function toggleMyList(film) {
  let list = JSON.parse(localStorage.getItem("mylist")) || [];
  const index = list.findIndex(item => item.id === film.id);

  if (index !== -1) {
    list.splice(index, 1);
  } else {
    list.push(film);
  }
  localStorage.setItem("mylist", JSON.stringify(list));
}

function isInMyList(filmId) {
  const list = JSON.parse(localStorage.getItem("mylist")) || [];
  return list.some(film => film.id === filmId);
}

function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast-container";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `${message} <a href=\"mylist.html\">Lihat</a>`;
  toast.style.display = "flex";
  setTimeout(() => {
    toast.style.display = "none";
  }, 5000);
}

// ==================== FETCH DATA FILM DARI JSON ==================== //
fetch('Content/Content-detail.json')
  .then(response => response.json())
  .then(data => {
    const container = document.querySelector('.Film-container');
    if (!container) return;

    data.forEach(film => {
      const card = document.createElement('div');
      card.classList.add('card');

      const img = document.createElement('img');
      img.src = film.poster;
      img.alt = film.judul;

      card.appendChild(img);
      container.appendChild(card);
    });
  })
  .catch(error => {
    console.error("Gagal menampilkan film:", error);
  });
