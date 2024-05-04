function addCart(productId) {
    fetch('/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId: productId })
    })
    .then(response => {
        if (response.ok) {
            console.log('Buku berhasil ditambahkan ke keranjang.');
        } else {
            console.error('Gagal menambahkan buku ke keranjang.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}