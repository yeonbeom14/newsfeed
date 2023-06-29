'use strict';

const idKey = "USER-ID";
const $emailRemember = document.getElementById("remember-check");
const email = document.querySelector("#email"),
    password = document.querySelector("#password"),
    loginBtn = document.querySelector("#loginBtn");

const loginInfo = JSON.parse(localStorage.getItem(idKey));

if (loginInfo) {
    email.value = loginInfo;
    $emailRemember.checked = true;
}

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
                checkRemeberLoginInfo();
                location.href = "/";
            } else {
                alert(res.errorMessage);
            }
        })
        .catch((err) => {
            console.error("로그인 중 에러 발생");
        })
}

function checkRemeberLoginInfo() {
    let userEmail = email.value;

    if ($emailRemember.checked === true) {
        localStorage.setItem(idKey, JSON.stringify(userEmail));
    } else {
        localStorage.removeItem(idKey);
    }
}