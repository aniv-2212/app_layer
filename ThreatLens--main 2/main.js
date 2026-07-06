document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const menuLinks = document.querySelectorAll('.nav-menu a');
    const sections = document.querySelectorAll('.content-section');

    // Toggle Sidebar Drawer panel open/close
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
    });

    // Handle Panel Routing switches
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('data-target');

            // If there's no data-target (like for index.html link), skip JS routing control entirely
            if (!targetId) return;

            e.preventDefault();

            // Hide inactive components
            sections.forEach(sec => sec.classList.remove('active'));

            // Display requested element block
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Slide out view window collapse action
            navMenu.classList.remove('active');
        });
    });

    // Close sidebar if clicking outside the sidebar block area
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && e.target !== menuToggle) {
            navMenu.classList.remove('active');
        }
    });
});