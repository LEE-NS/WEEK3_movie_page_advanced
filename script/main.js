//1. 영화 API 이용하여 데이터 들여오기 V
//1-1. 영화 정보 카드리스트 UI (제목, 내용, 이미지, 평점) V
//1-2. 카드 클릭 시 id를 alert로 띄우기 V
//2. 버튼 동작
//2-1. 검색 동작 V
//search action
// 받아온 db에 대해 검색은 어떻게 이루어질까
// 1. input을 통해 사용자가 입력한 텍스트를 받는다.
// 2. 받은 텍스트로 이름을 찾는다. (공백은 무시한다. 한글 1자 이상의 텍스트를 받는다. 자/모음 단독 검색은 불가)
// 3. 찾은 이름의 영화 카드를 리스트업한다.
// 4. 리스트업이 완료되면 화면에 띄운다.

//------------- 상기 목록은 필수 요건------------------

//2-2. 다크모드 (부가) V

/* 카드 리스트 만들기 */
const main = document.querySelector("main");
const body = document.querySelector("body");
const footer = document.querySelector("footer");
const headerNav = document.querySelector("#header-wrap header ul");
const modal = document.querySelector(".modal-wrap");

const spinnerOuter = document.querySelector(".loading-spinner");
const spinnerInner = document.querySelector(".spinner-inner");

let movieListWrap = main.querySelector(".movie-list-wrap");
const SECTIONS = ["now_playing", "popular", "top_rated", "upcoming"];
const listName = document.querySelectorAll(".list-name"); //리스트 타이틀

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMTE4NTdhNTg1MThiOWVjZWRjMzE4ZDVkYjE1OWRkOSIsInN1YiI6IjY2MjhhZmRmNjNkOTM3MDE0YTcyMmMxNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZrKj2Zyb565lbyPKH1RQSzBsq3AYrMAoFe7QZKm-P2Q",
  },
}; // 영화 API 사용자 정보

function searchToTitle(text) {
  const modText = text.toUpperCase().split(" ").join("");
  let allTitles = [];

  SECTIONS.forEach((section) => {
    fetch(
      `https://api.themoviedb.org/3/movie/${section}?language=ko&page=1`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        data["results"].forEach((movie) => {
          let titleData = movie["title"];
          let modTitleData = titleData.toUpperCase().split(" ").join(""); //공백 없는 영화 타이틀
          let titleArrSize = modTitleData.length - modText.length + 1;
          let splitTitle = [];
          for (let j = 0; j < titleArrSize; j++) {
            splitTitle.push(modTitleData.substring(j, j + modText.length));
          }
          if (splitTitle.includes(modText)) {
            allTitles.push(titleData);
          } //입력된 텍스트가 같은 음절 수로 나눠진 대상의 배열에 있다면 results 배열에 넣는다.
        });
      });
  });
  return allTitles;
} //검색 후 중복되어있는 타이틀 배열을 반환하는 함수

function searchResult(allTitles, text) {
  let uniqTitles = allTitles.filter((elem, index) => {
    return allTitles.indexOf(elem) === index;
  }); //중복 요소 제거

  let resultArea = `
    <div class="movie-list-place">
        <h2 class="list-name">'${text}' 에 대한 검색 결과<span class="result-num">${uniqTitles.length}개</span></h2>
        <div class="list-wrap">
            <ul></ul>
        </div>
    </div>
    `;
  movieListWrap.innerHTML = "";
  movieListWrap.innerHTML += resultArea;
  //검색 결과 표시 공간 확보

  SECTIONS.forEach((section) => {
    fetch(
      `https://api.themoviedb.org/3/movie/${section}?language=ko&page=1`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        data["results"].forEach((movie) => {
          let searchResultArea =
            movieListWrap.childNodes[1].childNodes[3].childNodes[1];
          let title = movie["title"];

          if (uniqTitles.includes(title) && uniqTitles.length !== 0) {
            createCard(movie, searchResultArea);
            uniqTitles.splice(uniqTitles.indexOf(title), 1); // 등록이 끝난 요소는 배열에서 제거
          } else if (uniqTitles.length === 0) {
            return; //검색된 결과를 나타낼 것이 없으면 종료
          }
        });
      });
  });
} //searchToTitle(text)로부터 받은 인자로 중복을 없애고 영화 정보를 가져와서 카드로 게시하는 함수

