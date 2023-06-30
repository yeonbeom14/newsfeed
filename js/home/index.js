'use strict';

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