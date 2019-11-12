// MAIN PAGE OF APP
export const mainPage = async () => {
    const html = `
        <div class="container">
            <header class="header">
                <img src="img/logo.png" alt="Logo" class="header__logo">
                <form class="search">
                    <input type="text" class="search__field" placeholder="Search over 1,000,000 recipes...">
                    <button class="btn search__btn">
                        <svg class="search__icon">
                            <use href="img/icons.svg#icon-magnifying-glass"></use>
                        </svg>
                        <span>Search</span>
                    </button>
                </form>

                <div class="profile">
                    <div class="user__profile">

                    </div>
                    <div class="user__data">
                        <div class="dropdown">                            
                            
                        </div>
                    </div>
                </div>

                <div class="likes">
                    <div class="likes__field">
                        <svg class="likes__icon">
                            <use href="img/icons.svg#icon-heart"></use>
                        </svg>
                    </div>
                    <div class="likes__panel">
                        <ul class="likes__list">
                            
                        </ul>
                    </div>
                </div>
            </header>


            <div class="results">
                <ul class="results__list">
                    
                </ul>

                <div class="results__pages">
                    
                </div>
            </div>

            <div class="recipe">
                
            </div>


            <div class="shopping">
                <h2 class="heading-2">My Shopping List</h2>

                <ul class="shopping__list">
                    
                </ul>
            </div>
        </div>
    `;

    $('body').html(html);
};

export const updateUserName = (user) => {
    const html = `
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        ${user.firstName}
        </button>

        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a class="dropdown-item user__detail">Profile</a>
            <a class="dropdown-item add__recipe">Add Recipe</a>
            <a class="dropdown-item favorite__recipes">My Recipes</a>
            <a class="dropdown-item logout">Logout</a>
        </div>
    `;
    
    $('.dropdown')[0].innerHTML = '';
    $('.dropdown')[0].insertAdjacentHTML('afterbegin', html);
};
