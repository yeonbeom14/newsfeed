'use strict';

const title = document.querySelector("#titleInput"),
    url = document.querySelector("#URLinput"),
    content = document.querySelector("#contentInput"),
    putBtn = document.querySelector("#putBtn");

putBtn.addEventListener("click", put);

title.value = localStorage.getItem("postTitle");
url.value = localStorage.getItem("postUrl");
content.value = localStorage.getItem("postContent");

function put() {
    const req = {
        title: title.value,
        url: url.value,
        content: content.value,
    };
    const pathname = window.location.pathname;
    const path = pathname.substring(pathname.lastIndexOf('/') + 1);
    fetch(`/api/posts/${path}`, {
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
                alert(res.message);
            } else {
                alert(res.errorMessage);
            }
        })
        .catch((err) => {
            console.error("게시글 수정 중 에러 발생");
        })
}