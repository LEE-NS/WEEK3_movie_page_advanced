let openCloseBtn = document.querySelector('.openClose');
let inputBtn = document.querySelector('.inputBtn');

let deleteBtn = document.querySelectorAll('.deleteBtn');
let commentCount = document.querySelector('.count');
let commentCard = document.querySelectorAll('.commentCard');

// 삭제 버튼
for (let i = 0; i < deleteBtn.length; i++) {
  deleteBtn[i].addEventListener('click', () => {
    let passwordInput = prompt('비밀번호를 입력해주세요.', '');
    if (Number(passwordInput) === 1234) {
      alert('비밀번호가 같습니다.');
    } else {
      alert('비밀번호가 다릅니다.');
    }
  });
}

// 댓글 수량 확인
for (let i = 0; i < commentCard.length; i++) {
  commentCount.innerText = commentCard.length;
}

// 댓글 애니메이션 버튼
openCloseBtn.addEventListener('click', () => {
  move();
});

// 댓글 등록 유효성 검사
inputBtn.addEventListener('click', () => {
  let userId = document.getElementById('userId').value;
  let userPassword = document.getElementById('userPassword').value;
  let comment = document.querySelector('.comment').value;

  if (userId.length < 2) {
    alert('아이디는 2글자 이상 입력해주세요.');
  } else if (userPassword.length < 6) {
    alert('비밀번호는 6글자 이상 입력해주세요.');
  } else if (comment === '') {
    alert('내용을 입력해주세요.');
  }
});

// 댓글 애니메이션
let move = () => {
  let button = document.querySelector('.openClose');
  let showComment = button.getAttribute('data-open') === 'true';
  button.setAttribute('data-open', !showComment);
  let commentBox = document.querySelector('.commentBox');

  if (showComment) {
    commentBox.style.display = 'block';
    button.innerText = '>';
    setTimeout(() => {
      commentBox.classList.add('close');
      commentBox.classList.remove('open');
    }, 100);
  } else {
    commentBox.classList.add('open');
    commentBox.classList.remove('close');
    button.innerText = '<';
    setTimeout(() => {
      commentBox.style.display = 'none';
    }, 1800);
  }
};
