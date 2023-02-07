import { elements } from "./base";
import * as Login from "../models/Login";
import * as signupView from "./signupView";

export const login = () => {
  const html = ` 
        <div class="card card__signin">
            <div id="errorMsg" class="errorMsg"></div>
            <form class="text-center border border-light">
                <h2 class="mb-4">Sign in</h2>
                <input type="email" name="email" class="form-control mb-4 email" placeholder="E-mail" required>            
                
                <input type="password" name="password" class="form-control password" placeholder="Password" aria-describedby="defaultRegisterFormPasswordHelpBlock" required>     

                <button class="btn btn-info my-4 signin">Sign In</button>
            </form>
            <hr>
            <div class="sign">
                <p>Sign up</p>
                <button class="btn btn-info my-4 sign__up">Sign Up</button>
            </div>
        </div>
    `;

  elements.body.innerHTML = "";
  elements.body.insertAdjacentHTML("afterbegin", html);

  $(document).ready(() => {
    // Display signup page
    gotoSignup();

    // Login User
    userLogin();
  });
};

const gotoSignup = () => {
  $(".sign__up").click((e) => {
    e.preventDefault();

    // Show signup page
    signupView.signupPage();
  });
};

const userLogin = () => {
  $(".signin").click((e) => {
    e.preventDefault();

    const userData = {
      email: $(".email").val(),
      password: $(".password").val(),
    };

    // User Login
    Login.login(userData);
  });
};
