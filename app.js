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
var prevScrollpos = window.pageYOffset;
window.onscroll = function () {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar").style.top = "0";
    // document.getElementById("navbar").style.display = "block";
  } else {
    document.getElementById("navbar").style.top = "-50px";
    // document.getElementById("navbar").style.display = "none";
  }
  prevScrollpos = currentScrollPos;
};
