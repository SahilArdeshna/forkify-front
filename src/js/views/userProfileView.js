import * as index from '../index';
import * as UserProfile from '../models/UserProfile';
import * as addRecipeView from './addRecipeView';

// Clear UI
export const clearUI = () => {    
    $('.results')[0].style.display = 'none';
    $('.recipe')[0].textContent = '';
    $('.shopping')[0].style.display = 'none';
};

// Display user Data to UI
export const userData = (user) => {
    const html = `
        <div class="well">
            <div id="errorMsg" class="errorMsg"></div>        
            <div id="myTabContent" class="tab-content">
                <div class="tab-pane active in" id="home">
                    <div class="form__title">
                        <h2>User Info</h2>
                    </div>                    
                    <form id="tab" enctype="multipart/form-data">
                        <div class="text-center">
                            <img src="${user.image ? `https://forkify--api.herokuapp.com/${user.image}` : "http://ssl.gstatic.com/accounts/ui/avatar_2x.png"}" class="avatar img-circle img-thumbnail" alt="avatar">
                            <h6>Upload a different photo...</h6>
                            <input type="file" class="text-center center-block file-upload image">
                        </div></hr><br>

                        <label>First Name</label>
                        <input type="text" value="${user.firstName}" class="form-control mb-4 first__name">

                        <label>Last Name</label>
                        <input type="text" value="${user.lastName}" class="form-control mb-4 last__name">

                        <label>Email</label>
                        <input type="text" value="${user.email}" class="form-control mb-4 email" disabled>

                        <label>Old Password</label>
                        <input type="password" class="form-control mb-4 old__password" placeholder="required for update user info">

                        <label>New Password</label>
                        <input type="password" class="form-control mb-4 new__password" placeholder="change password">
                        
                        <div class="update__btn">
                            <input class="btn btn-primary user__data-update" value="Update User Info">
                            <br><br>
                            <input type="button" value="go back" title="Go Back" class="btn go__back">                        
                        </div>                        
                    </form>
                </div>
            </div>
        </div>
    `;    
    
    // Display user Data
    $('.recipe')[0].style.gridColumn = '2';
    $('.recipe')[0].insertAdjacentHTML('afterbegin', html);
    
    $(document).ready(function() {
        // Preview user image
        var readURL = (input) => {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = (e) => {
                    $('.avatar').attr('src', e.target.result);
                };
        
                reader.readAsDataURL(input.files[0]);
            }
        };     

        $(".file-upload").on('change', function() {
            readURL(this);
        });

        // Show go back button and call function
        $('.go__back').show();
        addRecipeView.goback();

        // Call user update function
        userUpdate();
    });
};

const userUpdate = () => {
    $('.user__data-update').click(async (e) => {
        e.preventDefault();

        // Prepare user form data
        const userData = new FormData();
        const file = document.querySelector('.image').files[0];
        userData.append('firstName', $('.first__name').val());
        userData.append('lastName', $('.last__name').val());
        userData.append('image', file);
        userData.append('oldPassword', $('.old__password').val());
        userData.append('newPassword', $('.new__password').val());

        try {
            // Call update user function with user form data
            await UserProfile.updateUserData(userData);        
            
            // Call user info function
            index.userProfile();            
        } catch (err) {
           
        }
    });
};