function createCard(movie, target) {
  let movieCard = `
                <li class="movie-card">
                    <img src="https://image.tmdb.org/t/p/w500${
                      movie["backdrop_path"]
                    }" alt="">
                    <h3 class="movie-name">${movie["title"]}</h3>
                    <h4 class="original-name">${movie["original_title"]}</h4>
                    <p class="release-date">${movie["release_date"].slice(
                      0,
                      4
                    )}</p>
                    <p class="movie-detail">${
                      movie["overview"] || "등록된 줄거리가 없습니다."
                    }</p>
                    <p class="movie-rate">⭐&nbsp;${movie[
                      "vote_average"
                    ].toFixed(1)}</p>
                    <p class="movie-id">${movie["id"]}</p>
                </li>
                `;
  target.innerHTML += movieCard;
} // target에 movieCard를 넣어주는 함수

SECTIONS.forEach((section) => {
  function spreadContents(listNum) {
    let listingSection = listName
      .item(listNum)
      .nextSibling.nextSibling.childNodes.item(1);
    fetch(
      `https://api.themoviedb.org/3/movie/${section}?language=ko&page=1`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        data["results"].forEach((movie) => {
          createCard(movie, listingSection);
        });
      });
  } // 들어온 영화 데이터를 카드 형식으로 만들어서 해당 섹션에 배치시켜주는 함수

  switch (section) {
    case "now_playing":
      spreadContents(0);
      break;
    case "popular":
      spreadContents(1);
      break;
    case "top_rated":
      spreadContents(2);
      break;
    case "upcoming":
      spreadContents(3);
      break;
  } // 들어오는 URL의 첫번째 쿼리값(영화 리스트업 조건)에 따라 서로 다른 섹션에 컨텐츠를 배치한다.
}); // 4개의 카테고리의 각 1페이지의 컨텐츠들을 해당 영역에 배치

main.addEventListener("click", (e) => {
  deliverQuery(e);
});
// 영화 카드의 상세 페이지로 이동

const url = new URLSearchParams([
  ["id", null],
  ["mode", "dark"],
]);
// (다크 모드 완성해두기)

function deliverQuery(e) {
  if (e.target.parentNode.className === "movie-card") {
    const movieId = e.target.parentNode.childNodes.item(13).innerText; // 카드에서 id 정보 추출
    URL.set("id", movieId); // URL 객체의 "id" 배열의 1번째 index의 값을 영화 아이디로 지정
    for (const param of url) {
      console.log(param);
    }
    const urlQuery = url.toString(); // 쿼리들을 문자열로 바꾼다.
    location.href = `html/detail.html?${urlQuery}`; // 이동할 페이지에 쿼리들을 적용해준다.

    // 남은 부분 : 쿼리 값을 읽어서 페이지 양식에 맞게
  }
}

/* dynamic button action */
const searchBtn = document.querySelector(".search");
const cancelIcon = searchBtn.querySelector(".fa-xmark");
const magnifyIcon = searchBtn.querySelector(".fa-magnifying-glass");
const totalBtn = document.querySelector(".total");
const darkmodeBtn = document.querySelector(".darkmode");

const inputWrap = document.querySelector(".input-wrap");
const searchInput = inputWrap.querySelector("input");

let isClickedLight = false;
let isClickedSearch = false;

totalBtn.addEventListener("click", () => {
  window.location.reload();
});

