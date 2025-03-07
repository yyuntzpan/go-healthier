document.addEventListener('DOMContentLoaded', function () {
  //取全部footer的標籤
  const footerTitles = document.querySelectorAll('.footer_title')

  footerTitles.forEach((title) => {
    title.addEventListener('mouseenter', function () {
      // 顯示當前 hover 的 title 下的 content
      const content = this.parentElement.nextElementSibling
      if (content && content.classList.contains('content')) {
        content.classList.add('active')
      }
    })
  })

  // 沒hover時隱藏所有 content
  const footer = document.querySelector('.mobile_footer')
  footer.addEventListener('mouseleave', function () {
    document.querySelectorAll('.content').forEach((content) => {
      content.classList.remove('active')
    })
  })
})
