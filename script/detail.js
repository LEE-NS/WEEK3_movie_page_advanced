let reviewMap = null;

const getMovieReview = () => {
  reviewMap = localStorage.getItem("review") || new Map();

  if (reviewMap.length) {
    reviewMap = new Map(JSON.parse(reviewMap));
  }
};

const createReview = ({ userName, userPassword, reviewString }) => {
  const reviewBox = document.querySelector(".review-box");

  const temp = `
    <li>
      <div>${userName}</div>
      <div>${userPassword}</div>
      <div>${reviewString}</div>
    </li>
  `;

  reviewBox.innerHTML += temp;
};

document.addEventListener("DOMContentLoaded", () => {
  getMovieReview();

  reviewMap.get("2")?.forEach((data) => {
    createReview(data);
  });
});

const reviewButton = document.querySelector("#reviewForm");

reviewButton.addEventListener("submit", (e) => {
  e.preventDefault();

  const movieId = document.getElementById("movieId").value;
  let reviewUserName = document.querySelector("#reviewUserName");
  let reviewUserPassword = document.querySelector("#reviewUserPassword");
  let reviewArea = document.querySelector("#reviewArea");

  const userName = reviewUserName.value;
  const userPassword = reviewUserPassword.value;
  const reviewString = reviewArea.value;

  const map = reviewMap.get(movieId);
  const reviewId = map?.length || 0;

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
