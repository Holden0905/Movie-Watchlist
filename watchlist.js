// DOM elements
const watchlistContainer = document.getElementById('watchlist-container');
const emptyWatchlistMessage = document.getElementById('empty-watchlist-message');

// Load and display watchlist
document.addEventListener('DOMContentLoaded', () => {
    displayWatchlist();
});

// Display all movies in watchlist
function displayWatchlist() {
    // Get watchlist from localStorage
    const watchlist = JSON.parse(localStorage.getItem('movieWatchlist')) || [];
    
    // Check if watchlist is empty
    if (watchlist.length === 0) {
        watchlistContainer.style.display = 'none';
        emptyWatchlistMessage.style.display = 'block';
        return;
    }
    
    // Show watchlist and hide empty message
    watchlistContainer.style.display = 'block';
    emptyWatchlistMessage.style.display = 'none';
    
    // Add clear watchlist button
    let html = `
        <button class="clear-watchlist" onclick="clearWatchlist()">
            Clear Watchlist
        </button>
    `;
    
    // Create HTML for each movie card
    watchlist.forEach(movie => {
        html += createMovieCard(movie);
    });
    
    // Update the DOM
    watchlistContainer.innerHTML = html;
}

// Create HTML for a movie card
function createMovieCard(movie) {
    let html = `<div class="movie-card">`;
    
    // Add poster if available
    if (movie.Poster && movie.Poster !== 'N/A') {
        html += `<img src="${movie.Poster}" alt="${movie.Title} poster">`;
    }
    
    // Add movie info
    html += `
        <div class="info">
            <h2>${movie.Title} (${movie.Year})</h2>
    `;
    
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
    
    if (movie.Plot) {
        html += `<p><strong>Plot:</strong> ${movie.Plot}</p>`;
    }
    
    if (movie.imdbRating) {
        html += `<p><strong>IMDb Rating:</strong> ${movie.imdbRating}/10</p>`;
    }
    
    html += `</div>`;
    
    // Add remove button
    html += `
        <div class="movie-actions">
            <button class="remove-from-watchlist" onclick="removeFromWatchlist('${movie.imdbID}')">
                Remove from Watchlist
            </button>
        </div>
        <div style="clear: both;"></div>
    </div>`;
    
    return html;
}

// Remove movie from watchlist
function removeFromWatchlist(imdbID) {
    // Get current watchlist
    let watchlist = JSON.parse(localStorage.getItem('movieWatchlist')) || [];
    
    // Find movie to remove
    const movieToRemove = watchlist.find(movie => movie.imdbID === imdbID);
    
    if (!movieToRemove) {
        return;
    }
    
    // Filter out the movie
    watchlist = watchlist.filter(movie => movie.imdbID !== imdbID);
    
    // Save updated watchlist
    localStorage.setItem('movieWatchlist', JSON.stringify(watchlist));
    
    // Update the UI
    displayWatchlist();
    
    // Show confirmation
    alert(`"${movieToRemove.Title}" has been removed from your watchlist.`);
}

// Clear entire watchlist
function clearWatchlist() {
    if (confirm('Are you sure you want to clear your entire watchlist?')) {
        // Clear watchlist in localStorage
        localStorage.removeItem('movieWatchlist');
        
        // Update the UI
        displayWatchlist();
    }
}