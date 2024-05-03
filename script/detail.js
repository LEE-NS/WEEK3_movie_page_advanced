// review Data 저장할 map변수
// data는 movieId별로 review를 여러개 가져야함.
// review는 reviewid와 username, userpassword, reviewString(내용)을 가짐
let reviewMap = null;
let deleteButtons = null;
let updateButtons = null;

const reviewBox = document.querySelector(".review-box");
const reviewForm = document.querySelector("#reviewForm");

const url = new URL(location.href); // 현재 페이지의 url을 url에 저장
const urlParams = url.searchParams; // urlParams에 현재 url의 파라미터 저장
const movieId = urlParams.get("id"); // urlParams에서 "id"에 해당하는 값을 가져온다.

const body = document.querySelector("body");

// localStorage에 저장되어있는 review data를 가져오는 함수
const getMovieReview = () => {
  // localStorage에 없으면 new Map()으로 만듬

  reviewMap = localStorage.getItem("review") || new Map();

  // 길이가 있다는것은 데이터가 있다는것
  if (reviewMap.length) {
    // localStorage에서 가져올땐 js객체로 가져오기 위해 JSON.parse로 가져옴
    reviewMap = new Map(JSON.parse(reviewMap));
  }
};

// 삭제버튼 클릭시 다른(모든) 비밀번호 입력칸(password-box 자식) 다지우기
const deleteReviewForm = () => {
  const deleteAnotherReviewForm = document.querySelectorAll(
    ".review-password-box"
  );
  deleteAnotherReviewForm?.forEach((AnotherReviewForm) =>
    AnotherReviewForm.replaceChildren()
  );
};

// passwordDiv 생성 함수
const createPasswordDiv = (confirmHandler, key, li, buttonType) => {
  // div 만들고 className 정해줌

  const passwordDiv = document.createElement("div");
  passwordDiv.className = "password-div";

  // 비밀번호 입력할 input 만들고 placeholder,type 정해줌
  const passwordInput = document.createElement("input");
  passwordInput.id = "review-password";
  passwordInput.placeholder = "비밀번호";
  passwordInput.type = "password";

  // 비밀번호 입력 확인 버튼 만들고 text 및 click 이벤트 설정함.
  const passwordConfirmButton = document.createElement("button");
  passwordConfirmButton.innerText = "확인";
  passwordConfirmButton.addEventListener("click", () =>
    confirmHandler(passwordDiv, key, li, buttonType)
  );

  // 비밀번호 입력창 닫을 버튼 만들고 text및 click 이벤트 설정함.

  const passwordCancelButton = document.createElement("button");
  passwordCancelButton.innerText = "X";
  passwordCancelButton.addEventListener("click", () => deleteReviewForm());

  // passwordDiv에 input,button들 조합해서 넣음
  passwordDiv.append(
    passwordInput,
    passwordConfirmButton,
    passwordCancelButton
  );
  return passwordDiv;
};

// update 로직이 있는 함수
const isUpdate = (li, key) => {
  // 수정

  console.log("update");

  const filteredReviewData = reviewMap
    .get(movieId)
    .filter((data) => data.reviewId === key)[0];
  deleteReviewForm();

  const passwordDiv = document.createElement("div");
  passwordDiv.className = "password-div";

  const input = document.createElement("input");
  input.value = filteredReviewData.reviewString;
  input.className = "update-test";

  const updateConfirmButton = document.createElement("button");
  updateConfirmButton.innerText = "확인";
  updateConfirmButton.addEventListener("click", () => {
    const reviewContent = li.querySelector(".review-content");
    const input = li.querySelector(".update-test");

    reviewContent.textContent = input.value;
    reviewMap.get(movieId).find((data) => data.reviewId === key).reviewString =
      input.value;
    // console.log(reviewMap);

    localStorage.setItem("review", JSON.stringify([...reviewMap]));
    deleteReviewForm();
    alert("리뷰가 수정되었습니다.");
  });

  passwordDiv.append(input, updateConfirmButton);
  li.querySelector(".review-password-box").append(passwordDiv);
};

// delete 로직이 있는 함수
const isDelete = (li, key) => {
  // 삭제

  console.log("delete");

  reviewBox.removeChild(li);
  // reviewId와 key가 다른것만 가져옴
  const filteredMap = reviewMap
    .get(movieId)
    .filter((data) => data.reviewId !== key);
  // reviewMap에 삭제한 리뷰 제외하고 다시 저장함
  reviewMap.set(movieId, filteredMap);
  // localStorage에 다시 저장함.

  localStorage.setItem("review", JSON.stringify([...reviewMap]));
  alert("삭제되었습니다.");
};

