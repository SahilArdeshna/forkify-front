export const deleteRecipe = (id) => {
  $.ajax({
    type: "DELETE",
    url: `${process.env.API_URL}/deleteRecipe/${id}`,
    headers: {
      Authorization: window.localStorage.getItem("forkifyToken"),
    },
  })
    .done((data) => {
      if (data.status === 200) {
        // display search result

        alert("Recipe deleted.");
      }
    })
    .fail((err) => {
      alert(err.responseJSON.error);
      console.log(err.responseJSON.error);
    });
};
