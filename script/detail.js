// 뒤로가기 함수
function backSpace() {
  window.history.back();
}

// 뒤로가기 기능
document.querySelector(".backBtn").addEventListener("click", function () {
  backSpace();
});

//query에서 id값 읽어오기
const url = new URL(location.href); // 현재 페이지의 url을 url에 저장
const urlParams = url.searchParams; // urlParams에 현재 url의 파라미터 저장
const movieId = urlParams.get("id"); // urlParams에서 "id"에 해당하는 값을 가져온다.
console.log(movieId);

const SECTIONS = ["now_playing", "popular", "top_rated", "upcoming"];
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMTE4NTdhNTg1MThiOWVjZWRjMzE4ZDVkYjE1OWRkOSIsInN1YiI6IjY2MjhhZmRmNjNkOTM3MDE0YTcyMmMxNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZrKj2Zyb565lbyPKH1RQSzBsq3AYrMAoFe7QZKm-P2Q",
  },
};

SECTIONS.forEach((section) => {
  fetch(
    `https://api.themoviedb.org/3/movie/${section}?language=ko&page=1`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      data["results"].forEach((movie) => {
        if (movie["id"] === movieId) {
          console.log(movie["id"]);
        }
      });
    });
});
