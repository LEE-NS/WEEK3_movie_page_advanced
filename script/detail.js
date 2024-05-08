// review Data 저장할 map변수
// data는 movieId별로 review를 여러개 가져야함.
// review는 reviewId,userIdValue,userPasswordValue,userCommentValue,(내용)을 가짐
let reviewMap = null;
let deleteButtons = null;
let updateButtons = null;

const reviewBox = document.querySelector('.review-list');
const reviewForm = document.querySelector('#reviewForm');

const url = new URL(location.href); // 현재 페이지의 url을 url에 저장
const urlParams = url.searchParams; // urlParams에 현재 url의 파라미터 저장
const movieId = urlParams.get('id'); // urlParams에서 "id"에 해당하는 값을 가져온다.

const body = document.querySelector('body');

// localStorage에 저장되어있는 review data를 가져오는 함수
const getMovieReview = () => {
  // localStorage에 없으면 new Map()으로 만듬
  reviewMap = localStorage.getItem('review') || new Map();

  // 길이가 있다는것은 데이터가 있다는것
  if (reviewMap.length) {
    // localStorage에서 가져올땐 js객체로 가져오기 위해 JSON.parse로 가져옴
    reviewMap = new Map(JSON.parse(reviewMap));
  }
};

// textarea 개행 포멧팅
const convertText = (text, before, after) => {
  let output = '';
  const arr = text.split(before);

  for (let i = 0; i < arr.length; i++) {
    output += `${arr[i]}${i < arr.length - 1 ? after : ''}`;
  }

  return output;
};
// 삭제 및 수정 버튼 클릭 시
const buttonClickHandler = (buttons, buttonType) => {
  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      // 각 버튼 클릭시 review-id라는 key를 가져옴
      const key = e.target.getAttribute('review-id');
      // 가져온 key로 삭제해야될 li node를 찾음
      const reviewCard = document.querySelector(`li[key=${key}]`);
      // 유저가 입력한 password
      let inputPassword = reviewCard.querySelector('#review-input-password');
      let inputPasswordValue = inputPassword.value;
      const thisMap = reviewMap
        .get(movieId)
        .filter((data) => data.reviewId === key)[0];
      // 저장되어있는 review password
      const reviewPassword = thisMap.userPasswordValue;

      const checkReviewPassword = reviewCard.querySelector(
        '.review-check-password'
      );

      if (inputPasswordValue === reviewPassword) {
        checkReviewPassword.style.display = 'none';
        inputPassword.value = '';
        if (buttonType === 'delete') {
          // 삭제
          // reviewId와 key가 다른것만 가져옴
          const filteredMap = reviewMap
            .get(movieId)
            .filter((data) => data.reviewId !== key);

          // reviewMap에 삭제하고 다시 저장
          reviewMap.set(movieId, filteredMap);
          // localStorage에 삭제하고 다시 저장
          localStorage.setItem('review', JSON.stringify([...reviewMap]));
          // reviewBox에서 li지워서 새로고침안해도 바로 삭제되는게 보이게함
          reviewBox.removeChild(reviewCard);

          alert('삭제되었습니다.');
        } else {
          // 수정
          // 리뷰내용과 유효성검사한거 숨김
          checkReviewPassword.style.display = 'none';
          const reviewContentBox = reviewCard.querySelector(
            '.review-content-box'
          );
          reviewContentBox.style.display = 'none';
          const reviewContentValue = thisMap.userCommentValue;
          // 별점 조절할 수 있게 함.
          const reviewUpdateRatingInput = reviewCard.querySelector(
            '.review-card-rating input'
          );
          const reviewpdateRatingStar = reviewCard.querySelector(
            '.review-card-rating .review-star'
          );

          reviewUpdateRatingInput.addEventListener('input', () => {
            reviewpdateRatingStar.style.width = `${
              reviewUpdateRatingInput.value * 10
            }%`;
          });
          // update box 조립
          const reviewUpdateBox = document.createElement('div');
          reviewUpdateBox.className = 'review-update-box';

          const reviewUpdateTextarea = document.createElement('textarea');
          reviewUpdateTextarea.className = 'review-update-textarea';
          reviewUpdateTextarea.value = convertText(
            reviewContentValue,
            '<br/>',
            '\n'
          );
          const textareaRow = reviewUpdateTextarea.value.split('\n').length;
          reviewUpdateTextarea.rows = textareaRow;
          reviewUpdateTextarea.addEventListener('input', () => {
            reviewUpdateTextarea.style.height = 'auto';
            reviewUpdateTextarea.style.height =
              reviewUpdateTextarea.scrollHeight + `px`;
          });
          const reviewButtonBox = document.createElement('div');
          reviewButtonBox.className = 'review-button-box';

          const reviewButtonUpdate = document.createElement('button');
          reviewButtonUpdate.className = 'review-button-update';
          reviewButtonUpdate.type = 'button';
          reviewButtonUpdate.innerText = '확인';
          reviewButtonUpdate.addEventListener('click', () => {
            const reviewContent =
              reviewContentBox.querySelector('.review-content');
            reviewContent.innerHTML = convertText(
              reviewUpdateTextarea.value,
              '\n',
              '<br/>'
            );

            reviewMap
              .get(movieId)
              .find((data) => data.reviewId === key).userRatingValue =
              reviewUpdateRatingInput.value;

            reviewMap
              .get(movieId)
              .find((data) => data.reviewId === key).userCommentValue =
              convertText(reviewUpdateTextarea.value, '<br/>', '\n');

            localStorage.setItem('review', JSON.stringify([...reviewMap]));
            reviewContentBox.style.display = 'block';
            reviewCard.removeChild(reviewUpdateBox);
          });

          const reviewButtonCancel = document.createElement('button');
          reviewButtonCancel.className = 'review-button-delete';
          reviewButtonCancel.type = 'button';
          reviewButtonCancel.innerText = '취소';
          reviewButtonCancel.addEventListener('click', () => {
            reviewContentBox.style.display = 'block';
            reviewCard.removeChild(reviewUpdateBox);
          });

          reviewButtonBox.append(reviewButtonUpdate, reviewButtonCancel);
          reviewUpdateBox.append(reviewUpdateTextarea, reviewButtonBox);
          reviewCard.insertAdjacentElement('beforeend', reviewUpdateBox);

          // reviewContent.textContent = input.value;
        }
      } else if (!inputPasswordValue.length) {
        checkReviewPassword.innerText = '비밀번호를 입력해주세요.';
        checkReviewPassword.style.display = 'block';
      } else {
        checkReviewPassword.innerText = '비밀번호가 다릅니다.';
        checkReviewPassword.style.display = 'block';
      }
    });
  });
};

