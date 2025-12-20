/* ========================================
   SAYFA YÜKLENDİĞİNDE ÇALIŞACAK KODLAR
   ======================================== */

// Sayfa tamamen yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', function() {
    
    // İlk sayfayı yükle (Hakkımda)
    loadPage('hakkimda');
    
    // Menü linklerine tıklama olayı ekle
    setupMenu();
    
    // Hamburger menü çalıştır
    setupHamburger();
});


/* ========================================
   MENÜ KURULUMU
   ======================================== */

function setupMenu() {
    // Tüm menü linklerini seç
    const navLinks = document.querySelectorAll('.nav-link');
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    
    // Her bir link için tıklama olayı ekle
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();  // Sayfanın yenilenmesini engelle
            
            // Tıklanan sayfanın adını al (#hakkimda -> hakkimda)
            const pageName = this.getAttribute('href').substring(1);
            
            // Sayfayı yükle
            loadPage(pageName);
            
            // Aktif linki güncelle
            navLinks.forEach(function(l) {
                l.classList.remove('active');  // Hepsinden active'i kaldır
            });
            this.classList.add('active');  // Tıklanana active ekle
            
            // Mobilde menü açıksa kapat
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
}


/* ========================================
   HAMBURGER MENÜ KURULUMU
   ======================================== */

function setupHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    // Hamburger butonuna tıklanınca
    hamburger.addEventListener('click', function() {
        // Menüyü aç/kapat
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Menü dışına tıklanınca kapat
    document.addEventListener('click', function(e) {
        // Tıklanan yer menü veya hamburger değilse
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            // Menüyü kapat
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}


/* ========================================
   VERİ SAKLAMA
   ======================================== */

// Site verilerini burada tutacağız
let siteData = {};

// data.json dosyasından veri çek
async function getData() {
    try {
        // fetch ile JSON dosyasını oku
        const response = await fetch('data.json');
        
        // JSON'u JavaScript objesine çevir
        siteData = await response.json();
        
        return siteData;
        
    } catch (error) {
        // Hata olursa konsola yaz
        console.error('Veri yükleme hatası:', error);
        return null;
    }
}


/* ========================================
   SAYFA YÜKLEME FONKSİYONU
   ======================================== */

async function loadPage(pageName) {
    
    // Eğer veri henüz yüklenmediyse, önce veriyi çek
    if (Object.keys(siteData).length === 0) {
        await getData();
    }
    
    // İçeriğin gösterileceği alanı seç
    const content = document.getElementById('content');
    
    // Sayfa HTML'ini oluştur
    let html = '';
    
    // Hangi sayfa açılacak?
    if (pageName === 'hakkimda') {
        html = createAboutPage();
    } 
    else if (pageName === 'projelerim') {
        html = createProjectsPage();
    } 
    else if (pageName === 'iletisim') {
        html = createContactPage();
    }
    
    // HTML'i sayfaya yaz
    content.innerHTML = html;
    
    // Eğer iletişim sayfasıysa, form olayını ekle
    if (pageName === 'iletisim') {
        setupContactForm();
    }
}


/* ========================================
   HAKKIMDA SAYFASI OLUŞTUR
   ======================================== */

function createAboutPage() {
    // HTML string'i oluştur
    return `
        <h2>👨‍💻 Hakkımda</h2>
        <div class="about-box">
            <h3>Merhaba, Ben Yusuf İslam Kaya 👋</h3>
            <p>Web geliştirme öğrenen bir öğrenciyim. HTML, CSS ve JavaScript ile projeler yapıyorum.</p>
            <p>Kullanıcı dostu web siteleri yapmayı seviyorum ve her gün yeni şeyler öğreniyorum.</p>
            
            <h4>Bildiğim Teknolojiler:</h4>
            <div class="skills">
                <span class="skill">HTML5</span>
                <span class="skill">CSS3</span>
                <span class="skill">JavaScript</span>
                <span class="skill">Git</span>
                <span class="skill">Responsive Design</span>
            </div>
        </div>
    `;
}


/* ========================================
   PROJELER SAYFASI OLUŞTUR
   ======================================== */

function createProjectsPage() {
    // Başlangıç HTML'i
    let html = '<h2>🚀 Projelerim</h2>';
    html += '<div class="projects">';
    
    // data.json'dan projeleri al
    const projects = siteData.projects || [];
    
    // Her proje için kart oluştur
    projects.forEach(function(project) {
        html += `
            <div class="project-card">
                <h3>${project.icon} ${project.name}</h3>
                <p><strong>Teknolojiler:</strong> ${project.tech}</p>
                <p>${project.description}</p>
            </div>
        `;
    });
    
    // Kapanış etiketi
    html += '</div>';
    
    return html;
}


/* ========================================
   İLETİŞİM SAYFASI OLUŞTUR
   ======================================== */

function createContactPage() {
    return `
        <h2>📧 İletişim</h2>
        <div class="contact-box">
            <p>Benimle iletişime geçmek için aşağıdaki formu doldurun:</p>
            
            <form id="contact-form">
                <div class="form-group">
                    <label for="name">Adınız:</label>
                    <input type="text" id="name" name="name" required>
                </div>
                
                <div class="form-group">
                    <label for="email">E-posta:</label>
                    <input type="email" id="email" name="email" required>
                </div>
                
                <div class="form-group">
                    <label for="message">Mesajınız:</label>
                    <textarea id="message" name="message" required></textarea>
                </div>
                
                <button type="submit">Gönder</button>
            </form>
            
            <div id="success-msg" class="success-message">
                ✅ Mesajınız gönderildi! Teşekkür ederim.
            </div>
        </div>
    `;
}


/* ========================================
   İLETİŞİM FORMU ÇALIŞTIR
   ======================================== */

function setupContactForm() {
    // Formu ve mesaj alanını seç
    const form = document.getElementById('contact-form');
    const successMsg = document.getElementById('success-msg');
    
    // Form gönderildiğinde
    form.addEventListener('submit', function(e) {
        e.preventDefault();  // Sayfayı yenileme
        
        // Formu temizle
        form.reset();
        
        // Başarı mesajını göster
        successMsg.style.display = 'block';
        
        // 3 saniye sonra mesajı gizle
        setTimeout(function() {
            successMsg.style.display = 'none';
        }, 3000);
    });
}