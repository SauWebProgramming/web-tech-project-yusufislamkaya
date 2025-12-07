// Temel DOM Elementleri
const contentArea = document.getElementById('content-area');
const navList = document.querySelector('.nav-list');
const navLinks = document.querySelectorAll('.nav-list a');
const hamburgerButton = document.querySelector('.hamburger-menu');

// --- 1. Hamburger Menü İşlevi ---
hamburgerButton.addEventListener('click', () => {
    navList.classList.toggle('is-open'); // CSS'teki is-open sınıfını ekle/kaldır
});

// --- 2. Navigasyon ve Sayfa Yükleme Olay Dinleyicileri ---
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Tarayıcının varsayılan link tıklama davranışını (sayfa yenilemeyi) engelle
        e.preventDefault(); 
        
        // Data-page niteliğindeki sayfa adını al
        const pageId = e.currentTarget.getAttribute('data-page');
        
        // Sayfayı yükle ve URL'i güncelle
        loadPage(pageId);

        // Mobil cihazda menüyü kapat
        if (navList.classList.contains('is-open')) {
             navList.classList.remove('is-open');
        }
    });
});

// Tarayıcı geri/ileri butonu kullanıldığında
window.addEventListener('popstate', (e) => {
    // URL'deki hash (#) kısmını al. Örn: #projelerim
    const hash = window.location.hash.substring(1); 
    // Hash yoksa (ana sayfa), 'hakkimda' yükle
    loadPage(hash || 'hakkimda', false); 
});

// Uygulama yüklendiğinde varsayılan sayfayı yükle
document.addEventListener('DOMContentLoaded', () => {
    const initialHash = window.location.hash.substring(1) || 'hakkimda';
    loadPage(initialHash);
});

// Uygulama verilerini tutacak global değişken
let appData = {};
/**
 * Veri yönetimi: Yerel JSON dosyasından verileri çeker (fetch API).
 * @returns {Promise<Object>} Çekilen JSON verisi.
 */
async function fetchAppData() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) {
            throw new Error(`HTTP Hata: ${response.status}`);
        }
        appData = await response.json();
        return appData;
    } catch (error) {
        contentArea.innerHTML = `<h1>Veri Yükleme Hatası</h1><p>Veriler yüklenirken bir sorun oluştu: ${error.message}</p>`;
        console.error('Veri çekme hatası:', error);
        return null;
    }
}

/**
 * Dinamik Sayfa Yükleme ve URL Yönetimi.
 * @param {string} pageId Yüklenecek sayfanın ID'si (hakkimda, projelerim, iletisim).
 * @param {boolean} updateUrl Tarayıcı geçmişini ve URL'i güncelle (popstate için false olmalı).
 */
async function loadPage(pageId, updateUrl = true) {
    if (Object.keys(appData).length === 0) {
        await fetchAppData();
    }
    
    // Yüklenecek içeriği belirle
    let contentHTML = '';
    let pageTitle = '';

    if (pageId === 'hakkimda' && appData.pages && appData.pages.hakkimda) {
        pageTitle = appData.pages.hakkimda.title;
        contentHTML = appData.pages.hakkimda.content;

    } else if (pageId === 'projelerim') {
        pageTitle = appData.pages.projelerim.title;
        contentHTML = createProjectsHTML(appData.projects); // Proje listesini oluştur

    } else if (pageId === 'iletisim') {
        pageTitle = appData.pages.iletisim.title;
        contentHTML = createContactFormHTML(); // İletişim formunu oluştur

    } else {
        // Sayfa bulunamazsa
        pageTitle = 'Sayfa Bulunamadı';
        contentHTML = '<h1>404 Sayfa Bulunamadı</h1><p>Aradığınız içerik mevcut değil.</p>';
    }

    // İçeriği DOM'a yerleştir
    contentArea.innerHTML = `<h2>${pageTitle}</h2>${contentHTML}`;

    // --- URL Yönetimi (History API) ---
    if (updateUrl) {
        // Sayfa yenilenmeden URL'i güncelleme (Örn: .../index.html#projelerim)
        history.pushState({ page: pageId }, pageTitle, `#${pageId}`); 
    }
}
/**
 * Projeler dizisini döngüye alarak HTML listesi oluşturur.
 * @param {Array<Object>} projects Proje verilerinin dizisi.
 * @returns {string} HTML içeriği.
 */
function createProjectsHTML(projects) {
    let html = '';
    
    // Projelerim sayfasının başlangıç içeriğini ekle
    if (appData.pages && appData.pages.projelerim) {
         html += appData.pages.projelerim.content;
    }

    // Projeleri listelemek için bir kapsayıcı div (isteğe bağlı Grid/Flexbox)
    html += '<div class="project-list">'; 

    projects.forEach(project => {
        html += `
            <article class="project-card">
                <h3>${project.name}</h3>
                <p><strong>Teknolojiler:</strong> ${project.tech}</p>
                <p>${project.description}</p>
            </article>
        `;
    });
    
    html += '</div>';
    return html;
}

/**
 * İletişim formunun HTML'ini oluşturur ve JS doğrulamasını ayarlar.
 * @returns {string} Form HTML içeriği.
 */
function createContactFormHTML() {
    // HTML5 Doğrulamaları ve Ek JS Doğrulaması içeren Form
    const html = `
        ${appData.pages.iletisim.content}
        <form id="contact-form" class="contact-form">
            <div>
                <label for="name">Adınız:</label>
                <input type="text" id="name" name="name" required minlength="2">
            </div>
            <div>
                <label for="email">E-posta:</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div>
                <label for="message">Mesajınız:</label>
                <textarea id="message" name="message" required rows="5"></textarea>
            </div>
            <button type="submit">Gönder</button>
            <p id="form-message" class="hidden"></p>
        </form>
    `;

    // Form DOM'a eklendikten sonra JS listener'ı eklenmeli.
    // Bu yüzden loadPage'in bitmesini bekleyip listener'ı ekleyen bir fonksiyon yazmalıyız.
    setTimeout(addFormListener, 0); 
    
    return html;
}

/**
 * İletişim Formuna submit olay dinleyicisi ekler.
 */
function addFormListener() {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); 

            // --- Ek JavaScript Doğrulamaları ---
            const emailInput = document.getElementById('email');
            if (!emailInput.value.includes('@')) {
                alert('Lütfen geçerli bir e-posta adresi girin.');
                emailInput.focus();
                return;
            }

            // Form başarılıysa
            this.reset(); // Formu sıfırla
            formMessage.textContent = '✅ Mesajınız başarıyla gönderildi!';
            formMessage.classList.remove('hidden');
            formMessage.style.color = 'green';

            // Mesajı 5 saniye sonra gizle
            setTimeout(() => {
                formMessage.classList.add('hidden');
                formMessage.textContent = '';
            }, 5000);
        });
    }
}
