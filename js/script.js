// console.clear();

gsap.registerPlugin(Draggable, InertiaPlugin);
gsap.config({ trialWarn: false });

//=========================
// Check webPsupport
//=========================
var webPsupport = function () {
  var webP = new Image();
  webP.onload = WebP.onerror = function () {
    callback(webP.height == 2);
  };
  webP.src =
    'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
};

console.log(webPsupport ? 'WEBP supported' : 'WEBP not supported');

//=========================
// Get data
//=========================
let data;

(async () => {
  const res = await fetch('./data/autos.json');
  data = await res.json();
  console.log('количество машин:', data.length);

  displayMenuItems(data);
  displayMenuButtons(data);
})();

//=========================

const carousel = document.querySelector('.carousel-items'),
  container = document.querySelector('.btn-container');

function displayMenuItems(menuItems) {
  let displayMenu = menuItems.map(function (item) {
    return `
    <div class="carousel-item">
          <div class="model">
            <div>${item.model}</div>
            <div class="ident">ID: ${item.id}</div>
          </div>
          <img loading="lazy" src="${
            item.image
          }" onerror="this.onerror=null;this.src='./img/no-image.jpg';" alt="car" />
          <div class="price-wrapper">
            <div class="price">${new Intl.NumberFormat('ru-RU', {
              style: 'currency',
              currency: 'RUB',
              maximumSignificantDigits: 1,
            }).format(item.price)}</div>
          </div>
          <button class="open-desc">Подробнее</button>
          <div class="desc">
            <h4>Технические характеристики:</h4>
            <table>
              <tbody>
                <tr>
                  <td>Двигатель</td>
                  <td>${item.engine}</td>
                </tr>
                <tr>
                  <td>КПП</td>
                  <td>${item.transmission}</td>
                </tr>
                <tr>
                  <td>Задний мост</td>
                  <td>${item.drive}</td>
                </tr>
                <tr>
                  <td>Передняя ось</td>
                  <td>${item.wheels}</td>
                </tr>
                <tr>
                  <td>Шины и управление</td>
                  <td>${item.tires}</td>
                </tr>
                <tr>
                  <td>Размер</td>
                  <td>${item.size}</td>
                </tr>
                <tr>
                  <td>Передаточные числа</td>
                  <td>${item.transmissionRatios}</td>
                </tr>
                <tr>
                  <td>Топливный бак</td>
                  <td>${item.fuelTank}</td>
                </tr>
                <tr>
                  <td>Дополнительные параметры</td>
                  <td>
                    ${item.desc}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>`;
  });

  displayMenu = displayMenu.join('');
  carousel.innerHTML = displayMenu;
  // carousel
  const wrapper = document.querySelector('.carousel-container'),
    boxes = document.querySelectorAll('.carousel-item'),
    gap = 16,
    boxWidth = boxes[0].offsetWidth,
    boxHeight = boxes[0].offsetHeight;

  // console.log(boxWidth, boxHeight);

  let wrapWidth = boxes.length * (boxWidth + gap);
  // gsap.set(wrapper, { height: boxHeight, width: wrapWidth });
  gsap.set(wrapper, { height: boxHeight });

  for (let i = 0; i < boxes.length; i++) {
    let box = boxes[i];
    gsap.set(box, { x: (i + 1) * (boxWidth + gap), left: -(boxWidth - gap) }); // (i + 1) - чтобы первый элемент был первым
    // box.addEventListener('click', () => window.location = box.href);
  }

  let wrapProgress = gsap.utils.wrap(0, 1);
  let proxy = document.createElement('div');
  let props = gsap.getProperty(proxy);

  let animation = gsap
    .to('.carousel-item', {
      duration: 1,
      x: '+=' + wrapWidth,
      ease: Linear.easeNone,
      paused: true,
      repeat: -1,
      modifiers: {
        x: function (x) {
          x = parseFloat(x) % wrapWidth;
          return x + 'px';
        },
      },
    })
    .progress(-1 / boxes.length); // -1 чтобы первый элемент был первым

  Draggable.create(proxy, {
    type: 'x',
    trigger: wrapper,
    throwProps: true,
    allowContextMenu: false,
    onDrag: updateProgress,
    onThrowUpdate: updateProgress,
    // zIndexBoost: true,
    zIndexBoost: false,
    inertia: true,
  });

  function updateProgress() {
    animation.progress(wrapProgress(props('x') / wrapWidth));
  }

  document.querySelectorAll('.open-desc').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.nextElementSibling.classList.toggle('show');
      btn.nextElementSibling.classList.contains('show') ? (btn.innerText = 'Скрыть') : (btn.innerText = 'Подробнее');
    });
  });
}

function displayMenuButtons(data) {
  const categories = data.reduce(
    function (values, item) {
      if (!values.includes(item.category)) {
        values.push(item.category);
      }
      return values;
    },
    ['все']
  );
  const categoryBtns = categories
    .map(function (category) {
      return `<button class="filter-btn" type="button" data-id=${category}>${category}</button>`;
    })
    .join('');

  container.innerHTML = categoryBtns;

  const filterBtns = container.querySelectorAll('.filter-btn');
  filterBtns[0].click();
  filterBtns[0].classList.add('active');
  // filter items
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      const category = e.currentTarget.dataset.id;
      const menuCategory = data.filter(function (menuItem) {
        // console.log(menuItem.category);
        if (menuItem.category === category) {
          return menuItem;
        }
      });
      filterBtns.forEach((el) => {
        el.classList.remove('active');
      });
      btn.classList.add('active');
      category === 'все' ? displayMenuItems(data) : displayMenuItems(menuCategory);
    });
  });
}
// slider
document.querySelectorAll('.blaze-slider').forEach((el) => {
  new BlazeSlider(el, {
    all: {
      enableAutoplay: true,
      autoplayInterval: 2000,
      autoplayDirection: 'to left',
      stopAutoplayOnInteraction: true,
      transitionTimingFunction: 'ease',
      transitionDuration: 400,
      slidesToShow: 3,
      slidesToScroll: 1,
      slideGap: '16px',
      loop: true,
    },
    '(max-width: 960px)': {
      slidesToShow: 2,
      // slidesToScroll: 2,
    },
    '(max-width: 768px)': {
      slidesToShow: 1,
    },
  });
});
