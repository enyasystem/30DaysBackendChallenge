// Main JavaScript for NYSC project - migrated from index.html

// Loading Screen
function hideLoadingScreen() {
    var loading = document.getElementById('loading');
    if (loading) {
        loading.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Hide loading after 2 seconds
    setTimeout(hideLoadingScreen, 2000);

    // Fallback: hide after 5 seconds if still visible
    setTimeout(hideLoadingScreen, 5000);

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
