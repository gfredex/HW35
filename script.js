const BASE_URL = "https://api.rawg.io/api/games"
const API_KEY = "5a468c92804f440d86a397954555b489"
const btnUp = document.getElementById('up');
const btnDown = document.getElementById('down');
const searchInput = document.getElementById('search-input');
const btnSearch = document.getElementById('search-btn');
let currentPage = 1;

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

btnUp.addEventListener('click', () => {
    console.log('Кнопка Up');
    currentPage++;
    loadGames();
});
btnDown.addEventListener('click', () => {
    console.log('Кнопка Down');

    if (currentPage > 1) {
        currentPage--;
        loadGames();
    }
});

async function fetchGames(page) {
    const response = await fetch(`${BASE_URL}?key=${API_KEY}&page=${page}`);
    const data = await response.json()
    return data
}

async function searchGame(search) {
    const res = await fetch(`${BASE_URL}?key=${API_KEY}&search=${search}`);
    const data = await res.json();
    return data;
}

async function loadGames() {
    let dataPage = await fetchGames(currentPage);
    render(dataPage.results);
    console.log(dataPage.results);
    console.log(dataPage);

}

btnSearch.addEventListener('click', async () => {
    const dataSearch = await searchGame(searchInput.value.trim());
    console.log(searchGame(searchInput.value.trim()));

    render(dataSearch.results);
    searchInput.value = '';
})

loadGames();