searchBtn.addEventListener("click", () => {
  isClickedSearch = !isClickedSearch;
  searchInputToggle(isClickedSearch);
});

darkmodeBtn.addEventListener("click", () => {
  isClickedLight = !isClickedLight;
  if (isClickedLight) {
    headerNav.style.backgroundColor = "#d9d9d9";
    body.style.backgroundColor = "#f1f1f1";
    footer.style.color = "#53464b";

    listName.forEach((elem) => {
      elem.style.color = "#53464b";
    });
  } else {
    headerNav.style.backgroundColor = "#272727";
    body.style.backgroundColor = "#0c0c0c";
    footer.style.color = "#aa9ca1";

    listName.forEach((elem) => {
      elem.style.color = "#b4a0a7";
    });
  }
});

function searchInputToggle(isClickedSearch) {
  if (isClickedSearch) {
    inputWrap.classList.add("input-wrap-toggle");
    cancelIcon.classList.add("cancel-icon-toggle");
    magnifyIcon.classList.add("magnify-icon-toggle");
  } else {
    inputWrap.classList.remove("input-wrap-toggle");
    cancelIcon.classList.remove("cancel-icon-toggle");
    magnifyIcon.classList.remove("magnify-icon-toggle");
  }
}

body.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    inputWrap.classList.remove("input-wrap-toggle");
    cancelIcon.classList.remove("cancel-icon-toggle");
    magnifyIcon.classList.remove("magnify-icon-toggle");
    isClickedSearch = false;
  }
});

let isSpin = false;

function spinner(isSpin) {
  isSpin === !isSpin;
  if (isSpin) {
    spinnerOuter.setAttribute("style", "display: none;");
    spinnerInner.setAttribute("style", "display: none;");
  } else {
    spinnerOuter.setAttribute("style", "display: block;");
    spinnerInner.setAttribute("style", "display: block;");
  }
} // 로딩 스피너 토글

searchInput.addEventListener("keydown", async (e) => {
  // enter : 검색 동작
  if (e.key === "Enter") {
    let text = searchInput.value;
    if (text === "") {
      alert("한 글자 이상 입력해 주세요!");
      searchInput.focus();
      return;
    }
    
    if(text.length > INPUT_VALIDATION_MAX_LENGTH) {
      console.log ("최대 30자까지 입력 가능합니다. 다시 입력해 주세요!");
      return;
    }
    let resultArr = searchToTitle(text);

    spinner(isSpin); // 검색 중인 1초동안 로딩 스피너가 돌아간다.
    setTimeout(() => {
      searchResult(resultArr, text); // 검색 결과 표시
      spinner(!isSpin); // 로딩 스피너 제거
      isClickedSearch = !isClickedSearch;
      searchInputToggle(isClickedSearch); // input 영역 제거
      //검색 버튼 동작 off
    }, 1000);
  }
});

/* searchTotitle이 끝나고 나서 실행 */

// 검색 유효성 검사 기능 구현
const input_Validation = document.querySelector(".input-wrap input"); // 유효성 검사를 위한 인풋창 지정
const input_Wrap= document.querySelector(".input-wrap"); // input-wrap 클래스 선택
const input_Validation_MaxLength = 30; // 인풋 최대 길이 30 설정
const message_Display = document.createElement("div"); // 메세지 표시 div 생성

message_Display.classList.add("message"); // message 클래스 추가

input_Wrap.appendChild(message_Display); // input-wrap 요소에 MESSAGE_DISPLAY 추가
input_Validation.addEventListener("input", function () {
  // input 이벤트에 대한 리스너 추가
  const input_Length = this.value.length; // 이벤트가 발생한 input 요소의 value 길이 측정
  if (input_Length > input_Validation_MaxLength) {
    // 길이가 제한을 초과하는지 확인
    message_Display.textContent = "최대 글자 수를 초과했습니다. 다시 입력해 주세요!";
  } else {
    message_Display.textContent = "";
  }
});
