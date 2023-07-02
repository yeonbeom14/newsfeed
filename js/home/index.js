'use strict';

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

const getPost = fetch("/api/posts")
    .then((response) => response.json())
    .then((data) => {
        return data.posts;
    });

const showPosts = () => {
    getPost.then((posts) => {
        posts.forEach((post) => {
            const temp = document.createElement("div");
            const code = youtubeId(post.url);
            const date = new Date(post.updatedAt).toLocaleString('ko-KR');

            temp.innerHTML = `<div class="post" 
            onclick ="location.href='postdetail/${post.postId}'">
                <div class="card h-100">
                    <img class="card-img-top" src="https://img.youtube.com/vi/${code}/mqdefault.jpg"/>
                        <div class="card-body">
                            <h5 class="card-title">${post.title}</h5>
                            <p class="card-text">${post.Nickname}</p>
                            <p class="timestamp">${date}</p>
                        </div>
                    </div>
                </div>`;
            document.querySelector("#cards-box").append(temp);
        });
    });
}
showPosts();

function userLoad() {
    fetch("/api/profile", {
        method: "GET"
    })
        .then((res) => res.json())
        .then((data) => {
            let rows = data["profile"];
            if (rows) {
                localStorage.setItem('userEmail', rows.email);
                localStorage.setItem('userNickname', rows.nickname);

                let temp_html = `<button class="logoutBtn" onclick = logout()>로그아웃</button>
                            <button class="postBtn" onclick ="location.href='post'">추천 유튜브 등록</button>
                            <button class="profileBtn" onclick ="location.href='profile'">${rows.email} ⧸ ${rows.nickname}</button>`
                document
                    .querySelector(".btn-wrapper")
                    .insertAdjacentHTML("beforeend", temp_html)
            } else {
                let temp_html = `<button class="loginBtn" onclick ="location.href='login'">로그인</button>
                            <button class="registBtn" onclick ="location.href='signup'">회원가입</button>`
                document
                    .querySelector(".btn-wrapper")
                    .insertAdjacentHTML("beforeend", temp_html)
            }
        })
        .catch((err) => {
            console.log(err)
            console.error("불러오기에 실패했습니다.");
        })
}
userLoad();

function logout() {
    fetch("/api/logout", {
        method: "GET"
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
            console.log(err)
            console.error("로그아웃에 실패했습니다.");
        })
}