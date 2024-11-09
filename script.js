const BASE_URL = "https://api.rawg.io/api/games";
const API_KEY = "5a468c92804f440d86a397954555b489";
const GENRE_URL = "https://api.rawg.io/api/genres";
const btnNext = document.getElementById('next');
const btnBack = document.getElementById('back');
const searchInput = document.getElementById('search-input');
const btnSearch = document.getElementById('search-btn');
const firstPage = document.querySelector('.first-page');
const lastPage = document.querySelector('.last-page');
const curPage = document.querySelector('.current-page');
const selectGenre = document.getElementById('select-genre');
let selectedGenre = '';
let currentPage = 1;
let strSearch = '';



function render(games) {
    const wrapGames = document.querySelector('.wrap-games');
    wrapGames.innerHTML = '';
    games.forEach(game => {
        let cardGame = document.createElement(`div`);
        cardGame.classList.add('game-card');
        cardGame.innerHTML = `    
        <img src="${game.background_image}" alt="${game.name}" loading="lazy">
        <div class='infi-card'>
            <h3 class="title">${game.name}</h3>
            <p class="date">${game.released}</p>    
        </div>
    `;
        wrapGames.appendChild(cardGame);
    });

}

btnNext.addEventListener('click', () => {
    console.log('Кнопка Next');
    currentPage++;
    loadGames();
});
btnBack.addEventListener('click', () => {
    console.log('Кнопка Back');

    if (currentPage > 1) {
        currentPage--;
        loadGames();
    }
});

async function fetchGenresGames() {
    const response = await fetch(`${GENRE_URL}?key=${API_KEY}`);
    const data = await response.json();
    return data;
}
async function loadSelect() {
    let dataGenres = await fetchGenresGames();
    dataGenres.results.forEach(genre => {
        let newOption = new Option(`${genre.name}`, `${genre.name}`);
        selectGenre.appendChild(newOption);
    });
}
loadSelect();

async function fetchGames(page) {
    const response = await fetch(`${BASE_URL}?key=${API_KEY}&page=${page}`);
    const data = await response.json()
    return data;
}

async function searchGame(search, page = 1, genres = '') {
    let res;
    if (genres != '') {
        res = await fetch(`${BASE_URL}?key=${API_KEY}&page=${page}&genres=${genres}&search=${search}`);
    } else {
        res = await fetch(`${BASE_URL}?key=${API_KEY}&page=${page}&search=${search}`);
    }

    const data = await res.json();
    lastPage.textContent = Math.ceil(data.count / 20);
    return data;
}

async function loadGamesGenre(genre, page = 1) {
    const res = await fetch(`${BASE_URL}?key=${API_KEY}&page=${page}&genres=${genre}`);
    const data = await res.json();
    lastPage.textContent = Math.ceil(data.count / 20);
    console.log(data);
    console.log(`${BASE_URL}?key=${API_KEY}&genres=${genre}`);


    return data;
}

async function loadGames() {
    let dataPage;
    if (strSearch != '') {
        dataPage = await searchGame(strSearch, currentPage);
    } else if (selectedGenre != '' && strSearch != '') {
        dataPage = await searchGame(strSearch, currentPage, selectedGenre);
    } else if (selectedGenre != '') {
        dataPage = await loadGamesGenre(selectedGenre, currentPage);
        console.log('вызываю LoadGamesGenre');
    } else {
        dataPage = await fetchGames(currentPage);
    }
    lastPage.textContent = Math.ceil(dataPage.count / 20);
    firstPage.textContent = 1;
    curPage.textContent = currentPage;
    render(dataPage.results);
    console.log(dataPage.results);
    console.log(dataPage);
}

btnSearch.addEventListener('click', async () => {
    strSearch = searchInput.value.trim();
    const dataSearch = await searchGame(strSearch);
    render(dataSearch.results);
    searchInput.value = '';
});

selectGenre.addEventListener('change', (e) => {
    selectedGenre = e.target.value.toLowerCase();
    console.log(selectedGenre);
    loadGames();
});

lastPage.addEventListener('click', (e) => {
    currentPage = Number(e.target.textContent);
    loadGames();
});

firstPage.addEventListener('click', () => {
    currentPage = 1;
    loadGames();
});


loadGames();