// review html 만드는 함수
const createReview = ({
  reviewId,
  userIdValue,
  userCommentValue,
  userRatingValue,
}) => {
  // 이름 18자 까지만
  const html = `
    <li key=${reviewId} class="review-card">
      <div class="review-card-info">
        <div class="review-card-info-user">
          <div class="review-rating review-card-rating">
            ★★★★★
            <span style="width:${
              userRatingValue * 10
            }%" class="review-star">★★★★★</span>
            <input type="range" value="1" step="1" min="0" max="10" />
          </div>
          <div class="review-name-edit">
          <h4 id="userName">${userIdValue}</h4>
          </div>
          
        </div>
        <div class="review-card-info-password">
          <input
            id="review-input-password"
            type="password"
            placeholder="비밀번호"
          />
          <p class="review-check-password"></p>
        </div>
      </div>
      <p class="review-check-password"></p>
      <div class="review-content-box">
        <div class="review-content-main">
          <p class="review-content">${convertText(
            userCommentValue,
            '\n',
            '<br/>'
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
  deleteButtons = [...document.querySelectorAll('.review-button-delete')];
  updateButtons = [...document.querySelectorAll('.review-button-update')];

  buttonClickHandler(deleteButtons, 'delete');
  buttonClickHandler(updateButtons, 'update');
};

// DOM이 만들어 진 후 실행되는 함수
document.addEventListener('DOMContentLoaded', async () => {
  if (localStorage.getItem('mode') !== 'dark') {
    body.classList.add('light');
  } // 페이지 진입 시 화면 모드 결정

  getMovieReview();

  await render(); // 상세 정보 렌더링

  await creditsRender(); // 배역 정보 렌더링

  await videoRender() // 선행영상 정보 렌더링

  await similarRender() // 비슷한 영화 정보 렌더링

  reviewMap.get(movieId)?.forEach((data) => {
    createReview(data);
  });

  // 별점
  const reviewFormInput = document.querySelector('.review-form-rating input');
  const reviewFormStar = document.querySelector(
    '.review-form-rating .review-star'
  );
  reviewFormInput.addEventListener('input', () => {
    reviewFormStar.style.width = `${reviewFormInput.value * 10}%`;
  });
});

// submit 이벤트 발생시 리뷰 등록하는 함수
reviewForm.addEventListener('submit', (e) => {
  // 새로고침 방지
  e.preventDefault();

  let userId = document.querySelector('#userId');
  let userPassword = document.querySelector('#userPassword');
  let userComment = document.querySelector('#userComment');
  let checkMsg = document.querySelector('.checkMsg');
  // 별점
  const reviewRating = document.querySelector('.review-form-rating');
  const reviewRatingInput = reviewRating.lastElementChild;

  const userRatingValue = reviewRatingInput.value;
  const userIdValue = userId.value;
  const userPasswordValue = userPassword.value;
  const userCommentValue = userComment.value;

  // 댓글 등록 유효성 검사
  if (userIdValue.length < 2) {
    checkMsg.innerText = '아이디는 2글자 이상 입력해주세요.';
    checkMsg.style.display = 'block';
    return null;
  } else if (userPasswordValue.length < 6) {
    checkMsg.innerText = '비밀번호는 6자 이상 입력해주세요.';
    checkMsg.style.display = 'block';
    return null;
  } else if (!userCommentValue.length) {
    checkMsg.innerText = '리뷰을 작성해주세요.';
    checkMsg.style.display = 'block';
    return null;
  } else {
    checkMsg.style.display = 'none';
  }

  // movieId를 key로써 map에 접근해서 데이터 가져옴
  const map = reviewMap.get(movieId);

  let reviewId = '';
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
    userRatingValue,
  };

  // map이 비어있다는건 review가 없다는 것, 즉 첫 리뷰
  if (map == null) {
    reviewMap.set(movieId, [{ ...temp }]);
  } else {
    // map이 있으면 기존꺼에 temp를 붙여줌
    reviewMap.set(movieId, [...map, { ...temp }]);
  }

  // review 생성
  createReview(temp);

  // localStorage에 data 저장
  // localStorage는 js객체를 저장못함, 그래서 저장할수있게 변경해야함
  localStorage.setItem('review', JSON.stringify([...reviewMap]));

  // 저장 후 input들 비워줌
  userId.value = '';
  userPassword.value = '';
  userComment.value = '';
  reviewRatingInput.value = 0;
});

// 뒤로가기 함수
function backSpace() {
  window.history.back();
}

// 뒤로가기 기능
document.querySelector('.backBtn').addEventListener('click', function () {
  backSpace();
});

// 메인으로 이동
document.querySelector('.homeBtn').addEventListener('click', () => {
  document.location.href = "/WEEK3_movie_page_advanced/index.html";
});

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMTE4NTdhNTg1MThiOWVjZWRjMzE4ZDVkYjE1OWRkOSIsInN1YiI6IjY2MjhhZmRmNjNkOTM3MDE0YTcyMmMxNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZrKj2Zyb565lbyPKH1RQSzBsq3AYrMAoFe7QZKm-P2Q',
  },
}; // 영화 API 사용자 정보

function response(page) {
  return fetch(
    `https://api.themoviedb.org/3/movie/popular?language=ko&page=${page}`,
    options
  );
}

