document.addEventListener('DOMContentLoaded', function () {
    loadPage('hakkimda');
    setupMenu();
    setupHamburger();
});

function setupMenu() {
    const links = document.querySelectorAll('.nav-link');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const page = this.getAttribute('href').substring(1);
            loadPage(page);

            links.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}
s