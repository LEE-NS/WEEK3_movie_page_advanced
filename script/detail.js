let reviewMap = null;
const reviewBox = document.querySelector(".review-box");
const reviewForm = document.querySelector("#reviewForm");

const getMovieReview = () => {
  reviewMap = localStorage.getItem("review") || new Map();
  if (reviewMap.length) {
    reviewMap = new Map(JSON.parse(reviewMap));
  }
};

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

  reviewBox.innerHTML += temp;

  const deleteBtns = [
    ...document.querySelectorAll(".review-box-delete-button"),
  ];

  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const _key = e.target.getAttribute("review-id");
      const li = document.querySelector(`li[key=${_key}]`);
      reviewBox.removeChild(li);
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  getMovieReview();

  // 아이디 가져와서 넣을곳 현재 2임.
  reviewMap.get("2")?.forEach((data) => {
    createReview(data);
  });
});

reviewForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const movieId = document.getElementById("movieId").value;
  let reviewUserName = document.querySelector("#reviewUserName");
  let reviewUserPassword = document.querySelector("#reviewUserPassword");
  let reviewArea = document.querySelector("#reviewArea");

  const userName = reviewUserName.value;
  const userPassword = reviewUserPassword.value;
  const reviewString = reviewArea.value;

  const map = reviewMap.get(movieId);
  let reviewId = "";
  do {
    reviewId = Math.random().toString(36).substring(2, 11);
    console.log(
      reviewId[0],
      typeof reviewId[0],
      Number.isInteger(+reviewId[0])
    );
  } while (Number.isInteger(+reviewId[0]));

  const temp = {
    reviewId,
    userName,
    userPassword,
    reviewString,
  };

  if (map == null) {
    reviewMap.set(movieId, [{ ...temp }]);
  } else {
    reviewMap.set(movieId, [...map, { ...temp }]);
  }

  createReview(temp);
  localStorage.setItem("review", JSON.stringify([...reviewMap]));

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
