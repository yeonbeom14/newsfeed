'use strict';

const title = document.querySelector("#titleInput"),
    url = document.querySelector("#URLinput"),
    content = document.querySelector("#contentInput"),
    postBtn = document.querySelector("#postBtn");

postBtn.addEventListener("click", post);

function post() {
    const req = {
        title: title.value,
        url: url.value,
        content: content.value,
    };

    fetch("/api/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.message) {
                location.href = "/";
                alert(res.message);
            } else {
                alert(res.errorMessage);
            }
        })
        .catch((err) => {
            console.error("게시글 작성 중 에러 발생");
        })
}