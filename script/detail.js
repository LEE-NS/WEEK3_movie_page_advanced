// review Data 저장할 map변수
// data는 movieId별로 review를 여러개 가져야함.
// review는 reviewId,userIdValue,userPasswordValue,userCommentValue,(내용)을 가짐
let reviewMap = null;
let deleteButtons = null;
let updateButtons = null;

const reviewBox = document.querySelector(".review-list");
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

// textarea 개행 포멧팅
const convertText = (text, before, after) => {
  let output = "";
  const arr = text.split(before);

  for (let i = 0; i < arr.length; i++) {
    output += `${arr[i]}${i < arr.length - 1 ? after : ""}`;
  }

  return output;
};
// 삭제 및 수정 버튼 클릭 시
const buttonClickHandler = (buttons, buttonType) => {
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // 각 버튼 클릭시 review-id라는 key를 가져옴
      const key = e.target.getAttribute("review-id");
      // 가져온 key로 삭제해야될 li node를 찾음
      const reviewCard = document.querySelector(`li[key=${key}]`);
      // li안에 카드정보를 담고 있는 div
      const reviewCardInfo = reviewCard.querySelector(".review-card-info");
      // 유저가 입력한 password
      const inputPassword = reviewCardInfo.childNodes[3].value;
      const thisMap = reviewMap
        .get(movieId)
        .filter((data) => data.reviewId === key)[0];
      // 저장되어있는 review password
      const reviewPassword = thisMap.userPasswordValue;

      const checkReviewPassword = reviewCard.querySelector(
        ".review-check-password"
      );

      if (inputPassword === reviewPassword) {
        if (buttonType === "delete") {
          // reviewId와 key가 다른것만 가져옴
          const filteredMap = reviewMap
            .get(movieId)
            .filter((data) => data.reviewId !== key);

          // reviewMap에 삭제하고 다시 저장
          reviewMap.set(movieId, filteredMap);
          // localStorage에 삭제하고 다시 저장
          localStorage.setItem("review", JSON.stringify([...reviewMap]));
          // reviewBox에서 li지워서 새로고침안해도 바로 삭제되는게 보이게함
          reviewBox.removeChild(reviewCard);

          alert("삭제되었습니다.");
        } else {
          // 리뷰내용과 유효성검사한거 숨김
          checkReviewPassword.style.display = "none";
          const reviewContentBox = reviewCard.querySelector(
            ".review-content-box"
          );
          reviewContentBox.style.display = "none";
          const reviewContentValue = thisMap.userCommentValue;
          // update box 조립
          const reviewUpdateBox = document.createElement("div");
          reviewUpdateBox.className = "review-update-box";

          const reviewUpdateTextarea = document.createElement("textarea");
          reviewUpdateTextarea.className = "review-update-textarea";
          reviewUpdateTextarea.value = convertText(
            reviewContentValue,
            "<br/>",
            "\n"
          );
          const textareaRow = reviewUpdateTextarea.value.split("\n").length;
          reviewUpdateTextarea.rows = textareaRow;
          reviewUpdateTextarea.addEventListener("input", () => {
            reviewUpdateTextarea.style.height = "auto";
            reviewUpdateTextarea.style.height =
              reviewUpdateTextarea.scrollHeight + `px`;
          });
          const reviewButtonBox = document.createElement("div");
          reviewButtonBox.className = "review-button-box";

          const reviewButtonUpdate = document.createElement("button");
          reviewButtonUpdate.className = "review-button-update";
          reviewButtonUpdate.type = "button";
          reviewButtonUpdate.innerText = "확인";
          reviewButtonUpdate.addEventListener("click", () => {
            const reviewContent =
              reviewContentBox.querySelector(".review-content");
            reviewContent.innerHTML = convertText(
              reviewUpdateTextarea.value,
              "\n",
              "<br/>"
            );
            reviewMap
              .get(movieId)
              .find((data) => data.reviewId === key).userCommentValue =
              convertText(reviewUpdateTextarea.value, "<br/>", "\n");
            localStorage.setItem("review", JSON.stringify([...reviewMap]));
            reviewContentBox.style.display = "block";
            reviewCard.removeChild(reviewUpdateBox);
          });

          const reviewButtonCancel = document.createElement("button");
          reviewButtonCancel.className = "review-button-delete";
          reviewButtonCancel.type = "button";
          reviewButtonCancel.innerText = "취소";
          reviewButtonCancel.addEventListener("click", () => {
            reviewContentBox.style.display = "block";
            reviewCard.removeChild(reviewUpdateBox);
          });

          reviewButtonBox.append(reviewButtonUpdate, reviewButtonCancel);
          reviewUpdateBox.append(reviewUpdateTextarea, reviewButtonBox);
          reviewCard.insertAdjacentElement("beforeend", reviewUpdateBox);

          // reviewContent.textContent = input.value;
        }
      } else if (!inputPassword.length) {
        checkReviewPassword.innerText = "비밀번호를 입력해주세요.";
        checkReviewPassword.style.display = "block";
      } else {
        checkReviewPassword.innerText = "비밀번호가 다릅니다.";
        checkReviewPassword.style.display = "block";
      }
    });
  });
};

