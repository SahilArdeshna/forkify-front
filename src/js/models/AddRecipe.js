export const addRecipe = () => {
  const file = document.querySelector(".image").files[0];
  let formData = new FormData();
  formData.append("label", document.querySelector(".label").value);
  formData.append("image", file);
  formData.append(
    "ingredientLines",
    document.querySelector(".ingredientLines").value
  );
  formData.append("source", document.querySelector(".source").value);
  formData.append("totalTime", document.querySelector(".totalTime").value);
  formData.append("yield", document.querySelector(".yield").value);

  return $.ajax({
    type: "POST",
    url: `${process.env.API_URL}/addRecipe`,
    data: formData,
    processData: false,
    contentType: false,
    headers: {
      Authorization: window.localStorage.getItem("forkifyToken"),
    },
  })
    .done((result) => {
      const data = JSON.parse(result);
      if (data.status === 201) {
        // Display home page
        alert(data.result);
      }
    })
    .fail((err) => {
      const error = JSON.parse(err.responseText);
      $("#errorMsg").show();
      $("#errorMsg")[0].textContent = error.error;
    });
};
