// نسخه بازنویسی شده‌ی script.js با حفظ ظاهر و خروجی مشابه کد اولیه

const root = document.getElementById("root");
const filtersContainer = document.getElementById("filter");
const cartUL = document.querySelector(".cart-items");

const BOOKS = [
  { id: 1, title: "خواجه تاجدار", author: "ژان گور", published_date: 2007, language: "persian", genre: "تاریخ", imgSrc: "1.jpg" },
  { id: 2, title: "ضیافت", author: "افلاطون", published_date: 385, language: "greek", genre: "فلسفه", imgSrc: "2.jpg" },
  { id: 3, title: "منطق الطیر", author: "عطار", published_date: 1177, language: "persian", genre: "شعر", imgSrc: "3.jpg" },
  { id: 4, title: "مثنوی معنوی", author: "مولوی", published_date: 1258, language: "persian", genre: "شعر", imgSrc: "4.jpg" },
  { id: 5, title: "دیوان حافظ", author: "حافظ", published_date: 1200, language: "persian", genre: "شعر", imgSrc: "5.jpg" },
  { id: 6, title: "رومیو و جولیت", author: "ویلیام شکسپیر", published_date: 1595, language: "english", genre: "عاشقانه", imgSrc: "6.jpg" },
  { id: 7, title: "ویس و رامین", author: "فخرالدین اسعد گرگانی", published_date: 1054, language: "persian", genre: "عاشقانه", imgSrc: "7.jpg" },
  { id: 8, title: "گلستان", author: "سعدی", published_date: 1258, language: "persian", genre: "شعر", imgSrc: "8.jpg" },
  { id: 9, title: "بوستان", author: "سعدی", published_date: 1257, language: "persian", genre: "شعر", imgSrc: "9.jpg" },
  { id: 10, title: "گلشن راز", author: "شیخ محمود شبستری", published_date: 1311, language: "persian", genre: "شعر", imgSrc: "10.jpg" },
  { id: 11, title: "لیلی و مجنون", author: "نظامی", published_date: 1188, language: "persian", genre: "عاشقانه", imgSrc: "11.jpg" },
  { id: 12, title: "شاهنامه", author: "فردوسی", published_date: 1010, language: "persian", genre: "شعر", imgSrc: "12.jpg" },
  { id: 13, title: "ایلیاد", author: "هومر", published_date: 762, language: "greek", genre: "شعر", imgSrc: "13.jpg" },
  { id: 14, title: "اودیسه", author: "هومر", published_date: 725, language: "greek", genre: "شعر", imgSrc: "14.jpg" },
  { id: 15, title: "هملت", author: "ویلیام شکسپیر", published_date: 1609, language: "greek", genre: "درام", imgSrc: "15.jpg" },
  { id: 16, title: "دن کیشوت", author: "میگل دسروانتس", published_date: 1605, language: "spanish", genre: "درام", imgSrc: "16.jpg" }
];

let selectedAuthors = [];
let selectedLanguages = [];
let selectedGenres = [];

let CART = JSON.parse(localStorage.getItem("cart")) || [];

function renderBooks(list) {
  root.innerHTML = list.map(book => `
    <div class="book-card">
      <img class="book-image" src="./image/${book.imgSrc}" alt="${book.title}">
      <div class="book-info">
        <h3 class="book-title">${book.title}</h3>
        <div class="book-details">
          <p class="book-meta"><strong>نویسنده:</strong> ${book.author}</p>
          <p class="book-meta"><strong>ژانر:</strong> ${book.genre}</p>
          <p class="book-meta"><strong>زبان:</strong> ${book.language}</p>
        </div>
        <div class="book-actions">
          ${CART.includes(book.id) ? 
            `<button onclick="removeFromCart(${book.id})">حذف از سبد</button>` :
            `<button onclick="addToCart(${book.id})">افزودن به سبد</button>`
          }
        </div>
      </div>
    </div>
  `).join("");
}

function addToCart(id) {
  if (!CART.includes(id)) {
    CART.push(id);
    localStorage.setItem("cart", JSON.stringify(CART));
    applyFilters();
    updateCart();
  }
}

function removeFromCart(id) {
  const idx = CART.indexOf(id);
  if (idx !== -1) {
    CART.splice(idx, 1);
    localStorage.setItem("cart", JSON.stringify(CART));
    applyFilters();
    updateCart();
  }
}

function updateCart() {
  const selectedBooks = BOOKS.filter(b => CART.includes(b.id));
  cartUL.innerHTML = selectedBooks.length === 0
    ? `<li class="cart-empty">سبد خرید شما خالی است</li>`
    : selectedBooks.map(book => `
      <li class="cart-item">
        <img class="cart-item-image" src="./image/${book.imgSrc}" alt="${book.title}">
        <div class="cart-item-info">
          <h4 class="cart-item-title">${book.title}</h4>
          <p><strong>نویسنده:</strong> ${book.author}</p>
          <p><strong>ژانر:</strong> ${book.genre}</p>
          <p><strong>زبان:</strong> ${book.language}</p>
          <button onclick="removeFromCart(${book.id})" class="remove-item">حذف</button>
        </div>
      </li>
    `).join("");
}

function handleCartToggle() {
  document.getElementById("cart").classList.toggle("hidden");
}

function renderFilters() {
  const makeSection = (label, items, type) => `
    <h2>${label}</h2>
    ${items.map(val => `
      <div>
        <input type="checkbox" id="${type}-${val}" value="${val}" onchange="handleFilter('${type}', this)">
        <label for="${type}-${val}">${val}</label>
      </div>
    `).join("")}
  `;

  const authors = [...new Set(BOOKS.map(b => b.author))];
  const langs = [...new Set(BOOKS.map(b => b.language))];
  const genres = [...new Set(BOOKS.map(b => b.genre))];

  filtersContainer.innerHTML =
    makeSection("نویسنده", authors, "author") +
    makeSection("زبان", langs, "language") +
    makeSection("ژانر", genres, "genre");
}

function handleFilter(type, checkbox) {
  const value = checkbox.value;
  let list;
  if (type === "author") list = selectedAuthors;
  else if (type === "language") list = selectedLanguages;
  else list = selectedGenres;

  checkbox.checked ? list.push(value) : list.splice(list.indexOf(value), 1);
  applyFilters();
}

function applyFilters() {
  let filtered = [...BOOKS];

  if (selectedAuthors.length) {
    filtered = filtered.filter(b => selectedAuthors.includes(b.author));
  }
  if (selectedLanguages.length) {
    filtered = filtered.filter(b => selectedLanguages.includes(b.language));
  }
  if (selectedGenres.length) {
    filtered = filtered.filter(b => selectedGenres.includes(b.genre));
  }

  renderBooks(filtered);
}

renderBooks(BOOKS);
renderFilters();
updateCart();
