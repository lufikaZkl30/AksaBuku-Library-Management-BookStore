var isExpanded = false;

function toggleSinopsis() {
  var sinopsis = document.getElementById('sinopsis');
  var expandBtn = document.getElementById('expand-btn');
  var collapseBtn = document.getElementById('collapse-btn');
  
  if (isExpanded) {
      sinopsis.style.maxHeight = '100px';
      expandBtn.style.display = 'inline-block';
      collapseBtn.style.display = 'none';
  } else {
      sinopsis.style.maxHeight = 'none';
      expandBtn.style.display = 'none';
      collapseBtn.style.display = 'inline-block';
  }
  
  isExpanded = !isExpanded;
}

var expandBtn = document.getElementById('expand-btn');
if (expandBtn) {
  expandBtn.addEventListener('click', toggleSinopsis);
  
  var collapseBtn = document.getElementById('collapse-btn');
  if (collapseBtn) {
    collapseBtn.style.display = 'none';
    collapseBtn.addEventListener('click', toggleSinopsis); 
  }
}