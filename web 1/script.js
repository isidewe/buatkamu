/* =========================================================
   BAGIAN YANG DIUBAH SETIAP ADA PESANAN
   Ubah nilai di bawah ini untuk membuat versi pelanggan baru.
   ========================================================= */
const CONFIG = {
  password: "i love you",
  recipientName: "Fulanah",
  senderName: "Fulan",
  // Nomor WhatsApp pengirim: kode negara + nomor, tanpa +, spasi, atau strip.
  // Contoh format Indonesia: 6281234567890
  whatsappNumber: "6282333464588",
  reasons: [
    "Cara kamu tertawa sering bikin suasana jadi lebih menyenangkan.",
    "Kamu punya cara sendiri untuk membuat hal sederhana terasa berarti.",
    "Aku suka bagaimana kamu tetap menjadi dirimu sendiri."
  ],
  confession: "Aku nyaman saat ngobrol dan menghabiskan waktu bareng kamu. Lama-lama aku sadar kalau perasaanku ternyata lebih dari sekadar teman.\n\nAku nggak mau bikin kamu merasa terbebani. Aku cuma ingin jujur tentang apa yang kurasakan."
};

/* =========================================================
   ELEMEN HTML
   querySelector dipakai untuk mengambil elemen dari halaman.
   ========================================================= */
const pages = document.querySelectorAll(".page");
const passwordForm = document.querySelector("#password-form");
const passwordInput = document.querySelector("#password-input");
const passwordError = document.querySelector("#password-error");
const reasonList = document.querySelector("#reason-list");
const responseForm = document.querySelector("#response-form");
const responseError = document.querySelector("#response-error");

/* Isi nama, daftar alasan, dan pesan dari CONFIG ke HTML. */
document.querySelectorAll("[data-recipient]").forEach((element) => {
  element.textContent = CONFIG.recipientName;
});
document.querySelectorAll("[data-sender]").forEach((element) => {
  element.textContent = CONFIG.senderName;
});
document.querySelector("#confession-copy").textContent = CONFIG.confession;

CONFIG.reasons.forEach((reason, index) => {
  const item = document.createElement("div");
  item.className = "reason-item";

  const number = document.createElement("span");
  number.className = "reason-number";
  number.textContent = String(index + 1).padStart(2, "0");

  const text = document.createElement("span");
  text.textContent = reason;

  item.append(number, text);
  reasonList.append(item);
});

/* Fungsi untuk menampilkan satu halaman dan menyembunyikan sisanya. */
function showPage(pageId) {
  pages.forEach((page) => {
    const isTarget = page.id === pageId;
    page.hidden = !isTarget;
    page.classList.toggle("active", isTarget);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* 1. Cek sandi saat form dikirim. */
passwordForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Mencegah form me-refresh halaman.

  if (passwordInput.value === CONFIG.password) {
    passwordError.textContent = "";
    passwordInput.value = "";
    showPage("page-welcome");
  } else {
    passwordError.textContent = "Sandi belum tepat. Coba ingat lagi, ya.";
    passwordInput.focus();
  }
});

/* 2. Tombol lanjut: pindah ke halaman sesuai data-go. */
document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => {
    showPage(button.dataset.go);
  });
});

/* 3. Kirim jawaban penerima melalui WhatsApp. */
responseForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Mencegah form me-refresh halaman.
  responseError.textContent = "";

  const selectedAnswer = responseForm.querySelector('input[name="answer"]:checked');
  if (!selectedAnswer) {
    responseError.textContent = "Pilih salah satu jawaban terlebih dahulu, ya.";
    return;
  }

  // Nomor harus diisi oleh pembuat website sebelum dipublikasikan.
  if (!/^\d{8,15}$/.test(CONFIG.whatsappNumber)) {
    responseError.textContent = "Nomor WhatsApp pengirim belum diatur. Isi CONFIG.whatsappNumber di script.js.";
    return;
  }

  const answerText = {
    yes: "Aku juga punya perasaan yang sama.",
    no: "Aku lebih nyaman berteman.",
    later: "Aku butuh waktu untuk memikirkannya."
  }[selectedAnswer.value];

  const optionalMessage = document.querySelector("#reply-message").value.trim();
  const whatsappMessage = [
    `Hai ${CONFIG.senderName}, aku ${CONFIG.recipientName} sudah membaca pesanmu.`,
    `Jawabanku: ${answerText}`,
    optionalMessage ? `Pesan tambahan: ${optionalMessage}` : "",
    `— ${CONFIG.recipientName}`
  ].filter(Boolean).join("\n");

  const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});
