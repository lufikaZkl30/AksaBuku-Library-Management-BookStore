function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
}

document.querySelectorAll('.price').forEach(item => {
  const price = parseFloat(item.textContent);
  item.textContent = formatCurrency(price);
});
