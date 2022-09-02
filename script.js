const URL1 = "https://www.googleapis.com/youtube/v3/search";
const API_KEY = "AIzaSyDcfW12wtRs9dGIHG5_OcUQtIZ1pNzoLHc";
const videoList = document.querySelector(".video-list");
const form = document.querySelector(".add-review");
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");
const btnCloseModal = document.querySelector(".btn__close-modal");
const btnCloseReviewModal = document.querySelector(".btn__close-review-modal");
const registerReviewBtn = document.querySelector(".register-review-btn");
const closeReviewBtn = document.querySelector(".close-review-btn");

const modalContainer = document.querySelector(".modal-container");
const curList = [];

const navSideDiv = document.querySelector(".nav-side-div");
navSideDiv.addEventListener("click", () => {
  alert("서비스 준비중입니다 :D");
});

const navIconMain = document.querySelector(".nav-icon-main");
navIconMain.addEventListener("click", () => {
  alert("싸피는 위대하다.");
});

const toggleHidden = () => {
  modal.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
};

btnCloseModal.addEventListener("click", () => {
  toggleHidden();
});
closeReviewBtn.addEventListener("click", () => {
  toggleHidden();
});

modalContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn__close-review-modal")) {
    modalContainer.innerHTML = "";
  }
});

const btn = document.querySelector("#search-btn");

btn.addEventListener("click", () => {
  const value = document.querySelector("#search").value;

  axios({
    url: URL1,
    method: "GET",
    params: {
      key: API_KEY,
      part: "snippet",
      q: value,
      type: "video",
      maxResults: 5,
    },
  })
    .then((res) => {
      console.log(res.data.items);
      return res.data.items;
    })
    .then((res) => {
      videoList.innerHTML = "";

      const curList = [];
      for (let i = 0; i < res.length; i++) {
        const divTag = document.createElement("div");
        divTag.classList.add("video");
        const titleTag = document.createElement("h4");
        const channelTag = document.createElement("h5");
        const imgTag = document.createElement("img");

        imgTag.src = res[i].snippet.thumbnails.default.url;
        titleTag.innerText = res[i].snippet.title;
        channelTag.innerText = res[i].snippet.channelTitle;

        const Video = {
          videoId: res[i].id.videoId,
          reviews: [],
        };

        curList.push(Video);

        divTag.appendChild(imgTag);
        divTag.appendChild(titleTag);
        divTag.appendChild(channelTag);
        divTag.setAttribute("data-videoid", res[i].id.videoId);
        videoList.appendChild(divTag);
      }
      console.log(curList);

      videoList.addEventListener("click", (e) => {
        const video = e.target.closest(".video");
        if (e.target.tagName === "IMG") {
          // 모달창 만들기
          modalContainer.innerHTML = "";
          const html = `
          <div class="modal-review">
            <span class="btn__close-review-modal">×</span>
            <h2 class="add-review__title">운동 리뷰</h2>
            <hr />
            <div class="iframe">
              <iframe src="https://www.youtube.com/embed/${video.dataset.videoid}" frameborder="0" width="300" height="200"></iframe>
            </div>
            <hr />
            <button class="add-review-btn">
              글작성
            </button>
            <div class="review-list-container">
            </div>
            <div class="second-modal-container">
            </div>
          </div>
          `;
          console.log(video.dataset.videoid);
          modalContainer.insertAdjacentHTML("beforeend", html);

          const reviewListContainer = document.querySelector(
            ".review-list-container"
          );

          const updateReviewList = () => {
            reviewListContainer.innerHTML = "";
            const curVideo = curList.find(
              (v) => v.videoId === video.dataset.videoid
            ).reviews;

            if (curVideo.length !== 0) {
              let html = `
              <table class="review-table">
                <tr>
                  <th>번호</th>
                  <th>제목</th>
                  <th>시간</th>
                </tr>
              `;

              for (let i = 0; i < curVideo.length; i++) {
                html += `
                <tr class="review-no" data-reviewno="${i}">
                  <td>${i + 1}</td>
                  <td>${curVideo[i].title}</td>
                  <td>${curVideo[i].time}</td>
                </tr>
                `;
              }

              html += `</table>`;
              reviewListContainer.insertAdjacentHTML("beforeend", html);
            }
          };

          updateReviewList();

          const addReviewBtn = document.querySelector(".add-review-btn");
          addReviewBtn.addEventListener("click", () => {
            toggleHidden();
          });

          registerReviewBtn.onclick = () => {
            let videoObject = curList.find(
              (v) => v.videoId === video.dataset.videoid
            );
            console.log(videoObject);
            const title = document.querySelector(
              ".add-review-container-title"
            ).value;
            const content = document.querySelector(
              ".add-review-container-content"
            ).value;

            console.log(title, content);
            if (title === "" || content === "") return;

            const date = new Date();

            const Review = {
              title: title,
              content: content,
              time: date.toUTCString(),
            };

            videoObject.reviews.push(Review);

            toggleHidden();
            document.querySelector(".add-review-container-title").value = "";
            document.querySelector(".add-review-container-content").value = "";
            console.log(curList);

            updateReviewList();
          };

          // const reviewTable = document.querySelector(".review-table");

          reviewListContainer.onclick = (e) => {
            const curReview = e.target.closest(".review-no");
            const curReviewObject = curList.find(
              (v) => v.videoId === video.dataset.videoid
            ).reviews[curReview.dataset.reviewno];

            console.log(curReviewObject);
            const secondModal = document.querySelector(
              ".second-modal-container"
            );

            secondModal.innerHTML = "";
            const html = `
              <div class="modal-review-check">
                <span class="btn__close-review-modal">×</span>
                <h2 class="check__title">"${curReviewObject.content}"</h2>
                <button class="delete-review-btn">
                  글삭제
                </button>
              </div>
          `;
            secondModal.insertAdjacentHTML("beforeend", html);

            const deleteReviewBtn =
              document.querySelector(".delete-review-btn");
            deleteReviewBtn.onclick = () => {
              console.log(curReview.dataset.reviewno);
              curList
                .find((v) => v.videoId === video.dataset.videoid)
                .reviews.splice(+curReview.dataset.reviewno, 1);
              console.log(curList);
              secondModal.innerHTML = "";
              updateReviewList();
            };
          };

          console.log(curList);
        }
      });
    })
    .catch((e) => console.log(e));
});
