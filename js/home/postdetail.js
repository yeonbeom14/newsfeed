'use strict';
const postDeleteBtn = document.querySelector("#postDeleteBtn")

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
    const pathname = window.location.pathname;
    const path = pathname.substring(pathname.lastIndexOf('/') + 1);
    fetch(`/api/posts/${path}`, {
        method: "GET"
    })
        .then((res) => res.json())
        .then((data) => {
            let rows = data["post"];
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
                                <p>title : ${rows.title}</p>
                                <div class="info">
                                        <div class="nick">닉네임 : ${rows.Nickname}</div>
                                        <div>한줄소개글 : ${rows.Description}</div>
                                </div>
                                <p>작성시간 : ${date}</p>
                                <p>내용 : ${rows.content}</p>
                            </div>
                            <button onclick="location.href='../modifypost/${rows.postId}'">수정</button>
                            <input type="submit" value="삭제" onclick="if(!confirm('정말로 삭제하시겠습니까?')){return false;} postDelete()" />`;
            document
                .querySelector(".post-wrapper")
                .insertAdjacentHTML("beforeend", temp_html)
        })
        .catch((err) => {
            console.log(err)
            console.error("불러오기에 실패했습니다.");
        })
}

function postDelete() {
    const pathname = window.location.pathname;
    const path = pathname.substring(pathname.lastIndexOf('/') + 1);
    fetch(`/api/posts/${path}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.message) {
                location.href = "/";
            } else {
                alert(res.errorMessage);
            }
        })
        .catch((err) => {
            console.error("게시글 삭제에 실패했습니다.");
        })
}

