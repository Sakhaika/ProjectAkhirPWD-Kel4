// ============================================================
// DATABASE.JS — Simulasi database menggunakan localStorage
// ============================================================

const DB = {
  // ── Inisialisasi database ──────────────────────────────────
  init() {
    // Cek versi database — jika versi lama, reset otomatis
    const versi = localStorage.getItem("rinjani_versi");
    if (versi !== "2") {
      localStorage.clear();
      this.seed();
      localStorage.setItem("rinjani_initialized", "true");
      localStorage.setItem("rinjani_versi", "2");
      return;
    }
    if (!localStorage.getItem("rinjani_initialized")) {
      this.seed();
      localStorage.setItem("rinjani_initialized", "true");
      localStorage.setItem("rinjani_versi", "2");
    }
  },

  // Paksa reset semua data (jalankan di console browser jika kuota perlu direset)
  reset() {
    localStorage.removeItem("rinjani_initialized");
    localStorage.removeItem("db_jalur");
    localStorage.removeItem("db_destinasi");
    localStorage.removeItem("db_kuota");
    localStorage.removeItem("db_pendaftaran");
    localStorage.removeItem("db_admins");
    this.seed();
    localStorage.setItem("rinjani_initialized", "true");
    console.log("Database direset!");
  },

  seed() {
    // Tabel: jalur pendakian
    const jalur = [
      {
        id: "senaru",
        nama: "Jalur Senaru",
        deskripsi:
          "Jalur klasik dari sisi barat, melewati hutan tropis lebat dan pemandangan air terjun Sendang Gile.",
        ketinggian: 601,
        jarak: "18 km",
        estimasi: "2 hari 1 malam",
        tingkat: "Sedang",
        kuota_harian: 30,
        gambar:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      },
      {
        id: "sembalun",
        nama: "Jalur Sembalun",
        deskripsi:
          "Jalur dari sisi timur melalui padang savana luas, lebih panjang namun pemandangan lebih terbuka.",
        ketinggian: 1156,
        jarak: "22 km",
        estimasi: "3 hari 2 malam",
        tingkat: "Sulit",
        kuota_harian: 25,
        gambar:
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
      },
      {
        id: "torean",
        nama: "Jalur Torean",
        deskripsi:
          "Jalur terpendek namun paling menantang, melewati ngarai curam dan sumber air panas alami.",
        ketinggian: 600,
        jarak: "14 km",
        estimasi: "2 hari 1 malam",
        tingkat: "Sangat Sulit",
        kuota_harian: 15,
        gambar:
          "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
      },
    ];

    // Tabel: destinasi wisata
    const destinasi = [
      {
        id: "danau-segara-anak",
        nama: "Danau Segara Anak",
        kategori: "Danau Vulkanik",
        deskripsi:
          "Danau kaldera berwarna biru kehijauan di ketinggian 2.008 mdpl, salah satu danau terindah di Indonesia.",
        lokasi: "Dalam kawasan kaldera Rinjani",
        tiket: "Termasuk dalam SIMAKSI",
        gambar:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        rating: 4.9,
      },
      {
        id: "air-terjun-sendang-gile",
        nama: "Air Terjun Sendang Gile",
        kategori: "Air Terjun",
        deskripsi:
          "Air terjun bertingkat dua dengan air jernih segar, terletak di kaki Rinjani dekat Desa Senaru.",
        lokasi: "Desa Senaru, Lombok Utara",
        tiket: "Rp 15.000 / orang",
        gambar:
          "https://images.unsplash.com/photo-1467890947394-8171244e5410?w=800&q=80",
        rating: 4.7,
      },
      {
        id: "gili-trawangan",
        nama: "Gili Trawangan",
        kategori: "Pulau & Pantai",
        deskripsi:
          "Pulau kecil dengan pantai berpasir putih, snorkeling, dan suasana santai khas Lombok.",
        lokasi: "Lombok Utara",
        tiket: "Rp 25.000 / kapal",
        gambar:
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
        rating: 4.8,
      },
      {
        id: "bukit-selong",
        nama: "Bukit Selong",
        kategori: "Wisata Alam",
        deskripsi:
          "Bukit dengan hamparan sawah terasering yang cantik, spot foto ikonik dengan latar Rinjani.",
        lokasi: "Sembalun, Lombok Timur",
        tiket: "Rp 10.000 / orang",
        gambar:
          "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
        rating: 4.6,
      },
    ];

    // Tabel: kuota harian (generate 30 hari ke depan)
    const kuota = {};
    const today = new Date();
    ["senaru", "sembalun", "torean"].forEach((jalurId) => {
      const kapasitas = jalur.find((j) => j.id === jalurId).kuota_harian;
      kuota[jalurId] = {};
      for (let i = 0; i < 30; i++) {
        const tgl = new Date(today);
        tgl.setDate(today.getDate() + i);
        const key = tgl.toISOString().split("T")[0];
        // Random terisi sebagian untuk demo (maks 50% agar tidak langsung penuh)
        const terisi = Math.floor(Math.random() * (kapasitas * 0.5));
        kuota[jalurId][key] = { kapasitas, terisi, sisa: kapasitas - terisi };
      }
    });

    // Tabel: pendaftaran (kosong awalnya)
    const pendaftaran = [];

    // Tabel: users admin
    const admins = [
      { username: "admin", password: "rinjani2024", nama: "Admin SIMAKSI" },
    ];

    localStorage.setItem("db_jalur", JSON.stringify(jalur));
    localStorage.setItem("db_destinasi", JSON.stringify(destinasi));
    localStorage.setItem("db_kuota", JSON.stringify(kuota));
    localStorage.setItem("db_pendaftaran", JSON.stringify(pendaftaran));
    localStorage.setItem("db_admins", JSON.stringify(admins));
  },

  // ── CRUD Methods ───────────────────────────────────────────

  // Jalur
  getJalur() {
    return JSON.parse(localStorage.getItem("db_jalur") || "[]");
  },
  getJalurById(id) {
    return this.getJalur().find((j) => j.id === id);
  },

  // Destinasi
  getDestinasi() {
    return JSON.parse(localStorage.getItem("db_destinasi") || "[]");
  },

  // Kuota
  getKuota() {
    return JSON.parse(localStorage.getItem("db_kuota") || "{}");
  },
  getKuotaByJalurTanggal(jalurId, tanggal) {
    const kuota = this.getKuota();
    return kuota[jalurId]?.[tanggal] || null;
  },
  kurangiKuota(jalurId, tanggal, jumlah) {
    const kuota = this.getKuota();
    if (kuota[jalurId]?.[tanggal]) {
      kuota[jalurId][tanggal].terisi += jumlah;
      kuota[jalurId][tanggal].sisa -= jumlah;
      localStorage.setItem("db_kuota", JSON.stringify(kuota));
      return true;
    }
    return false;
  },

  // Pendaftaran
  getPendaftaran() {
    return JSON.parse(localStorage.getItem("db_pendaftaran") || "[]");
  },
  tambahPendaftaran(data) {
    const list = this.getPendaftaran();
    const id = "SIMAKSI-" + Date.now();
    const newEntry = {
      ...data,
      id,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    list.push(newEntry);
    localStorage.setItem("db_pendaftaran", JSON.stringify(list));
    return newEntry;
  },
  updateStatusPendaftaran(id, status) {
    const list = this.getPendaftaran();
    const idx = list.findIndex((p) => p.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      localStorage.setItem("db_pendaftaran", JSON.stringify(list));
      return true;
    }
    return false;
  },
  hapusPendaftaran(id) {
    const list = this.getPendaftaran().filter((p) => p.id !== id);
    localStorage.setItem("db_pendaftaran", JSON.stringify(list));
  },

  // Auth
  login(username, password) {
    const admins = JSON.parse(localStorage.getItem("db_admins") || "[]");
    return (
      admins.find((a) => a.username === username && a.password === password) ||
      null
    );
  },

  // Session
  setSession(admin) {
    sessionStorage.setItem("admin_session", JSON.stringify(admin));
  },
  getSession() {
    return JSON.parse(sessionStorage.getItem("admin_session") || "null");
  },
  logout() {
    sessionStorage.removeItem("admin_session");
  },
};
