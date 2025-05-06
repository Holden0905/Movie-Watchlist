// OMDb API key
const apiKey = '72a86a9f';

// Get DOM elements
const movieTitleInput = document.getElementById('movie-title');
const searchButton = document.getElementById('search-button');
const errorMessage = document.getElementById('error-message');
const movieInfo = document.getElementById('movie-info');

// Add event listeners
searchButton.addEventListener('click', searchMovie);
movieTitleInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchMovie();
    }
});

// Main function to search for a movie
function searchMovie() {
    const movieTitle = movieTitleInput.value.trim();
    
    // Clear previous results
    errorMessage.style.display = 'none';
    movieInfo.style.display = 'none';
    
    // Validate input
    if (!movieTitle) {
        displayError('Please enter a movie title');
        return;
    }
    
    // Construct the API URL with your key
    const apiUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=${apiKey}`;
    
    // Show loading state
    displayError('Loading...');
    
    // Fetch data from the API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Hide loading message
            errorMessage.style.display = 'none';
            
            if (data.Response === 'False') {
                displayError(data.Error || 'Movie not found');
            } else {
                displayMovieInfo(data);
            }
        })
        .catch(error => {
            displayError('Error fetching movie data. Please try again.');
            console.error('Error:', error);
        });
}

// Display error message
function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Display movie information
function displayMovieInfo(movie) {
    // Create HTML content for the movie info
    let html = '';
    
    if (movie.Poster && movie.Poster !== 'N/A') {
        html += `<img src="${movie.Poster}" alt="${movie.Title} poster">`;
    }
    
    html += `<h2>${movie.Title} (${movie.Year})</h2>`;
    
    if (movie.Rated) {
        html += `<p><strong>Rated:</strong> ${movie.Rated}</p>`;
    }
    
    if (movie.Runtime) {
        html += `<p><strong>Runtime:</strong> ${movie.Runtime}</p>`;
    }
    
    if (movie.Genre) {
        html += `<p><strong>Genre:</strong> ${movie.Genre}</p>`;
    }
    
    if (movie.Director) {
        html += `<p><strong>Director:</strong> ${movie.Director}</p>`;
    }
    
    if (movie.Actors) {
        html += `<p><strong>Actors:</strong> ${movie.Actors}</p>`;
    }
    
    if (movie.Plot) {
        html += `<p><strong>Plot:</strong> ${movie.Plot}</p>`;
    }
    
    if (movie.imdbRating) {
        html += `<p><strong>IMDb Rating:</strong> ${movie.imdbRating}/10</p>`;
    }
    
    // Add to watchlist button
    html += `
        <div class="movie-actions">
            <button class="add-to-watchlist" onclick="addToWatchlist('${encodeURIComponent(JSON.stringify(movie))}')">
                Add to Watchlist
            </button>
        </div>
        <div style="clear: both;"></div>
    `;
    
    // Display the movie info
    movieInfo.innerHTML = html;
    movieInfo.style.display = 'block';
}

// Add movie to watchlist
function addToWatchlist(movieData) {
    try {
        const movie = JSON.parse(decodeURIComponent(movieData));
        
        // Get current watchlist from localStorage
        let watchlist = JSON.parse(localStorage.getItem('movieWatchlist')) || [];
        
        // Check if movie is already in watchlist
        const isAlreadyInWatchlist = watchlist.some(item => item.imdbID === movie.imdbID);
        
        if (isAlreadyInWatchlist) {
            alert(`"${movie.Title}" is already in your watchlist!`);
            return;
        }
        
        // Add movie to watchlist
        watchlist.push(movie);
        
        // Save updated watchlist to localStorage
        localStorage.setItem('movieWatchlist', JSON.stringify(watchlist));
        
        alert(`"${movie.Title}" has been added to your watchlist!`);
    } catch (error) {
        console.error('Error adding movie to watchlist:', error);
        alert('Error adding movie to watchlist. Please try again.');
    }
}