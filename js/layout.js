// ── Inject shared navbar & footer ──

const navHTML = `
<nav class="navbar navbar-expand-lg">
  <div class="container">
    <a class="navbar-brand" href="index.html">
      <div class="brand-icon">📱</div>
      <span class="brand-text">JK Mobiles</span>
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-controls="navMain" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navMain">
      <ul class="navbar-nav ms-auto gap-1">
        <li class="nav-item"><a class="nav-link" href="index.html"><span class="nav-icon">🏠</span><span class="nav-text">Home</span></a></li>
        <li class="nav-item"><a class="nav-link" href="courses.html"><span class="nav-icon">📚</span><span class="nav-text">Courses</span></a></li>
        <li class="nav-item"><a class="nav-link" href="booking.html"><span class="nav-icon">📝</span><span class="nav-text">Book Now</span></a></li>
        <li class="nav-item"><a class="nav-link" href="certificate.html"><span class="nav-icon">🎓</span><span class="nav-text">Certificate</span></a></li>
        <li class="nav-item"><a class="nav-link" href="verify.html"><span class="nav-icon">🔍</span><span class="nav-text">Verify</span></a></li>
        <li class="nav-item"><a class="nav-link" href="contact.html"><span class="nav-icon">📞</span><span class="nav-text">Contact</span></a></li>
      </ul>
    </div>
  </div>
</nav>`;

const footerHTML = `
<footer>
  <div class="container">
    <div class="row g-4">
      <div class="col-md-4">
        <div class="footer-brand mb-2">📱 JK Mobiles</div>
        <p style="font-size:0.9rem; opacity:0.8;">Become a Professional Mobile Technician in 10 Days. Quality training, real skills.</p>
      </div>
      <div class="col-md-4">
        <h6 style="color:var(--orange); font-family:'Rajdhani',sans-serif; letter-spacing:0.08em;">QUICK LINKS</h6>
        <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:6px; font-size:0.9rem;">
          <li><a href="courses.html">📚 Our Courses</a></li>
          <li><a href="booking.html">📝 Enroll Now</a></li>
          <li><a href="certificate.html">🎓 Certificate</a></li>
          <li><a href="contact.html">📞 Contact Us</a></li>
          <li><a href="admin/login.html">🔐 Admin</a></li>
        </ul>
      </div>
      <div class="col-md-4">
        <h6 style="color:var(--orange); font-family:'Rajdhani',sans-serif; letter-spacing:0.08em;">CONTACT</h6>
        <p style="font-size:0.9rem; opacity:0.8; margin:0; line-height:2;">
          📞 <a href="tel:7639730715">7639730715</a><br>
          📞 <a href="tel:6385595019">6385595019</a><br>
          💬 <a href="https://wa.me/917639730715" target="_blank">WhatsApp Us</a>
        </p>
      </div>
    </div>
    <hr class="footer-divider">
    <div class="text-center" style="font-size:0.85rem; opacity:0.65;">
      © 2024 JK Mobiles Training Institute. All rights reserved.
    </div>
  </div>
</footer>

<a href="https://wa.me/917639730715" class="whatsapp-float" target="_blank" title="Chat on WhatsApp">
  💬
</a>`;

document.addEventListener('DOMContentLoaded', () => {
  const navEl = document.getElementById('nav-placeholder');
  const footerEl = document.getElementById('footer-placeholder');
  if (navEl) navEl.innerHTML = navHTML;
  if (footerEl) footerEl.innerHTML = footerHTML;
});
