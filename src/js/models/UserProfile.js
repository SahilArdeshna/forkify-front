export const getUserData = async () => {
    return $.ajax({
        type: 'GET',
        url: 'https://forkify--api.herokuapp.com/userData',
        async: true,
        headers: {
            'Authorization': window.localStorage.getItem('forkifyToken')    
        }
    }).done(result => {
        
    }).fail(err => {
        const error = JSON.parse(err.responseText);
        $('#errorMsg').show();
        $('#errorMsg')[0].textContent = error.error;
    });
};

export const updateUserData = (userData) => {
    return $.ajax({
        type: 'POST',
        url: 'https://forkify--api.herokuapp.com/updateUser',
        data: userData,
        processData: false,
        contentType: false,
        headers: {
            'Authorization': window.localStorage.getItem('forkifyToken')
        }
    }).done(result => {
        const data = JSON.parse(result);
        if (data.status === 200) {
            alert(data.result);
        }
    }).fail(err => {
        const error = JSON.parse(err.responseText);
        $('#errorMsg').show();
        $('#errorMsg')[0].textContent = error.error;
        return error;
    });
};