// const randomCover = (array) => {
//   const maxNumber = array.length;
//   const randomNumber = Math.floor(Math.random() * maxNumber);
//   return `https://covers.openlibrary.org/b/id/${array.covers[randomNumber - 1]}-M.jpg`;
// };

const coverTemplate = (cover) => `https://covers.openlibrary.org/b/id/${cover}-M.jpg`;
const defaultCover = 'https://via.placeholder.com/250x200';

const uploader = () => {
  const load = document.createElement('div');
  load.className = 'sk-cube-grid';
  load.innerHTML = `
    <div class="sk-cube sk-cube1"></div>
    <div class="sk-cube sk-cube2"></div>
    <div class="sk-cube sk-cube3"></div>
    <div class="sk-cube sk-cube4"></div>
    <div class="sk-cube sk-cube5"></div>
    <div class="sk-cube sk-cube6"></div>
    <div class="sk-cube sk-cube7"></div>
    <div class="sk-cube sk-cube8"></div>
    <div class="sk-cube sk-cube9"></div>
  `;
  return load;
};

const handleSearch = async (event) => {
  event.preventDefault();

  document.querySelector('.cards').innerHTML = '';

  const containerCards = document.querySelector('.cards');

  const load = uploader();
  console.log(load);
  document.querySelector('.cards').prepend(load);

  console.log('Hi');

  let formRequest = document.getElementById('js-search').value.toLowerCase();
  formRequest = formRequest.split(' ').join('+');
  console.log('formRequest', formRequest);

  const responseAllBooks = await fetch(`http://openlibrary.org/search.json?q=${formRequest}`);
  const resultAllBooks = await responseAllBooks.json();
  const books = await resultAllBooks.docs;
  // console.log(await books);

  load.remove();

  books.forEach(async (book) => {
    let resultBook = null;
    try {
      const responseBook = await fetch(`https://openlibrary.org${book.key}.json`);
      resultBook = await responseBook.json();
    } catch {
      return;
    }

    // console.log(await resultBook);

    const containerCard = document.createElement('div');
    containerCard.className = 'card';

    console.log(resultBook);
    const { covers } = resultBook;
    const cover = covers && covers.length ? coverTemplate(covers.pop()) : defaultCover;

    const description = resultBook.description?.value || resultBook.description || '';

    if (cover === defaultCover && description === '') {
      return;
    }

    // const cover = resultBook.covers ? resultBook.covers[resultBook.covers.length - 1] : 'https://via.placeholder.com/250x200'
    // const cover = resultBook.covers[resultBook.covers.length - 1];
    // let description = resultBook.description?.value;

    // if (resultBook.description?.value || resultBook.description) {
    //   if (!description) {
    //     description = resultBook.description;
    //   }
    // if (!cover) {
    //   containerCard.innerHTML = `
    //     <img class="cover" src="https://via.placeholder.com/250x200">
    //     <div class="title">${resultBook.title}</div>
    //     <p class="description">${description}</p>
    //     <a data-key="${book.key}" class="details" href="/book/details"><div>Details</div></a>
    //   `;
    // } else {
    const key = book.key.slice(7);
    console.log(key);
    containerCard.innerHTML = `
      <img class="cover" src="${cover}">
      <div class="title">${resultBook.title}</div>
      <p class="description">${description}</p>
      <a data-key="${book.key}" class="details" href="/books/${key}/details"><div>Details</div></a>
    `;
    console.log('book.key', book.key);
    // }
    containerCards.appendChild(containerCard);
    // } else {
    //   containerCard.innerHTML = `
    //     <img class="cover" src="https://covers.openlibrary.org/b/id/${cover}-M.jpg">
    //     <div class="title">${resultBook.title}</div>
    //     <p class="description"></p>
    //     <a class="details" href="/book/details/${book.key}"><div>Details</div></a>
    //     `;
    //   containerCards.appendChild(containerCard);
    // }
  });
  document.getElementById('js-search').value = '';
};

const handleLogin = async (event) => {
  event.preventDefault();

  const alert = document.getElementById('js-alert');

  if (alert) {
    alert.innerText = '';
  }
  console.log('логин');

  const email = document.getElementById('js-email').value;
  const password = document.getElementById('js-password').value;

  if (!email || !password) {
    alert.className = 'failed';
    alert.innerText = 'Please fill in all fields';
    return;
  }

  console.log(email, password);

  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email, password,
    }),
  });

  const result = await response.json();

  if (result.success) {
    alert.className = 'successfully';
    alert.innerText = 'User successfully logged in';
    setTimeout(() => {
      document.location = '/';
    }, 3000);
  } else {
    alert.className = 'failed';
    alert.innerText = 'Authorisation Error. Check your input or register';
  }
};

const handleRegister = async (event) => {
  event.preventDefault();

  const alert = document.getElementById('js-alert');

  if (alert) {
    alert.innerText = '';
  }

  const name = document.getElementById('js-name').value;
  const email = document.getElementById('js-email').value;
  const password = document.getElementById('js-password').value;

  if (!name || !email || !password) {
    alert.className = 'failed';
    alert.innerText = 'Please fill in all fields';
    return;
  }

  const response = await fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name, email, password,
    }),
  });

  const result = await response.json();

  if (result.success) {
    alert.className = 'successfully';
    alert.innerText = 'User successfully registered';
    setTimeout(() => {
      document.location = '/';
    }, 3000);
  } else {
    alert.className = 'failed';
    alert.innerText = 'Error during registration. Perhaps such a user exists';
  }
};

document.getElementById('js-btn-search')
  ?.addEventListener('click', handleSearch);

document.getElementById('js-auth-btn')
  ?.addEventListener('click', handleLogin);

document.getElementById('js-reg-btn')
  ?.addEventListener('click', handleRegister);
