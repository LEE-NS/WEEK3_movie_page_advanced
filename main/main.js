const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZTQ5N2Q0MDIyOGJlZTk1NDU5ZDg1ZWZjMmJmMDViYiIsInN1YiI6IjY2MjVkOGUzMjIxYmE2MDE3YzE1NDFlMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.keiIpGDChWtbTznZMR_4txVLkOE7q2avZ8AYrC1ILsU',
    }
}

fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
    .then(response => response.json())
    .then(response => {
        console.log(response);
        let topMovies = response.results;
        showMovieList(topMovies); // TMDB 사이트 result 배열 가져오기
    })
    .catch(err => console.error(err));


// html에 영화 리스트 카드 만들기 
function showMovieList(movies) {
    const movieListBox = document.querySelector('.movieList');
    movieListBox.innerHTML = ""; // innerHTML = "";을 써줌으로써 본격적으로 아래에서 카드를 반환하기 전에 빈 화면 선언

    movies.forEach(movie => {
        let movieCard = document.createElement('div'); // div 만들어 주기
        movieCard.classList.add('card'); // 위에 생성한 div에 클래스 card 부여
        movieCard.innerHTML = `
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}"></img>  
                    <h4 class="movieTitle">${movie.title}</h4>
                        <p class="overView">영화 줄거리<br><br>${movie.overview}</p>
                        <p class="rating">👍평점:${movie.vote_average}</p>
                    </div>
                </div>`;
        // 영화 클릭 시 해당 영화 id 알럿창
        movieCard.addEventListener('click', function () {
            alert("영화 ID=" + `${movie.id}`);
        })
        movieListBox.appendChild(movieCard);
    })
};


// 필요한 변수들 선언하기
const searchInput = document.getElementById('searchInput'); // 인풋창 지정
const word = document.querySelector('.movieTitle');
// 검색 인풋창 입력 시 이벤트 리스너 추가
searchInput.addEventListener('input', function () {
    const searchVal = searchInput.value.trim().toLowerCase(); // 밸류를 공백을 제거하고 소문자로 변환함
    const filter = filters(searchVal); // 필터 해주는 변수 선언 
});
console.log("검색 이벤트리스너 부분 문제 없음") // 여기까진 문제 없는 듯?

// 필터 함수 구현
function filters(searchVal) {
    const movieCards = document.querySelectorAll('.card');
    movieCards.forEach(card => {
        const title = card.querySelector('.movieTitle').textContent.toLowerCase(); // 영화 제목을 소문자로 변환하여 가져옴
        if (title.includes(searchVal)) {
            card.style.display = 'block'; // true = 해당 카드 출력
        } else {
            card.style.display = 'none'; // false = 이외 카드 숨김
        }
    });
}