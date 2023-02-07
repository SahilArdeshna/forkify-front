import * as index from "../index";

export const signupWithData = (user) => {
  $.ajax({
    type: "POST",
    url: `${process.env.API_URL}/signup`,
    data: user,
  })
    .done((result) => {
      const data = JSON.parse(result);
      // Store token
      window.localStorage.setItem("forkifyToken", data.token);

      // Check for token
      index.checkUserToken();
    })
    .fail((err) => {
      const error = JSON.parse(err.responseText);
      $("#errorMsg").show();
      $("#errorMsg")[0].textContent = error.error;
    });
};
