'use strict';

const email = document.querySelector("#email"),
    password = document.querySelector("#password"),
    loginBtn = document.querySelector("#loginBtn");

loginBtn.addEventListener("click", login);

function login() {
    const req = {
        email: email.value,
        password: password.value,
    };

    fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.token) {
                location.href = "/";
            } else {
                alert(res.errorMessage);
            }
        })
        .catch((err) => {
            console.error("로그인 중 에러 발생");
        })
}
