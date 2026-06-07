/* ============================================================
   script.js — PT. Megaland Infra Perkasa
   Fitur: Navbar scroll, Reveal animasi, Counter, Filter
          portfolio, Form submit, Back to top
   ============================================================ */

/* -------------------------------------------------------
   1. NAVBAR — Ubah tampilan saat di-scroll + mobile toggle
   ------------------------------------------------------- */
const navbar     = document.getElementById('navbar');
const navToggle  = document.getElementById('navToggle');
const navMenu    = document.getElementById('navMenu');
const navLinks   = document.querySelectorAll('.nav-link');

// Tambah class "scrolled" saat halaman di-scroll > 60px
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Tampilkan tombol Back to Top
  toggleBackToTop();
});

// Buat overlay untuk menutup menu mobile saat klik di luar
const navOverlay = document.createElement('div');
navOverlay.classList.add('nav-overlay');
document.body.appendChild(navOverlay);

// Toggle menu hamburger
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navMenu.classList.toggle('open');
  navOverlay.classList.toggle('active');
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});

// Tutup menu saat klik overlay
navOverlay.addEventListener('click', closeMenu);

// Tutup menu saat klik salah satu link
navLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});

function closeMenu() {
  navToggle.classList.remove('open');
  navMenu.classList.remove('open');
  navOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* -------------------------------------------------------
   2. ACTIVE LINK — Tandai link navbar sesuai section aktif
   ------------------------------------------------------- */
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionTop    = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId     = section.getAttribute('id');
    const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (correspondingLink) {
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(l => l.classList.remove('active'));
        correspondingLink.classList.add('active');
      }
    }
  });
}

window.addEventListener('scroll', updateActiveLink);

/* -------------------------------------------------------
   3. REVEAL ANIMASI — Elemen muncul saat masuk viewport
   ------------------------------------------------------- */
const revealElements = document.querySelectorAll('.reveal');

// IntersectionObserver: lebih efisien dari event scroll manual
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Berhenti mengamati setelah animasi berjalan
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,      // Trigger saat 12% elemen terlihat
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* -------------------------------------------------------
   4. COUNTER ANIMASI — Angka stat menghitung naik
   ------------------------------------------------------- */
const statNumbers = document.querySelectorAll('.stat-number[data-target]');

// Fungsi animasi counter
function animateCounter(el) {
  const target    = parseInt(el.getAttribute('data-target'), 10);
  const duration  = 1800;  // ms
  const step      = 16;    // interval ms (≈60fps)
  const increment = target / (duration / step);
  let current     = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current);
  }, step);
}

// Jalankan counter saat stats bar masuk viewport
const statsBar = document.querySelector('.stats-bar');
let counterStarted = false;

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !counterStarted) {
    counterStarted = true;
    statNumbers.forEach(el => animateCounter(el));
  }
}, { threshold: 0.3 });

if (statsBar) statsObserver.observe(statsBar);

/* -------------------------------------------------------
   5. PORTFOLIO FILTER — Filter kartu berdasarkan kategori
   ------------------------------------------------------- */
const filterBtns    = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update tombol aktif
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    portfolioCards.forEach(card => {
      const category = card.getAttribute('data-category');

      if (filter === 'all' || category === filter) {
        // Tampilkan kartu dengan animasi fade-in
        card.classList.remove('hidden');
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px)';
        requestAnimationFrame(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity    = '1';
          card.style.transform  = 'translateY(0)';
        });
      } else {
        // Sembunyikan kartu
        card.classList.add('hidden');
      }
    });
  });
});

/* -------------------------------------------------------
   6. FORM KONTAK — Validasi & tampilkan pesan sukses
   ------------------------------------------------------- */
const contactForm  = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();  // Cegah reload halaman

    // Ambil nilai form
    const nama  = document.getElementById('nama').value.trim();
    const email = document.getElementById('email').value.trim();

    // Validasi dasar
    if (!nama || !email) {
      alert('Mohon isi nama dan email Anda.');
      return;
    }

    // Simulasi pengiriman (tanpa backend)
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Mengirim...';
    submitBtn.disabled    = true;

    setTimeout(() => {
      // Reset form
      contactForm.reset();
      submitBtn.textContent = 'Kirim Pesan';
      submitBtn.disabled    = false;

      // Tampilkan pesan sukses
      formSuccess.style.display = 'block';

      // Sembunyikan pesan sukses setelah 5 detik
      setTimeout(() => {
        formSuccess.style.display = 'none';
      }, 5000);
    }, 1200);
  });
}

/* -------------------------------------------------------
   7. BACK TO TOP BUTTON
   ------------------------------------------------------- */
const backToTopBtn = document.getElementById('backToTop');

function toggleBackToTop() {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* -------------------------------------------------------
   8. IMAGE PLACEHOLDER — Sembunyikan placeholder jika
      gambar berhasil dimuat
   ------------------------------------------------------- */
document.querySelectorAll('.media-img, .portfolio-img img, .afiliasi-img img').forEach(img => {
  if (img.complete && img.naturalWidth > 0) {
    // Gambar sudah di-cache browser
    hidePlaceholder(img);
  } else {
    img.addEventListener('load',  () => hidePlaceholder(img));
    img.addEventListener('error', () => {
      // Jika gambar gagal load, placeholder tetap tampil
      img.style.display = 'none';
    });
  }
});

function hidePlaceholder(img) {
  const placeholder = img.parentElement.querySelector('.media-placeholder');
  if (placeholder) placeholder.style.display = 'none';
}

/* -------------------------------------------------------
   9. SMOOTH SCROLL — Untuk semua link anchor internal
   ------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;  // Tinggi navbar
      const top    = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* -------------------------------------------------------
   10. INIT — Jalankan fungsi awal saat halaman siap
   ------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  updateActiveLink();
  toggleBackToTop();
  console.log('✅ PT. Megaland Infra Perkasa — Website siap.');
});
