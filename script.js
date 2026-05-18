// 고정 F-16 전투기 클릭 상승 & 자동 하강
let clickCount = 0;
let currentHeight = 0;
let lastClickTime = Date.now();
const DESCENT_DELAY = 1500;
const DESCENT_SPEED = 0.4;

function climbPlane(e) {
  if (e.target.closest('.modal-overlay.active, .navbar, .btn, .biz-card, button, a[href]')) return;
  if (!document.getElementById('mainPlane')) return;

  clickCount++;
  currentHeight = Math.min(clickCount * 70, window.innerHeight * 0.52);
  lastClickTime = Date.now();

  const mainPlane = document.getElementById('mainPlane');

  // 불 애니메이션 추가 (0.5초 후 제거)
  mainPlane.classList.add('firing');
  setTimeout(() => mainPlane.classList.remove('firing'), 500);

  // climbing 클래스 토글
  mainPlane.classList.remove('climbing');
  mainPlane.offsetHeight;
  mainPlane.classList.add('climbing');

  updateCounter();
}

function updatePlanePosition() {
  const mainPlane = document.getElementById('mainPlane');
  if (!mainPlane) return;

  const timeSinceClick = Date.now() - lastClickTime;
  if (timeSinceClick > DESCENT_DELAY) {
    currentHeight = Math.max(0, currentHeight - DESCENT_SPEED);
  }

  const rotation = -15 + (currentHeight * 0.15);
  mainPlane.style.bottom = `calc(33vh + ${currentHeight}px)`;
  mainPlane.style.transform = `rotate(${rotation}deg)`;
}

function animatePlane() {
  updatePlanePosition();
  requestAnimationFrame(animatePlane);
}

function updateCounter() {
  const counter = document.getElementById('planeCounter');
  if (!counter) return;
  const numEl = counter.querySelector('.plane-counter-num');
  numEl.textContent = clickCount;
  counter.classList.remove('pulse');
  counter.offsetHeight;
  counter.classList.add('pulse');
}

document.addEventListener('click', climbPlane);

// 스크롤 시 네비게이션 강조
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 50
    ? '0 4px 30px rgba(0,0,0,0.5)'
    : 'none';
});

// 스크롤 시 요소 페이드인
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.skill-card, .about-card, .contact-card, .project-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);

  // 카운터 UI 생성
  const counter = document.createElement('div');
  counter.className = 'plane-counter';
  counter.id = 'planeCounter';
  counter.innerHTML = '<span class="plane-counter-icon">✈</span><span class="plane-counter-num">0</span>';
  document.body.appendChild(counter);

  // 비행기 애니메이션 시작
  animatePlane();

  // 명함 모달
  const overlay  = document.getElementById('modalOverlay');
  const cardBtn  = document.getElementById('cardBtn');
  const closeBtn = document.getElementById('modalClose');
  const bizCard  = document.querySelector('.biz-card');

  function openModal() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => bizCard.classList.remove('flipped'), 350);
  }

  cardBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  bizCard.addEventListener('click', () => {
    bizCard.classList.toggle('flipped');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});
