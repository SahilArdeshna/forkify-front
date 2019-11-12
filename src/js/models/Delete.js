import * as index from '../index';

export const deleteRecipe = (id) => {
    $.ajax({
        type: 'DELETE',
        url: `https://forkify--api.herokuapp.com/deleteRecipe/${id}`,
        headers: {
            'Authorization': window.localStorage.getItem('forkifyToken')
        }
    }).done(data => {
        if (data.status === 200) {
            // display search result

            alert('Recipe deleted.');
        }
    }).fail(err => {
        alert(err.responseJSON.error);
        console.log(err.responseJSON.error);
    });
};