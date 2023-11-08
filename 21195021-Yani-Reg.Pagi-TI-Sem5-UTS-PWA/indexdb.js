var db;
var request = indexedDB.open('komentarDB', 1);

request.onerror = function(event) {
    console.log("Error saat membuka database: " + event.target.errorCode);
};

request.onupgradeneeded = function(event) {
    db = event.target.result;
    var objectStore = db.createObjectStore("komentar", { keyPath: "nama", autoIncrement: true });
    objectStore.createIndex("nama", "nama", { unique: true });
    objectStore.createIndex("komentar", "komentar", { unique: true });


};

request.onsuccess = function(event) {
    db = event.target.result;
    // showComments();
};

// Menambahkan komentar ke dalam IndexedDB
document.getElementById('komentar-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var nama = document.getElementById('nama').value;
    var komentar = document.getElementById('komentar').value;

    var transaction = db.transaction(['komentar'], 'readwrite');
    var objectStore = transaction.objectStore('komentar');
    var comment = { nama: nama, komentar: komentar };
    objectStore.add(comment);

    document.getElementById('nama').value = '';
    document.getElementById('komentar').value = '';

    transaction.oncomplete = function() {
        alert("Komentar telah disimpan.");
        document.getElementById("komentar-form").reset();
        //tampilkanData();
    };

    function tampilkanData() {
        var objectStore = db.transaction('komentar').objectStore('komentar');
        var daftarkomentar = document.getElementById('daftarkomentar');
        daftarkomentar.innerHTML = '';
    
        objectStore.openCursor().onsuccess = function(event) {
            const cursor = event.target.result;
            if (cursor) {
                const li = document.createElement('li');
                li.innerHTML = `Nama: ${cursor.value.nama}, Komentar: ${cursor.value.komentar}`;
                daftarkomentar.appendChild(li);
                cursor.continue();

                transaction.onerror = function(event) {
                    console.error("Kesalahan saat menyimpan komentar: " + event.target.error);
                };
                
        
    
            }
        };
    }   
    tampilkanData();
});


function hapusData() {
    const nama = document.getElementById('cariNama').value;
    const transaction = db.transaction(['komentar'], 'readwrite');
    const objectStore = transaction.objectStore('komentar');
    const request = objectStore.delete(nama);

    request.onsuccess = function() {
        console.log("Komentar dengan Nama " + nama + " telah dihapus");
        alert("Komentar Telah Dihapus");
        //tampilkanData();
    }
}
function cariData() {
    const nama = document.getElementById('cariNama').value;
    const transaction = db.transaction(['komentar'], 'readonly');
    const objectStore = transaction.objectStore('komentar');
    const index = objectStore.index('nama');
    const request = index.get(nama);

    request.onsuccess = function() {
        console.log("Komentar Nama " + nama + " telah di cari");
        alert("Komentar Telah di Cari");
        const result = request.result;
        if (result) {
            const daftarMahasiswa = document.getElementById('daftarkomentar');
            daftarMahasiswa.innerHTML = `<li>Nama: ${result.nama}</li><li>Komentar: ${result.komentar}`;
        } else {
            alert('Data tidak ditemukan.');
        }
    };
}