// delete와 update handler
const deleteAndUpdateHandler = (div, key, li, buttonType) => {
  /**
   * 현재 비밀번호 입력하는 input은 passwordDiv의 첫번째 자식이므로 가능한 코드
   * 만약 두번째 세번째 등 첫번째가 아니라면 코드변경 필요함
   */
  const inputPassword = div.firstChild.value;
  // 현재 key와 reviewId비교한 데이터의 유저패스워드를 가져옴
  const password = reviewMap
    .get(movieId)
    .filter((data) => data.reviewId === key)[0].userPassword;
  // 비밀번호가 맞다면
  if (password === inputPassword) {
    if (buttonType === "delete") {
      isDelete(li, key);
    } else {
      isUpdate(li, key);
    }
  } else if (!inputPassword.length) {
    alert("비밀번호를 입력해주세요.");
  } else {
    alert("비밀번호가 틀립니다.");
  }
};

// 삭제 및 수정 버튼 클릭 시
const buttonClickHandler = (buttons, buttonType = "delete") => {
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // 각 버튼 클릭시 review-id라는 key를 가져옴
      const key = e.target.getAttribute("review-id");
      // 가져온 key로 삭제해야될 li node를 찾음
      const li = document.querySelector(`li[key=${key}]`);
      const div = createPasswordDiv(
        deleteAndUpdateHandler,
        key,
        li,
        buttonType
      );
      deleteReviewForm();
      // li밑에 비밀번호 입력창 새로 만듬
      li.querySelector(".review-password-box").append(div);
      li.querySelector(".review-password-box").append(div);
    });
  });
};

// review html 만드는 함수
const createReview = ({ reviewId, userName, userPassword, reviewString }) => {
  const temp = `
    <li key=${reviewId}>
      <div>
        <div class="reviewer">${userName}</div>
        <div>${userPassword}</div>
        <div class="review-content">${reviewString}</div>
      </div>
      <div> 
        <button review-id=${reviewId} class="review-box-delete-button">삭제</button>
        <button review-id=${reviewId} class="review-box-update-button">수정</button>
      </div>
      <div class="review-password-box">
      </div>
    </li>
  `;

  // 맨처음 선언한 reviewBox 안에 temp html을 더하면서 생성함.
  reviewBox.innerHTML += temp;

  // 생성할때마다 삭제, 수정버튼을 등록하기 위해 매번 다시 가져옴
  deleteButtons = [...document.querySelectorAll(".review-box-delete-button")];
  updateButtons = [...document.querySelectorAll(".review-box-update-button")];

  buttonClickHandler(deleteButtons);
  buttonClickHandler(updateButtons, "update");
};

// DOM이 만들어 진 후 실행되는 함수
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("mode") !== "dark") {
    body.classList.add("light")
  } // 페이지 진입 시 화면 모드 결정

  getMovieReview();

  reviewMap.get(movieId)?.forEach((data) => {
    createReview(data);
  });
});

// submit 이벤트 발생시 리뷰 등록하는 함수
reviewForm.addEventListener("submit", (e) => {
  // 새로고침 방지
  e.preventDefault();

  let reviewUserName = document.querySelector("#reviewUserName");
  let reviewUserPassword = document.querySelector("#reviewUserPassword");
  let reviewArea = document.querySelector("#reviewArea");

  console.log(reviewUserName);
  const userName = reviewUserName.value;
  const userPassword = reviewUserPassword.value;
  const reviewString = reviewArea.value;

  // movieId를 key로써 map에 접근해서 데이터 가져옴
  const map = reviewMap.get(movieId);

  let reviewId = "";
  // reviewId는 랜덤한 값으로 설정함
  // 근데 li의 key로써 쓰려면 숫자로 시작하면 안됨
  // 그래서 숫자로 시작하는지 do-while 돌면서 확인함
  do {
    reviewId = Math.random().toString(36).substring(2, 11);
  } while (Number.isInteger(+reviewId[0]));

  // 새로 만든 리뷰 객체
  const temp = {
    reviewId,
    userName,
    userPassword,
    reviewString,
  };

  // map이 비어있다는건 review가 없다는 것, 즉 첫 리뷰
  if (map == null) {
    reviewMap.set(movieId, [{ ...temp }]);
  } else {
    // map이 있으면 기존꺼에 temp를 붙여줌
    reviewMap.set(movieId, [...map, { ...temp }]);
  }

  // reivew 생성
  createReview(temp);

  // localStorage에 data 저장
  // localStorage는 js객체를 저장못함, 그래서 저장할수있게 변경해야함
  localStorage.setItem("review", JSON.stringify([...reviewMap]));

  // 저장 후 input들 비워줌
  reviewUserName.value = "";
  reviewUserPassword.value = "";
  reviewArea.value = "";
});

// 뒤로가기 함수
function backSpace() {
  window.history.back();
}

// 뒤로가기 기능

document.querySelector(".backBtn").addEventListener("click", function () {
  backSpace();
});