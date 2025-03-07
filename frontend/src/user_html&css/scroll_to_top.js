window.onscroll = function () {
  var button = document.getElementById('back-to-top')
  if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
    button.style.display = 'block'
  } else {
    button.style.display = 'none'
  }
}

// Smooth scroll to top function
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
