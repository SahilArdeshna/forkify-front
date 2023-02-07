import { elements } from "./base";
import * as loginView from "./loginView";
import * as Signup from "../models/Signup";

export const signupPage = () => {
  const html = ` 
        <div class="card card__signup">
            <div id="errorMsg" class="errorMsg"></div>
            <form class="text-center border border-light">            
                <h2 class="mb-4">Sign up</h2>
                <div class="form-row mb-4">
                    <div class="col col1">
                        <input type="text" id="defaultRegisterFormFirstName" name="firstName" class="form-control first__name" placeholder="First name" required>
                    </div>
                    <div class="col col2">
                        <input type="text" id="defaultRegisterFormLastName" name="lastName" class="form-control last__name" placeholder="Last name" required>
                    </div>
                </div>

                <input type="email" id="defaultRegisterFormEmail" name="email" class="form-control mb-4 email" placeholder="E-mail" required>
                <input type="password" id="defaultRegisterFormPassword" name="password" class="form-control password" placeholder="Password" aria-describedby="defaultRegisterFormPasswordHelpBlock" required>

                <button class="btn btn-info my-4 signup">Sign Up</button
            </form>
            <hr>
            <div class="sign">
                <p>Sign In</p>
                <button class="btn btn-info my-4 sign__in">Sign In</button>
            </div>
        </div>        
    `;

  elements.body.innerHTML = "";
  elements.body.insertAdjacentHTML("afterbegin", html);

  $(document).ready(() => {
    // Display login page
    gotoSignin();

    // Call  signup function
    userSignup();
  });
};

const gotoSignin = () => {
  const signin = document.querySelector(".sign__in");
  $(signin).click((e) => {
    e.preventDefault();

    // Show login page
    loginView.login();
  });
};

const userSignup = () => {
  $(".signup").click((e) => {
    e.preventDefault();
    const userData = {
      firstName: $(".first__name").val(),
      lastName: $(".last__name").val(),
      email: $(".email").val(),
      password: $(".password").val(),
    };

    Signup.signupWithData(userData);
  });
};
