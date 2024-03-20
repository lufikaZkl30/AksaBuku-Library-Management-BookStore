let submitForm = document.getElementById("submitForm");

    submitForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let name = document.getElementById("name");
    let email = document.getElementById("email");
    let subjek = document.getElementById("subjek");
    let comment = document.getElementById("comment");

    if (name.value == "" || email.value == "" || subjek.value == "" || comment.value == "") {
        alert("Pastikan telah mengisi semua data!");
    } else {
        alert("Terima kasih telah menghubungi kami! Secepatnya kami akan membalas pesan anda.");

    name.value = "";
    email.value = "";
    subjek.value = "";
    comment.value = "";
    }
});