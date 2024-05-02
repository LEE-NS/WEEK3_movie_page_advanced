// review Data 저장할 map변수
// data는 movieId별로 review를 여러개 가져야함.
// review는 reviewid와 username, userpassword, reviewString(내용)을 가짐
let reviewMap = null;
let deleteButtons = null;
const reviewBox = document.querySelector(".review-box");
const reviewForm = document.querySelector("#reviewForm");

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

// 삭제버튼 클릭시 다른(모든) 비밀번호 입력칸 다지우기
const deleteReviewForm = () => {
  const deleteAnotherReviewForm = document.querySelectorAll(".password-div");
  deleteAnotherReviewForm?.forEach((AnotherReviewForm) =>
    AnotherReviewForm.replaceChildren()
  );
};

// 삭제버튼 클릭 시 삭제해주는 함수
const deleteButtonClickHandler = () => {
  // 가져온 삭제버튼을 순회하면서 click 이벤트 감지
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // 각 버튼 클릭시 review-id라는 key를 가져옴
      const key = e.target.getAttribute("review-id");
      // 가져온 key로 삭제해야될 li node를 찾음
      const li = document.querySelector(`li[key=${key}]`);

      // div 만들고 className 정해줌
      const passwordDiv = document.createElement("div");
      passwordDiv.className = "password-div";

      // 비밀번호 입력할 input 만들고 placeholder,type 정해줌
      const passwordInput = document.createElement("input");
      passwordInput.placeholder = "비밀번호";
      passwordInput.type = "password";

      // 비밀번호 입력 확인 버튼 만들고 text 및 click 이벤트 설정함.
      const passwordConfirmButton = document.createElement("button");
      passwordConfirmButton.innerText = "확인";
      passwordConfirmButton.addEventListener("click", () => {
        /**
         * 현재 비밀번호 입력하는 input은 passwordDiv의 첫번째 자식이므로 가능한 코드
         * 만약 두번째 세번째 등 첫번째가 아니라면 코드변경 필요함
         */
        const inputPassword = passwordDiv.firstChild.value;
        // movieId "2"로 하드코딩
        // 현재 key와 reviewId비교한 데이터의 유저패스워드를 가져옴
        const password = reviewMap
          .get("2")
          .filter((data) => data.reviewId === key)[0].userPassword;
        // 비밀번호가 맞다면
        if (password === inputPassword) {
          // 삭제
          reviewBox.removeChild(li);

          // 하드코딩
          // movieId 가져와서 넣어야할 곳 현재 "2"
          // reviewId와 key가 다른것만 가져옴
          const filteredMap = reviewMap
            .get("2")
            .filter((data) => data.reviewId !== key);
          // reviewMap에 삭제한 리뷰 제외하고 다시 저장함
          reviewMap.set("2", filteredMap);
          // localStorage에 다시 저장함.
          localStorage.setItem("review", JSON.stringify([...reviewMap]));
          alert("삭제되었습니다.");
        } else if (!inputPassword.length) {
          alert("비밀번호를 입력해주세요.");
        } else {
          alert("비밀번호가 틀립니다.");
        }
      });

      // 비밀번호 입력창 닫을 버튼 만들고 text및 click 이벤트 설정함.
      const passwordCancelButton = document.createElement("button");
      passwordCancelButton.innerText = "X";
      passwordCancelButton.addEventListener("click", () => {
        console.log("X");
      });

      // passwordDiv에 input,button들 조합해서 넣음
      passwordDiv.append(
        passwordInput,
        passwordConfirmButton,
        passwordCancelButton
      );

      // 비밀번호 입력창은 1개만 띄울거임(임의로 정함)
      deleteReviewForm();

      // li밑에 비밀번호 입력창 새로 만듬
      li.append(passwordDiv);
    });
  });
};

// review html 만드는 함수
const createReview = ({ reviewId, userName, userPassword, reviewString }) => {
  const temp = `
    <li key=${reviewId}>
      <div>
        <div>${userName}</div>
        <div>${userPassword}</div>
        <div>${reviewString}</div>
      </div>
      <div> 
        <button review-id=${reviewId} class="review-box-delete-button">삭제</button>
      </div>
    </li>
  `;

  // 맨처음 선언한 reviewBox 안에 temp html을 더하면서 생성함.
  reviewBox.innerHTML += temp;

  // 생성할때마다 삭제버튼을 등록하기 위해 매번 다시 가져옴
  deleteButtons = [...document.querySelectorAll(".review-box-delete-button")];
  deleteButtonClickHandler();
};

// DOM이 만들어 진 후 실행되는 함수
document.addEventListener("DOMContentLoaded", () => {
  getMovieReview();

  // 하드코딩
  // movieId 가져와서 넣어야할 곳 현재 "2"
  reviewMap.get("2")?.forEach((data) => {
    createReview(data);
  });
});

// submit 이벤트 발생시 리뷰 등록하는 함수
reviewForm.addEventListener("submit", (e) => {
  // 새로고침 방지
  e.preventDefault();

  const movieId = document.getElementById("movieId").value;
  let reviewUserName = document.querySelector("#reviewUserName");
  let reviewUserPassword = document.querySelector("#reviewUserPassword");
  let reviewArea = document.querySelector("#reviewArea");

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
