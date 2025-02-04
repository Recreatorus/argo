gsap.registerPlugin(Draggable, InertiaPlugin), gsap.config({ trialWarn: !1 });
var webPsupport = function () {
  var t = new Image();
  (t.onload = WebP.onerror =
    function () {
      callback(2 == t.height);
    }),
    (t.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA');
};
console.log(webPsupport ? 'WEBP supported' : 'WEBP not supported');
let data;
(async () => {
  let t = await fetch('./data/autos.json');
  (data = await t.json()),
    console.log('количество машин:', data.length),
    displayMenuItems(data),
    displayMenuButtons(data);
})();
const carousel = document.querySelector('.carousel-items'),
  container = document.querySelector('.btn-container');
function displayMenuItems(t) {
  let e = t.map(function (t) {
    return `
    <div class="carousel-item">
          <div class="model">
            <div>${t.model}</div>
            <div class="ident">ID: ${t.id}</div>
          </div>
          <img loading="lazy" src="${t.image}" onerror="this.onerror=null;this.src='./img/no-image.jpg';" alt="car" />
          <div class="price-wrapper">
            <div class="price">${new Intl.NumberFormat('ru-RU', {
              style: 'currency',
              currency: 'RUB',
              maximumSignificantDigits: 1,
            }).format(t.price)}</div>
          </div>
          <button class="open-desc">Подробнее</button>
          <div class="desc">
            <h4>Технические характеристики:</h4>
            <table>
              <tbody>
                <tr>
                  <td>Двигатель</td>
                  <td>${t.engine}</td>
                </tr>
                <tr>
                  <td>КПП</td>
                  <td>${t.transmission}</td>
                </tr>
                <tr>
                  <td>Задний мост</td>
                  <td>${t.drive}</td>
                </tr>
                <tr>
                  <td>Передняя ось</td>
                  <td>${t.wheels}</td>
                </tr>
                <tr>
                  <td>Шины и управление</td>
                  <td>${t.tires}</td>
                </tr>
                <tr>
                  <td>Размер</td>
                  <td>${t.size}</td>
                </tr>
                <tr>
                  <td>Передаточные числа</td>
                  <td>${t.transmissionRatios}</td>
                </tr>
                <tr>
                  <td>Топливный бак</td>
                  <td>${t.fuelTank}</td>
                </tr>
                <tr>
                  <td>Дополнительные параметры</td>
                  <td>
                    ${t.desc}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>`;
  });
  (e = e.join('')), (carousel.innerHTML = e);
  let r = document.querySelector('.carousel-container'),
    n = document.querySelectorAll('.carousel-item'),
    i = n[0].offsetWidth,
    a = n[0].offsetHeight,
    s = n.length * (i + 16);
  gsap.set(r, { height: a });
  for (let o = 0; o < n.length; o++) {
    let d = n[o];
    gsap.set(d, { x: (o + 1) * (i + 16), left: -(i - 16) });
  }
  let l = gsap.utils.wrap(0, 1),
    c = document.createElement('div'),
    u = gsap.getProperty(c),
    g = gsap
      .to('.carousel-item', {
        duration: 1,
        x: '+=' + s,
        ease: Linear.easeNone,
        paused: !0,
        repeat: -1,
        modifiers: {
          x: function (t) {
            return (t = parseFloat(t) % s) + 'px';
          },
        },
      })
      .progress(-1 / n.length);
  function p() {
    g.progress(l(u('x') / s));
  }
  Draggable.create(c, {
    type: 'x',
    trigger: r,
    throwProps: !0,
    allowContextMenu: !1,
    onDrag: p,
    onThrowUpdate: p,
    zIndexBoost: !1,
    inertia: !0,
  }),
    document.querySelectorAll('.open-desc').forEach((t) => {
      t.addEventListener('click', () => {
        t.nextElementSibling.classList.toggle('show'),
          t.nextElementSibling.classList.contains('show') ? (t.innerText = 'Скрыть') : (t.innerText = 'Подробнее');
      });
    });
}
function displayMenuButtons(t) {
  let e = t.reduce(
      function (t, e) {
        return t.includes(e.category) || t.push(e.category), t;
      },
      ['все']
    ),
    r = e
      .map(function (t) {
        return `<button class="filter-btn" type="button" data-id=${t}>${t}</button>`;
      })
      .join('');
  container.innerHTML = r;
  let n = container.querySelectorAll('.filter-btn');
  n[0].click(),
    n[0].classList.add('active'),
    n.forEach(function (e) {
      e.addEventListener('click', function (r) {
        let i = r.currentTarget.dataset.id,
          a = t.filter(function (t) {
            if (t.category === i) return t;
          });
        n.forEach((t) => {
          t.classList.remove('active');
        }),
          e.classList.add('active'),
          'все' === i ? displayMenuItems(t) : displayMenuItems(a);
      });
    });
}
