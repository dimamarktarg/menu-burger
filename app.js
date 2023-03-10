"use strict";

// Код помогает определить на каком устройстве открыта страница
const isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    return (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows()
    );
  },
};

// Проверяем ПК или моб.
if (isMobile.any()) {
  // Добавляем класс для моб.
  document.body.classList.add("_touch");
  // Выбираем все меню с подменю
  let menuArrows = document.querySelectorAll(".menu__arrow");
  // Проверка наличия пунктов с подменю
  if (menuArrows.length > 0) {
    // Перебераем нодлист с подменю
    menuArrows.forEach((menuArrow) => {
      // Реагируем на клик
      menuArrow.addEventListener("click", function (e) {
        // Добавляем класс активному подменю
        menuArrow.parentElement.classList.toggle("_active");
      });
    });
  }
} else {
  // Добавляем класс для ПК
  document.body.classList.add("_pc");
}

// Меню бургер
const iconMenu = document.querySelector(".menu__icon");
const menuBody = document.querySelector(".menu__body");
if (iconMenu) {
  iconMenu.addEventListener("click", function (e) {
    document.body.classList.toggle("_lock"); // Блокируем прокрутку страницы при открытом меню
    iconMenu.classList.toggle("_active");
    menuBody.classList.toggle("_active");
  });
}

// Прокрутка при клике
// Выбираем все пункты меню с атрибутом data-goto
const menuLinks = document.querySelectorAll(".menu__link[data-goto]");
// Проверяем есть ли такие пункты меню
if (menuLinks.length > 0) {
  // Реагируем на клик
  menuLinks.forEach((menuLink) => {
    menuLink.addEventListener("click", onMenuLinkClick);
  });

  // Функция для перехода к нужной секции
  function onMenuLinkClick(e) {
    const menuLink = e.target; // ел. на который кликнули
    // Проверяем заполнин ли дата атрибут && существует ли объект на который ссылается дата атрибут
    if (
      menuLink.dataset.goto &&
      document.querySelector(menuLink.dataset.goto)
    ) {
      const gotoBlock = document.querySelector(menuLink.dataset.goto); // Выбираем кликнутый объект к которому нужно перейти

      gotoBlock.scrollIntoView({ behavior: "smooth" });
      /* // Новый способ прокрутки к нужному элементу
      // Отнимаем от прокрутки высоту шапки (в стилях)
      // .page section {
      //   scroll-margin: 70px;
      // } */

      // Высчитываем куда переместиться (Расстояние от верха стр. + Прокрученное расстояние - Высота шапки) - Старый способ
      // const gotoBlockValue =
      //   gotoBlock.getBoundingClientRect().top +
      //   window.pageYOffset -
      //   - document.querySelector("header").offsetHeight;

      // Убираем меню при переходе
      if (iconMenu.classList.contains("_active")) {
        document.body.classList.remove("_lock");
        iconMenu.classList.remove("_active");
        menuBody.classList.remove("_active");
      }
      //
      // window.scrollTo({
      //   top: gotoBlockValue,
      //   behavior: "smooth",
      // });
      e.preventDefault();
    }
  }
}

/* Когда пользователь прокручивает вниз, скрыть навигационную панель. Когда пользователь прокручивает вверх, показать навигационную панель */
let prevScrollpos = window.pageYOffset;
window.onscroll = function () {
  const currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar").style.top = "0";
    // document.getElementById("navbar").style.display = "block";
  } else {
    document.getElementById("navbar").style.top = "-50px";
    // document.getElementById("navbar").style.display = "none";
  }
  prevScrollpos = currentScrollPos;
};

/* --------------------------------------------------------- */

// Анимация счётчика
window.addEventListener("load", windowLoad);

function windowLoad() {
  // Функция инициализации
  function digitsCountersInit(digitsCountersItems) {
    let digitsCounters = digitsCountersItems
      ? digitsCountersItems
      : document.querySelectorAll("[data-digits-counter]");
    if (digitsCounters) {
      digitsCounters.forEach((digitsCounter) => {
        digitsCountersAnimate(digitsCounter);
      });
    }
  }
  // Функция Анимации
  function digitsCountersAnimate(digitsCounter) {
    let startTimestamp = null;
    const duration = parseInt(digitsCounter.dataset.digitsCounter)
      ? parseInt(digitsCounter.dataset.digitsCounter)
      : 1000;
    const startValue = parseInt(digitsCounter.innerHTML);
    const startPosition = 0;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      digitsCounter.innerHTML = Math.floor(
        progress * (startPosition + startValue)
      );
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
  // Пуск при загрузке страницы
  // digitsCountersInit();
  // Пуск при скроле (появление блока с счётчиком)
  let options = {
    threshold: 0.3,
  };
  let observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const targetElement = entry.target;
        const digitsCountersItems = targetElement.querySelectorAll(
          "[data-digits-counter]"
        );
        if (digitsCountersItems.length) {
          digitsCountersInit(digitsCountersItems);
        }
        // Выключить отслеживание после срабатывания
        observer.unobserve(targetElement);
      }
    });
  }, options);

  let sections = document.querySelectorAll(".page__row");
  if (sections.length) {
    sections.forEach((section) => {
      observer.observe(section);
    });
  }
}
