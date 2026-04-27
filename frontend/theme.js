const themeToggle = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('planner-theme', newTheme); // Save preference
};

// Apply the saved theme immediately on load
(function() {
    const savedTheme = localStorage.getItem('planner-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();