// review html 만드는 함수
const createReview = ({ reviewId, userIdValue, userCommentValue }) => {
  // 이름 18자 까지만
  const html = `
    <li key=${reviewId} class="review-card">
      <div class="review-card-info">
        <h4 id="userName">${userIdValue}</h4>
        <input
          id="review-input-password"
          type="password"
          placeholder="비밀번호"
        />
      </div>
      <p class="review-check-password"></p>
      <div class="review-content-box">
        <div class="review-content-main">
          <p class="review-content">${convertText(
            userCommentValue,
            "\n",
            "<br/>"
          )}</p>
        </div>
        <div class="review-button-box">
          <button review-id=${reviewId} class="review-button-update" type="button">수정</button>
          <button review-id=${reviewId} class="review-button-delete" type="button">삭제</button>
        </div>
      </div>
    </li>
  `;

  // 맨처음 선언한 reviewBox 안에 temp html을 더하면서 생성함.
  reviewBox.innerHTML += html;

  // 생성할때마다 삭제, 수정버튼을 등록하기 위해 매번 다시 가져옴
  deleteButtons = [...document.querySelectorAll(".review-button-delete")];
  updateButtons = [...document.querySelectorAll(".review-button-update")];

  buttonClickHandler(deleteButtons, "delete");
  buttonClickHandler(updateButtons, "update");
};

// DOM이 만들어 진 후 실행되는 함수
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("mode") !== "dark") {
    body.classList.add("light");
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

  let userId = document.querySelector("#userId");
  let userPassword = document.querySelector("#userPassword");
  let userComment = document.querySelector("#userComment");
  let checkMsg = document.querySelector(".checkMsg");

  const userIdValue = userId.value;
  const userPasswordValue = userPassword.value;
  const userCommentValue = userComment.value;
  // 댓글 등록 유효성 검사
  if (userIdValue.length < 2) {
    checkMsg.innerText = "아이디는 2글자 이상 입력해주세요.";
    checkMsg.style.display = "block";
    return null;
  } else if (userPasswordValue.length < 6) {
    checkMsg.innerText = "비밀번호는 6자 이상 입력해주세요.";
    checkMsg.style.display = "block";
    return null;
  } else if (!userCommentValue.length) {
    checkMsg.innerText = "내용을 입력해주세요.";
    checkMsg.style.display = "block";
    return null;
  } else {
    checkMsg.style.display = "none";
  }

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
    userIdValue,
    userPasswordValue,
    userCommentValue,
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
  userId.value = "";
  userPassword.value = "";
  userComment.value = "";
});

// 뒤로가기 함수
function backSpace() {
  window.history.back();
}

// 뒤로가기 기능
document.querySelector(".backBtn").addEventListener("click", function () {
  backSpace();
});
