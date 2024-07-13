const apiKey = 'ebbaa80335f77c195f657a7ff63133a6'; // Replace with your TMDb API key
const itemsPerPage = 4;
let currentPage = 1;
let totalResults = 0;

document.getElementById('filterButton').addEventListener('click', filterMovies);
document.getElementById('prevPage').addEventListener('click', () => changePage(-1));
document.getElementById('nextPage').addEventListener('click', () => changePage(1));

async function getFilterOptions() {
    const genreResponse = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`);
    const genreData = await genreResponse.json();
    const genres = genreData.genres;

    const languageResponse = await fetch(`https://api.themoviedb.org/3/configuration/languages?api_key=${apiKey}`);
    const languageData = await languageResponse.json();

    populateFilterOptions(genres, languageData);
}
function populateFilterOptions(genres, languages) {
    const genreSelect = document.getElementById('genre');
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
    });

    const languageSelect = document.getElementById('language');
    // Sort languages alphabetically by 'english_name'
    languages.sort((a, b) => a.english_name.localeCompare(b.english_name));

    languages.forEach(language => {
        const option = document.createElement('option');
        option.value = language.iso_639_1;
        option.textContent = language.english_name;
        languageSelect.appendChild(option);
    });
}


async function filterMovies() {
    const genre = document.getElementById('genre').value;
    const language = document.getElementById('language').value;
    const year = document.getElementById('year').value;

    const query = buildQuery(genre, language, year);
    const movies = await fetchMovies(query, currentPage);
    displayMovies(movies);
    updatePagination();
}

async function fetchMovies(query, page) {
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?${query}&page=${page}&api_key=${apiKey}`);
    const data = await response.json();
    totalResults = data.total_results;
    return data.results;
}


function buildQuery(genre, language, year) {
    let query = '';
    if (genre) {
        query += `&with_genres=${genre}`;
    }
    if (language) {
        query += `&with_original_language=${language}`;
    }
    if (year) {
        query += `&year=${year}`;
    }
    return query;
}

function displayMovies(movies) {
    const movieList = document.getElementById('movieList');
    movieList.innerHTML = "";

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
            <div class="details">
                <h3>${movie.title}</h3>
                <p>${movie.release_date}</p>
            </div>
        `;
        movieList.appendChild(movieCard);
    });
}

function updatePagination() {
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const pageNumber = document.getElementById('pageNumber');

    pageNumber.textContent = currentPage;

    if (currentPage === 1) {
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }

    if (currentPage * itemsPerPage >= totalResults) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }
}


function changePage(delta) {
    currentPage += delta;
    filterMovies(); // Call filterMovies to update with new page number
}
getFilterOptions();
filterMovies();