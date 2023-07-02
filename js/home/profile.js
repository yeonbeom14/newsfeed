'use strict';
const profileDeleteBtn = document.querySelector("#profileDeleteBtn")

function profileLoad() {
    fetch("/api/profile", {
        method: "GET"
    })
        .then((res) => res.json())
        .then((data) => {
            let rows = data["profile"];
            localStorage.setItem('userNickname', rows.nickname);
            localStorage.setItem('userDescription', rows.description);
            let temp_html = `<div class="profileCard" align="left">
                        <p>이메일 : ${rows.email}</p>
                        <p>닉네임 : ${rows.nickname}</p>
                        <p>소개글 : ${rows.description}</p>
                        <button class="btn" id="profileDeleteBtn" onclick="profileDelete ()" type="button">회원탈퇴</button><button class="btn" onclick ="location.href='editprofile'">정보수정</button>
                       </div>`;
            document
                .querySelector(".login-wrapper")
                .insertAdjacentHTML("beforeend", temp_html)
        })
        .catch((err) => {
            console.log(err)
            console.error("불러오기에 실패했습니다.");
        })
}


function profileDelete() {
    const password=prompt("비밀번호를 입력해주십시오.")
    const req = {
        password: password,
    };

    fetch("/api/profile", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
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
            console.error("회원탈퇴에 실패했습니다.");
        })
}