let spreadInfos = document.querySelector('.content-summary');
let background = document.querySelector('.container1');

async function render() {
  fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=ko`, options)
    .then((response) => response.json())
    .then((movie) => {
      const movieImgPath = `https://image.tmdb.org/t/p/w342${movie['poster_path']}`;
      const movieBgPath = `https://image.tmdb.org/t/p/w1280${movie['backdrop_path']}`;
      const genreList = movie['genres'];
      let movieCard = `
      <div class="detail-content">
        <div class="top-info">
          <div class="detail-title">${movie['title']}</div>
          <div class="detail-original-title">${movie['original_title']}</div>
          <div class="overview">${
            movie['overview'] || '등록된 줄거리가 없습니다.'
          }</div>
        </div>
        <div class="genre"></div>
        <ul class="movie-info">
          <li class="release-date">
            <span class="info-name">⦁ 개봉일자</span>
            <span class="info">${movie['release_date']}</span>
          </li>
          <li class="runtime">
            <span class="info-name">⦁ 재생시간</span>
            <span class="info">${movie['runtime']}분</span>
          </li>
          <li class="vote-average">
            <span class="info-name">⦁ 평점</span>
            <span class="info">평균&nbsp;${movie['vote_average'].toFixed(
              1
            )}</span>
          </li>
        </ul>
      </div>
      <div class="poster">
        <img src=${
          movie['poster_path'] ? movieImgPath : '../image/default_image.png'
        } alt=""/>
      </div>
    `;
      spreadInfos.innerHTML += movieCard;

      background.setAttribute(
        'style',
        `
    background: linear-gradient( to bottom,
    rgba(0, 0, 0, 0) 10%,
    rgba(0, 0, 0, 0.5) 25%,
    rgba(0, 0, 0, 0.6) 40%,
    rgba(0, 0, 0, 0.7) 50%,
    rgba(0, 0, 0, 0.8) 75%,
    rgba(0, 0, 0, 1) 100%
  ),
  url(${
    movie['backdrop_path'] ? movieBgPath : '../image/detail_default_image.png'
  }); background-size: cover;
  background-repeat: no-repeat;
  background-position: center 0 ;`
      );

      genreRender(genreList);

      return;
    })
    .catch((err) => console.error(err));
}

