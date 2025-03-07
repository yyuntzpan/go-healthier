//動態比對新密碼和確認密碼，並根據不同的輸入狀況顯示相應的圖示和錯誤訊息

document.addEventListener('DOMContentLoaded', function () {
  const newPasswordInput = document.getElementById('new_password')
  const confirmPasswordInput = document.getElementById('confirm_password')
  const myicon = document.querySelector('.myicon')
  const errorMessage = document.querySelector('.erro_message')

  //四種icon替換的functiion
  //<i class="fa-solid fa-circle-check"></i>勾勾
  // <i class="fa-solid fa-circle-exclamation">驚嘆號
  // <i class="fa-solid fa-eye"></i>睜眼
  // <i class="fa-solid fa-eye-slash"></i>閉眼
  function updateIcon(className) {
    const icon = myicon.querySelector('i')
    icon.className = 'fa-solid ' + className
  }

  //一開始，甚麼都沒輸入時先隱藏icon們
  myicon.style.display = 'none'

  //讓icon們根據不同狀況出現
  function updateIconAndErrorMessage() {
    //若input有被輸入，就會出現icon
    if (confirmPasswordInput.value) {
      myicon.style.display = 'block'

      //若第二次輸入的密碼與新密碼相同，出現勾勾
      if (newPasswordInput.value === confirmPasswordInput.value) {
        errorMessage.style.display = 'none'
        updateIcon('fa-circle-check')
      }
      //若第二次輸入的密碼與新密碼不同，出現驚嘆號及錯誤訊息
      else if (newPasswordInput.value !== confirmPasswordInput.value) {
        errorMessage.style.display = 'block'
        updateIcon('fa-circle-exclamation')
      } else {
        errorMessage.style.display = 'none'
        //讓眼睛圖式隨著input狀態變換
        updateIcon(
          confirmPasswordInput.type === 'password' ? 'fa-eye-slash' : 'fa-eye'
        )
      }
      //若input都沒有被輸入，則都不出現
    } else {
      myicon.style.display = 'none'
      errorMessage.style.display = 'none'
    }
  }

  confirmPasswordInput.addEventListener('input', updateIconAndErrorMessage)
  newPasswordInput.addEventListener('input', updateIconAndErrorMessage)

  //icon被點擊時的狀況
  myicon.addEventListener('click', function (e) {
    e.preventDefault()
    if (confirmPasswordInput.type === 'password') {
      confirmPasswordInput.type = 'text'
      updateIcon('fa-eye')
    } else {
      confirmPasswordInput.type = 'password'
      updateIcon('fa-eye-slash')
    }
  })
})
