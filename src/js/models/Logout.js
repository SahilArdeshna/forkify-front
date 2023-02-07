import * as index from "../index";

export const logout = () => {
  $.ajax({
    type: "POST",
    url: `${process.env.API_URL}/logout`,
    data: {},
    headers: {
      Authorization: window.localStorage.getItem("forkifyToken"),
    },
  })
    .done((data) => {
      // remove stored token
      window.localStorage.removeItem("forkifyToken");

      // Check for token
      index.checkUserToken();
    })
    .fail((err) => {
      alert("Error while logging out.");
    });
};
