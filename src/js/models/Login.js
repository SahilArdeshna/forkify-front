import * as index from "../index";

export const login = (user) => {
    $.ajax({
        type: "POST",
        url: "https://forkify--api.herokuapp.com/login",
        data: user
    }).done((result) => {
        const data = JSON.parse(result);
        // Store token
        window.localStorage.setItem('forkifyToken', data.token);

        // Check for token
        index.checkUserToken();        
    }).fail((err) => {
        const error = JSON.parse(err.responseText);
        $('#errorMsg').show();
        $('#errorMsg')[0].textContent = error.error;
    });
};