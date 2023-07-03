'use strict';
const path = document.location.href.split("=");
const categoryName = path[1];

const getCatgory = fetch(`/api/category/${categoryName}`)
    .then((response) => response.json())
    .then((data) => {
        return data.category;
    });
console.log(categoryName);

const showCatgory = () => {
    getCatgory.then((category) => {
        category.forEach((category) => {
            const temp = document.createElement("div");
            const code = youtubeId(category.url);
            const date = new Date(category.updatedAt).toLocaleString('ko-KR');

            temp.innerHTML = `<div class="post" 
            onclick ="location.href='postdetail/${category.postId}'">
                <div class="card h-100">
                    <img class="card-img-top" src="https://img.youtube.com/vi/${code}/mqdefault.jpg"/>
                        <div class="card-body">
                            <h5 class="card-title">${category.title}</h5>
                            <p class="card-text">${category.Nickname}</p>
                            <p class="timestamp">${date}</p>
                        </div>
                    </div>
                </div>`;
            document.querySelector("#cards-box").append(temp);
        });
    });
}
showCatgory();

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