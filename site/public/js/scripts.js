// Navigation Bar

function contentSwitcher(page) {

  var pages = document.getElementById('body-section').children;
  var currPage = document.getElementById(page);

  for (var p = 0; p < pages.length; p++){
    if (pages[p] === currPage) {
      currPage.style.display = 'block';
    } else {
      pages[p].style.display = 'none';
    }
  }
}
