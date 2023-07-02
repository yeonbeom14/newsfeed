'use strict';
const postDeleteBtn = document.querySelector("#postDeleteBtn")
if (document.cookie) {
    document.getElementById("loginNickname").innerHTML = localStorage.getItem('userNickname');
}

const pathname = window.location.pathname;
const path = pathname.substring(pathname.lastIndexOf('/') + 1);

function youtubeId(url) {
    var tag = "";
    if (url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var matchs = url.match(regExp);
        if (matchs) {
            tag += matchs[7];
        }
        return tag;
    }
}

function postLoad() {
    fetch(`/api/posts/${path}`, {
        method: "GET"
    })
        .then((res) => res.json())
        .then((data) => {
            let rows = data["post"];
            let likeArr = JSON.parse(rows.like)
            let likeCount = likeArr.length
            const code = youtubeId(rows.url);
            const date = new Date(rows.updatedAt).toLocaleString('ko-KR');
            localStorage.setItem('postTitle', rows.title);
            localStorage.setItem('postUrl', rows.url);
            localStorage.setItem('postContent', rows.content);
            let temp_html = `<iframe width="1280" height="720" src="https://www.youtube.com/embed/${code}"
                            title="YouTube video player" frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen></iframe>
                            <div align="left" class="posted">
                                <h2 align="center">${rows.title}</h2>
                                <div class="info">
                                        <div id="postNick">작성자 닉네임 : ${rows.Nickname}</div>
                                        <div>한줄소개글 : ${rows.Description}</div>
                                </div>
                                <p>작성시간 : ${date}</p>
                                <p>내용 : ${rows.content}</p>
                            </div>
                            <button class="btn" onclick="location.href='../editpost/${rows.postId}'">수정</button>
                            <input class="btn" type="submit" value="삭제" onclick="if(!confirm('정말로 삭제하시겠습니까?')){return false;} postDelete()" />`;
            document
                .querySelector(".post-wrapper")
                .insertAdjacentHTML("beforeend", temp_html)
            $('.likeBtn').empty()
            let temp_html2 = `<button class="btn" id="like" onclick="Like()">좋아요</button>
                            <h3 id="likeCnt">${likeCount}</h3>`
            document
                .querySelector(".likeBtn")
                .insertAdjacentHTML("beforeend", temp_html2)
        })
        .catch((err) => {
            console.log(err)
            console.error("불러오기에 실패했습니다.");
        })
}

function postDelete() {
    fetch(`/api/posts/${path}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.message) {
                alert(res.message);
                location.href = "/";
            } else {
                alert(res.errorMessage);
            }
        })
        .catch((err) => {
            console.error("게시글 삭제에 실패했습니다.");
        })
}

function Like() {
    fetch(`/api/posts/${path}/like`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((data) => {
            let rows = data["post"];
            let likeArr = JSON.parse(rows.like)
            let likeCount = likeArr.length
            $('.likeBtn').empty()
            let temp_html = `<button class="btn" id="like" onclick="Like()">좋아요</button>
                           <h3 id="likeCnt">${likeCount}</h3>
                           `;
            document
                .querySelector(".likeBtn")
                .insertAdjacentHTML("beforeend", temp_html)
        })
        .catch((err) => {
            console.error(err);
        })
}

const comment = document.querySelector("#commentInput"),
    commentBtn = document.querySelector("#commentBtn");

commentBtn.addEventListener("click", commentPost);

function commentPost() {
    const req = { comment: comment.value };

    fetch(`/api/posts/${path}/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.message) {
                location.href = `/postdetail/${path}`;
            } else {
                alert(res.errorMessage);
            }
        })
        .catch((err) => {
            console.error("댓글 작성 중 에러 발생");
        })
}

const getComment = fetch(`/api/posts/${path}/comments`)
    .then((response) => response.json())
    .then((data) => {
        return data.comments;
    });

const showComments = () => {
    getComment.then((comments) => {
        comments.forEach((rows) => {
            const temp = document.createElement("div");
            temp.innerHTML = `<div class="comment">
                                    <div class="cmtnick">${rows.Nickname}</div>
                                    <div class="postedcomment">${rows.comment}</div>
                                    <button class="cmtbtn" id="${rows.commentId}" onclick="commentEdit(this)" type="button">수정</button>
                                    <button class="cmtbtn" id="${rows.commentId}" onclick="commentDelete(this)" type="button">삭제</button>
                            </div>`;
            document.querySelector("#commentlist").append(temp);
        });
    });
}
showComments();

function commentDelete(elem) {
    fetch(`/api/posts/${path}/comments/${elem.id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.message) {
                location.href = `/postdetail/${path}`;
            } else {
                alert(res.errorMessage);
            }
        })
        .catch((err) => {
            console.error("댓글 삭제에 실패했습니다.");
        })
}

function commentEdit(elem) {
    const comment = prompt("수정할 내용을 입력해주십시오.")
    const req = { comment: comment };
    fetch(`/api/posts/${path}/comments/${elem.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.message) {
                location.href = `/postdetail/${path}`;
            } else {
                alert(res.errorMessage);
            }
        })
        .catch((err) => {
            console.error("게시글 수정 중 에러 발생");
        })
}