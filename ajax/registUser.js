function registUser() {
    let Email = $("#Email").val();
    let Password = $("#Password").val();
    let confirm = $("#confirm").val();
    let decreption = $("#decreption").val();
    let nickname = $("#nickname").val();

    let formData = new FormData();
    formData.append("Email", Email);
    formData.append("Password", Password);
    formData.append("confirm", confirm);
    formData.append("decreption", decreption);
    formData.append("nickname", nickname);

    fetch("http://localhost:3018/signup", { method: "POST", body: formData })
        .then((res) => res.json())
        .then((data) => {
            alert(data["회원가입이 완료되었습니다."]);
        });
}