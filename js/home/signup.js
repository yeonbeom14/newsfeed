'use strict';

const email = document.querySelector("#email"),
    password = document.querySelector("#password"),
    confirmPs = document.querySelector("#confirm"),
    nickname = document.querySelector("#nickname"),
    description = document.querySelector("#description"),
    signupBtn = document.querySelector("#signupBtn");

signupBtn.addEventListener("click", signup);

function signup() {
    const req = {
        email: email.value,
        password: password.value,
        confirm: confirmPs.value,
        nickname: nickname.value,
        description: description.value,
    };

    fetch("/api/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.message) {
                location.href = "/login";
            } else {
                alert(res.errorMessage);
            }
        })
        .catch((err) => {
            console.error("회원가입 중 에러 발생");
        })
}