async function genreRender(genreList) {
  let genreArea = document.querySelector('.genre');
  genreList.forEach((genre) => {
    let genreBlock = `<p class="genre-item">${genre['name']}</p>`;
    genreArea.innerHTML += genreBlock;
  });
}

async function similarRender() {
  fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/similar?language=ko&page=1`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      let similarList = document.querySelector('.movie-list');
      if (data['results'].length === 0) {
        let similarCard = `<p class="no-similar">연관된 콘텐츠가 없습니다.</p>`;
        similarList.innerHTML += similarCard;
        return;
      }
      for (let i = 0; i < 3; i++) {
        let similar = data['results'][i];
        let similarBgPath = `https://image.tmdb.org/t/p/w780${similar['backdrop_path']}`;
        let similarCard = `
      <li class="movie-list-item">
        <img class="movie-list-item-img" src=${
          similar['backdrop_path']
            ? similarBgPath
            : '../image/default_image.png'
        } alt=""/>
        <div class="over-text">
          <h3 class="movie-list-item-title">${similar['title']}</h3>
          <p class="movie-list-item-desc">${
            similar['overview'] || '등록된 줄거리가 없습니다.'
          }</p>
          <div class="movie-id">${similar['id']}</div>
          <button class="movie-list-item-btn">더 보기</button>
        </div>
      </li>
      `;
        similarList.innerHTML += similarCard;
      }
    })
    .catch((err) => console.error(err));
}

let movieList = document.querySelector('.movie-list');

movieList.addEventListener('click', (e) => {
  const ITEM_NUM = [3, 5, 7];
  ITEM_NUM.forEach((num) => {
    let detailBtn = movieList.childNodes
      .item(num)
      .childNodes.item(3)
      .childNodes.item(7);
    let similarMovieId = movieList.childNodes
      .item(num)
      .childNodes.item(3)
      .childNodes.item(5).innerText;
    if (e.target === detailBtn) {
      console.log('클릭');
      urlParams.set('id', similarMovieId);
      const urlQuery = url.toString();
      console.log(urlQuery);
      location.href = `?id=${similarMovieId}`;
    }
  });
}); // 비슷한 영화의 상세보기 클릭 시 해당 페이지로 이동

async function creditsRender() {
  fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko`,
    options
  )
    .then((response) => response.json())
    .then((credits) => {
      let creditsArea = document.querySelector('.credits ul');
      let director = credits['crew'][0];
      let creditImgPath = `https://image.tmdb.org/t/p/w185${director['profile_path']}`;
      let directorHTML = `
    <li class="person">
      <img src=${
        director['profile_path']
          ? creditImgPath
          : '../image/profile_default_image.png'
      } alt="">
      <p class="name">${director['name']}</p>
      <p class="character">${director['department']}</p>
    </li>
    `;
      creditsArea.innerHTML += directorHTML; // 감독 붙여넣기

      for (let i = 0; i < 5; i++) {
        let person = credits['cast'][i];
        let creditImgPath = `https://image.tmdb.org/t/p/w185${person['profile_path']}`;
        let castHTML = `
        <li class="person">
          <img src=${
            person['profile_path']
              ? creditImgPath
              : '../image/profile_default_image.png'
          } alt="">
          <p class="name">${person['name']}</p>
          <p class="character">${
            person['character'] || '알 수 없음'
          }&nbsp;역</p>
        </li>
      `;

      creditsArea.innerHTML += castHTML; // 배역 붙여넣기
    }
  })
  .catch(err => console.error(err));
};

async function videoRender() {
  let videoArea = document.querySelector('.video-content');
  fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?language=ko`, options)
  .then(response => response.json())
  .then(videos => {
    console.log(videos)
    if(videos["results"].length === 0) {
      videoArea.innerHTML = '';
      let noVideoHTML = `<p class="no-video">관련 영상이 없습니다.</p>`
      videoArea.innerHTML += noVideoHTML;
    } else {
      const videoIframe = videoArea.querySelector("iframe");
      videoIframe.src = `https://www.youtube.com/embed/${videos["results"][0]["key"]}`;
      videoIframe.title = "YouTube video player";
      videoIframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      videoIframe.allowFullscreen = true;
      videoIframe.style.width = '854px';
      videoIframe.style.height = '480px';
    }
  })
  .catch(err => console.error(err));
}
