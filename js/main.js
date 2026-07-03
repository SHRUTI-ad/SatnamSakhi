function mediaSrc(item, field) {
  const key = field || "image";
  return item.localImage || item[key] || item.thumbnail || item.fallback || "";
}

function mediaFallback(item, field) {
  const key = field || "image";
  return item.fallback || item[key] || item.thumbnail || "";
}

function mediaImg(item, field, alt, className) {
  const src = mediaSrc(item, field);
  const fb = mediaFallback(item, field);
  const cls = className ? ` class="${className}"` : "";
  return `<img src="${src}" data-fallback="${fb}" alt="${alt}" loading="lazy"${cls} onerror="if(this.dataset.fallback&&this.src!==this.dataset.fallback){this.src=this.dataset.fallback}" />`;
}

function createEventCard(event) {
  return `
    <article class="event-card">
      <div class="event-card-image">
        ${mediaImg(event, "image", event.title)}
        <span class="event-badge category">${event.category}</span>
      </div>
      <div class="event-card-body">
        <p class="date">${event.displayDate}</p>
        <h3>${event.title}</h3>
        <p>${event.description}</p>
        <div class="event-meta">
          <span>${event.location}</span>
          <span>${event.attendees} guests</span>
        </div>
      </div>
    </article>
  `;
}

function createReelCard(reel) {
  const videoAttr = reel.videoFile
    ? `data-video="${reel.videoFile}" data-title="${reel.title}"`
    : `href="${reel.link}" target="_blank" rel="noopener"`;
  const tag = reel.videoFile ? "button" : "a";
  const typeAttr = reel.videoFile ? ' type="button"' : "";

  return `
    <${tag} class="reel-card" ${videoAttr}${typeAttr}>
      <div class="reel-thumb">
        ${mediaImg(reel, "thumbnail", reel.title)}
        <span class="reel-play" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </span>
        <span class="reel-views">${reel.views}</span>
      </div>
      <div class="reel-info">
        <h3>${reel.title}</h3>
        <p>${reel.event}</p>
      </div>
    </${tag}>
  `;
}

function createVideoCard(video) {
  const featured = video.featured ? " video-card-featured" : "";
  const videoAttr = video.videoFile
    ? `data-video="${video.videoFile}" data-title="${video.title}"`
    : `href="${video.link}" target="_blank" rel="noopener"`;
  const tag = video.videoFile ? "button" : "a";
  const typeAttr = video.videoFile ? ' type="button"' : "";

  return `
    <${tag} class="video-card${featured}" ${videoAttr}${typeAttr}>
      <div class="video-thumb">
        ${mediaImg(video, "thumbnail", video.title)}
        <span class="video-play" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </span>
        <span class="video-duration">${video.duration}</span>
        ${video.featured ? '<span class="video-featured-badge">Featured</span>' : ""}
      </div>
      <div class="video-info">
        <span class="work-tag work-tag-video">Video</span>
        <h3>${video.title}</h3>
        <p>${video.client} · ${video.views} views</p>
      </div>
    </${tag}>
  `;
}

function createPhotoCard(photo) {
  const sizeClass = photo.size ? ` photo-${photo.size}` : "";
  const src = mediaSrc(photo);
  const fb = mediaFallback(photo);

  return `
    <article class="photo-card${sizeClass}" data-lightbox="${src}" data-fallback="${fb}" data-title="${photo.title}" data-caption="${photo.client} · ${photo.event}">
      <div class="photo-thumb">
        ${mediaImg(photo, "image", photo.title)}
        <div class="photo-hover">
          <span class="photo-zoom">+</span>
        </div>
      </div>
      <div class="photo-info">
        <span class="work-tag work-tag-photo">Photo</span>
        <h3>${photo.title}</h3>
        <p>${photo.client} · ${photo.event}</p>
      </div>
    </article>
  `;
}

function createInstagramPost(post) {
  return `
    <a href="${post.link}" class="instagram-post" target="_blank" rel="noopener">
      ${mediaImg(post, "image", "Instagram post")}
      <span class="instagram-views">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
        ${post.views}
      </span>
    </a>
  `;
}

