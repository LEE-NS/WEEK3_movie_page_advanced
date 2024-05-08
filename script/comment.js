let openCloseBtn = document.querySelector('.review-open-close-button');
let inputBtn = document.querySelector('.inputBtn');
let commentCount = document.querySelector('.count');
let reviewCard = document.querySelectorAll('.review-card');

// 삭제, 수정 버튼 중복된 부분 꺼내온 후 함수로 추출
function btnEvent(idx) {
  let commentPassword = document.querySelectorAll('#commentPassword');
  let checkPassword = document.querySelectorAll('.checkPassword');

  if (Number(commentPassword[idx].value) === 1234) {
    alert('비밀번호가 없습니다');
    checkPassword[idx].style.display = 'none';
    commentPassword[idx].value = '';
  } else {
    checkPassword[idx].innerHTML = '비밀번호가 다릅니다';
    checkPassword[idx].style.display = 'block';
  }
}

// 댓글 애니메이션 버튼
openCloseBtn.addEventListener('click', () => {
  move();
});

// 댓글 애니메이션
let move = () => {
  let button = document.querySelector('.review-open-close-button');
  let is_CommentBtn = button.getAttribute('data-open') === 'true';
  button.setAttribute('data-open', !is_CommentBtn);
  let bodyBox = document.querySelector('.review');
  let commentBox = document.querySelector('.review-main');

  if (is_CommentBtn) {
    commentBox.style.display = 'block';
    // button.innerText = ">";
    button.style.backgroundImage = 'url(../image/commentBtn_right.png)';
    bodyBox.classList.add('open');
    bodyBox.classList.remove('close');
  } else {
    bodyBox.classList.add('close');
    bodyBox.classList.remove('open');
    button.style.backgroundImage = 'url(../image/commentBtn_left.png)';
    // button.innerText = "<";
    setTimeout(() => {
      // commentBox.style.display = "none";
    }, 1100);
  }
};
