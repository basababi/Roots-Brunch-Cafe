(() => {
  'use strict';

  const root = document.documentElement;
  const nav = document.querySelector('#main-nav');
  const navToggle = document.querySelector('.nav-toggle');
  const languageButtons = [...document.querySelectorAll('[data-language]')];
  const translations = [...document.querySelectorAll('[data-en]')].map(node => ({
    node, mn: node.textContent, en: node.dataset.en,
  }));
  const attributes = [
    ...[...document.querySelectorAll('[data-aria-en]')].map(node => ({
      node, name: 'aria-label', mn: node.getAttribute('aria-label'), en: node.dataset.ariaEn,
    })),
    ...[...document.querySelectorAll('[data-alt-en]')].map(node => ({
      node, name: 'alt', mn: node.alt, en: node.dataset.altEn,
    })),
  ];
  const gallery = [
    {
      file: 'table', position: '50% 27%',
      mn: ['Шакшука ба авокадотой тост', 'Шакшука, хөрөнгөний талх, авокадо, өндөгтэй тост'],
      en: ['Shakshuka & avocado toast', 'Shakshuka with sourdough beside avocado toast and poached eggs'],
    },
    {
      file: 'matcha-eclair', position: '50% 53%',
      mn: ['Матча латте ба эклер', 'Шоколадтай эклер, хээтэй сүүн хөөс бүхий матча латте'],
      en: ['Matcha latte & chocolate éclair', 'A chocolate éclair and a matcha latte with leaf-shaped foam art'],
    },
    {
      file: 'spread', position: '50% 48%',
      mn: ['Бранчны ширээ', 'Тоортой тост, шарсан тахиа, өндөгтэй боул, амттан өрсөн ширээ'],
      en: ['A brunch spread', 'Peach toast, chicken, a breakfast bowl and dessert arranged on a wooden table'],
    },
  ];
  const reviews = [
    { name: 'Shreya Shah', mn: 'Тоор, өрөмтэй тост надад хамгийн их таалагдсан.', en: 'The peach and clotted cream on toast was a winner for me.' },
    { name: 'Anna', mn: 'Хөгжим, уур амьсгал нь ч үнэхээр сайхан байсан болохоор бранчаа их тухтай өнгөрүүлсэн.', en: 'The music and overall atmosphere were also lovely and made for a great brunch experience.' },
    { name: 'chingoon', mn: 'Бидний захиалсан бүх хоол үнэхээр амттай байлаа.', en: 'All the food we ordered was absolutely delicious' },
  ];
  const photo = document.querySelector('#hero-photo');
  const photoIndex = document.querySelector('.photo-index');
  const plateName = document.querySelector('#plate-name');
  const quote = document.querySelector('#guest-quote');
  let currentPhoto = 0;
  let currentReview = 0;

  function showPhoto(step = 0) {
    currentPhoto = (currentPhoto + step + gallery.length) % gallery.length;
    const slide = gallery[currentPhoto];
    if (step !== 0) {
      if (slide.file === 'table') {
        photo.srcset = 'assets/images/table-640.webp 640w, assets/images/table.webp 1080w';
      } else {
        photo.removeAttribute('srcset');
      }
      photo.src = 'assets/images/' + slide.file + '.webp';
      photo.style.objectPosition = slide.position;
      photo.classList.remove('photo-enter');
      requestAnimationFrame(() => requestAnimationFrame(() => photo.classList.add('photo-enter')));
    }
    photo.alt = slide[root.lang][1];
    plateName.textContent = slide[root.lang][0];
    photoIndex.firstChild.nodeValue = String(currentPhoto + 1).padStart(2, '0') + ' ';
  }

  function showReview(step = 0) {
    currentReview = (currentReview + step + reviews.length) % reviews.length;
    const review = reviews[currentReview];
    quote.querySelector('blockquote').textContent = review[root.lang];
    quote.querySelector('cite').textContent = review.name;
    quote.querySelector('[data-review-source]').textContent = root.lang === 'mn' ? 'Google · Орчуулсан' : 'Google review';
  }

  function setNav(open) {
    nav.dataset.open = String(open);
    navToggle.setAttribute('aria-expanded', String(open));
    const label = root.lang === 'en' ? ['Open menu', 'Close menu'] : ['Цэс нээх', 'Цэс хаах'];
    navToggle.setAttribute('aria-label', label[Number(open)]);
    navToggle.querySelector('use').setAttribute('href', open ? '#close' : '#nav-menu');
  }

  function setLanguage(language) {
    root.lang = language;
    for (const entry of translations) entry.node.textContent = entry[language];
    for (const entry of attributes) entry.node.setAttribute(entry.name, entry[language]);
    for (const button of languageButtons) {
      button.setAttribute('aria-pressed', String(button.dataset.language === language));
    }
    setNav(false);
    showPhoto();
    showReview();
    window.dispatchEvent(new Event('roots:language'));
  }

  for (const button of languageButtons) {
    button.addEventListener('click', () => {
      const language = button.dataset.language;
      setLanguage(language);
      try { localStorage.setItem('roots-language', language); } catch { /* Storage is optional. */ }
    });
  }
  navToggle.addEventListener('click', () => {
    const open = nav.dataset.open !== 'true';
    setNav(open);
    if (open) nav.querySelector('a').focus();
  });
  document.addEventListener('click', event => {
    if (nav.dataset.open === 'true' && !navToggle.contains(event.target)) setNav(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.dataset.open === 'true') {
      setNav(false);
      navToggle.focus();
    }
  });
  document.querySelector('.site-header').addEventListener('focusout', event => {
    if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setNav(false);
  });
  matchMedia('(min-width: 761px)').addEventListener('change', () => setNav(false));
  document.querySelector('.prev-photo').addEventListener('click', () => showPhoto(-1));
  document.querySelector('.next-photo').addEventListener('click', () => showPhoto(1));
  document.querySelector('.prev-review').addEventListener('click', () => showReview(-1));
  document.querySelector('.next-review').addEventListener('click', () => showReview(1));
  navToggle.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setNav(true);
      nav.querySelector('a').focus();
    }
  });

  let initialLanguage = 'mn';
  try {
    if (localStorage.getItem('roots-language') === 'en') initialLanguage = 'en';
  } catch { /* Render the default language when storage is unavailable. */ }
  setLanguage(initialLanguage);
})();