function renderInstagramSection() {
  const statsEl = document.getElementById("instagram-stats");
  const gridEl = document.getElementById("instagram-grid");
  const followBtn = document.getElementById("instagram-follow");
  const footerIg = document.getElementById("footer-instagram");

  if (!statsEl || !gridEl || typeof INSTAGRAM === "undefined") return;

  statsEl.innerHTML = `
    <div class="ig-stat ig-stat-purple"><strong>${INSTAGRAM.followers}</strong><span>Followers</span></div>
    <div class="ig-stat ig-stat-pink"><strong>${INSTAGRAM.totalViews}</strong><span>Total Views</span></div>
    <div class="ig-stat ig-stat-orange"><strong>${INSTAGRAM.reelsCount}</strong><span>Reels Posted</span></div>
    <div class="ig-stat ig-stat-cyan"><strong>${INSTAGRAM.engagement}</strong><span>Engagement</span></div>
  `;

  gridEl.innerHTML = INSTAGRAM.posts.map(createInstagramPost).join("");

  if (followBtn) {
    followBtn.href = INSTAGRAM.url;
    followBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg> @${INSTAGRAM.handle}`;
  }
  if (footerIg) footerIg.href = INSTAGRAM.url;
}

function renderReelsMarquee(containerId) {
  const el = document.getElementById(containerId);
  if (!el || typeof REELS === "undefined") return;

  const cards = REELS.map(createReelCard).join("");
  el.innerHTML = `
    <div class="marquee-track">
      <div class="marquee-group">${cards}</div>
      <div class="marquee-group" aria-hidden="true">${cards}</div>
    </div>
  `;
}

function renderVideos(containerId) {
  const el = document.getElementById(containerId);
  if (!el || typeof VIDEOS === "undefined") return;
  el.innerHTML = VIDEOS.map(createVideoCard).join("");
}

function renderPhotos(containerId) {
  const el = document.getElementById(containerId);
  if (!el || typeof PHOTOS === "undefined") return;
  el.innerHTML = PHOTOS.map(createPhotoCard).join("");
}

function renderHeroCollage(containerId, items) {
  const el = document.getElementById(containerId);
  const list = items || (typeof HERO_COLLAGE !== "undefined" ? HERO_COLLAGE : []);
  if (!el || !list.length) return;

  el.innerHTML = list.map((item, i) => `
    <div class="collage-item collage-item-${i + 1}">
      ${mediaImg(item, "localImage", item.alt || "Event highlight")}
    </div>
  `).join("");
}

function renderHomeGallery(containerId) {
  const el = document.getElementById(containerId);
  if (!el || typeof HOME_GALLERY === "undefined") return;

  el.innerHTML = HOME_GALLERY.map((item) => `
    <figure class="home-gallery-item reveal">
      <div class="home-gallery-img">
        ${mediaImg(item, "localImage", item.label)}
        <span class="home-gallery-label">${item.label}</span>
      </div>
    </figure>
  `).join("");
}

function createWorkCard(item) {
  return `
    <article class="work-card" data-category="${item.category}">
      ${mediaImg(item, "image", item.title)}
      <div class="work-card-overlay">
        <span class="work-tag">${item.tag}</span>
        <h3>${item.title}</h3>
        <p>${item.client}</p>
      </div>
    </article>
  `;
}

function renderFeaturedEvents(containerId, limit) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = EVENTS.slice(0, limit).map(createEventCard).join("");
}

function renderAllEvents(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = EVENTS.map(createEventCard).join("");
}

function renderFeaturedWork(containerId, limit) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = WORK.slice(0, limit).map(createWorkCard).join("");
}

function initLightbox() {
  const modal = document.getElementById("media-modal");
  if (!modal) return;

  const videoEl = modal.querySelector("video");
  const imgEl = modal.querySelector(".modal-image");
  const titleEl = modal.querySelector(".modal-title");
  const closeBtn = modal.querySelector(".modal-close");
  const backdrop = modal.querySelector(".modal-backdrop");

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    if (videoEl) {
      videoEl.pause();
      videoEl.removeAttribute("src");
      videoEl.load();
    }
  }

  function openVideo(src, title) {
    imgEl.style.display = "none";
    videoEl.style.display = "block";
    videoEl.src = src;
    titleEl.textContent = title || "";
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    videoEl.play().catch(() => {});
  }

  function openImage(src, title, caption) {
    videoEl.style.display = "none";
    imgEl.style.display = "block";
    imgEl.src = src;
    imgEl.onerror = function () {
      const fb = imgEl.dataset.fallback;
      if (fb && imgEl.src !== fb) imgEl.src = fb;
    };
    titleEl.textContent = title ? `${title}${caption ? " — " + caption : ""}` : "";
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  document.addEventListener("click", (e) => {
    const videoTrigger = e.target.closest("[data-video]");
    if (videoTrigger) {
      e.preventDefault();
      openVideo(videoTrigger.dataset.video, videoTrigger.dataset.title);
      return;
    }

    const photoCard = e.target.closest(".photo-card[data-lightbox]");
    if (photoCard) {
      imgEl.dataset.fallback = photoCard.dataset.fallback || "";
      openImage(photoCard.dataset.lightbox, photoCard.dataset.title, photoCard.dataset.caption);
    }
  });

  closeBtn?.addEventListener("click", closeModal);
  backdrop?.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });
}

function initStaggerReveal() {
  document.querySelectorAll(".reveal-stagger").forEach((group) => {
    group.querySelectorAll(".reveal").forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.08}s`;
    });
  });
}

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => links.classList.remove("open"));
  });
}

function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  const success = document.getElementById("form-success");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.reset();
    if (success) success.classList.add("show");
    setTimeout(() => success?.classList.remove("show"), 5000);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initReveal();
  initStaggerReveal();
  initHeaderScroll();
  initLightbox();
  initContactForm();
});
