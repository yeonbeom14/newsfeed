'use strict';

const password = document.querySelector("#password"),
    nickname = document.querySelector("#nickname"),
    description = document.querySelector("#description"),
    newPassword = document.querySelector("#newPassword"),
    newComfirm = document.querySelector("#newComfirm"),
    editProfileBtn = document.querySelector("#editProfileBtn");

editProfileBtn.addEventListener("click", editProfile);

nickname.value = localStorage.getItem("userNickname");
description.value = localStorage.getItem("userDescription");

function editProfile() {
    const req = {
        password: password.value,
        nickname: nickname.value,
        description: description.value,
        newPassword: newPassword.value,
        newComfirm: newComfirm.value,
    };
    fetch("/api/profile", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.message) {
                alert(res.message);
                location.href = "/profile";
            } else {
                alert(res.errorMessage);
            }
        })
        .catch((err) => {
            console.error("프로필 수정 중 에러 발생");
        })
}