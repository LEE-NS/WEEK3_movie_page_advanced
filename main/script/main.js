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
const sections = ["now_playing", "popular", "top_rated", "upcoming"];
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

    sections.forEach((section) => {
        fetch(`https://api.themoviedb.org/3/movie/${section}?language=ko&page=1`, options)
        .then((response) => response.json())
        .then((data) => {
            data['results'].forEach(movie => {
                let titleData = movie['title'];
                let modTitleData = titleData.toUpperCase().split(" ").join(""); //공백 없는 영화 타이틀
                let titleArrSize = modTitleData.length - modText.length + 1;
                let splitTitle = [];
                for (let j = 0; j < titleArrSize; j++) {
                    splitTitle.push(modTitleData.substring(j, j + modText.length));
                };
                if (splitTitle.includes(modText)) {
                    allTitles.push(titleData);
                } //입력된 텍스트가 같은 음절 수로 나눠진 대상의 배열에 있다면 results 배열에 넣는다.
            });
        });
    });
    return allTitles; 
}; //검색 후 중복되어있는 타이틀 배열을 반환하는 함수


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

    sections.forEach((section) => {
        fetch(`https://api.themoviedb.org/3/movie/${section}?language=ko&page=1`, options)
        .then((response) => response.json())
        .then((data) => {
            data['results'].forEach(movie => {
                let searchResultArea = movieListWrap.childNodes[1].childNodes[3].childNodes[1];
                let title = movie['title']

                if (uniqTitles.includes(title) && uniqTitles.length !== 0) {
                    createCard(movie, searchResultArea);
                    uniqTitles.splice(uniqTitles.indexOf(title), 1); // 등록이 끝난 요소는 배열에서 제거
                } else if (uniqTitles.length === 0) {
                    return //검색된 결과를 나타낼 것이 없으면 종료
                }
            });
        });
    });
}; //searchToTitle(text)로부터 받은 인자로 중복을 없애고 영화 정보를 가져와서 카드로 게시하는 함수

function createCard(movie, target) {
    let movieCard = `
                <li class="movie-card">
                    <img src="https://image.tmdb.org/t/p/w500${movie["backdrop_path"]}" alt="">
                    <h3 class="movie-name">${movie["title"]}</h3>
                    <h4 class="original-name">${movie["original_title"]}</h4>
                    <p class="release-date">${movie["release_date"].slice(0, 4)}</p>
                    <p class="movie-detail">${ movie['overview'] || "등록된 줄거리가 없습니다." }</p>
                    <p class="movie-rate">⭐&nbsp;${movie['vote_average'].toFixed(1)}</p>
                    <p class="movie-id">${movie['id']}</p>
                </li>
                `;
    target.innerHTML += movieCard;
}; // target에 movieCard를 넣어주는 함수

sections.forEach((section) => {
    function spreadContents(listNum) {
        let listingSection = listName.item(listNum).nextSibling.nextSibling.childNodes.item(1);
        fetch(`https://api.themoviedb.org/3/movie/${section}?language=ko&page=1`,options)
            .then((response) => response.json())
            .then((data) => {
                data['results'].forEach(movie => {
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
    if (e.target.parentNode.className === "movie-card") {
        console.log(e.target.parentNode);

        const movieName = e.target.parentNode.childNodes.item(3).innerText;
        const movieId = e.target.parentNode.childNodes.item(13).innerText;

        let modalMovieName = modal.querySelector(".m-name");
        let modalMovieId = modal.querySelector(".m-id");
        let modalConfirm = modal.querySelector(".confirm");

        modal.style.display = "block";
        modalMovieName.innerHTML += `'${movieName}'`;
        modalMovieId.innerHTML += movieId;

        modalConfirm.addEventListener("click", () => {
            modalMovieName.innerHTML = "";
            modalMovieId.innerHTML = "";
            modal.style.display = "none";
        });
    } // 클릭한 타켓의 부모노드의 클래스 이름이 "movie_card" 일때만 alert 출력 (다른 곳을 이벤트 발생 시 콘솔에 출력되는 오류 방지)
});
// 영화 카드의 ID 출력

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
        inputWrap.classList.add('input-wrap-toggle')
        cancelIcon.classList.add('cancel-icon-toggle')
        magnifyIcon.classList.add('magnify-icon-toggle')
    } else {
        inputWrap.classList.remove('input-wrap-toggle')
        cancelIcon.classList.remove('cancel-icon-toggle')
        magnifyIcon.classList.remove('magnify-icon-toggle')
    }
}

body.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        inputWrap.classList.remove('input-wrap-toggle')
        cancelIcon.classList.remove('cancel-icon-toggle')
        magnifyIcon.classList.remove('magnify-icon-toggle')
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
            alert("검색어를 입력해주세요");
            searchInput.focus();
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
    };
});

/* searchTotitle이 끝나고 나서 실행 */

