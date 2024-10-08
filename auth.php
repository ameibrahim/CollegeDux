<?php

    session_start();
    session_unset();
    session_destroy();
    session_start();

    $username = isset($_SESSION['id']);
    $role = isset($_SESSION['role']);

    if($username && $role == "student"){ header('location: /student'); }
    elseif($username && $role == "teacher"){ header('location: /teacher'); }
    elseif($username && $role == "admin"){ header('location: /admin'); }
    
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="css/auth.css">
    <link rel="stylesheet" href="css/translation.css">
    <script src="/js/auth.js?5" defer></script>
    <script src="/js/functions.js?4" defer></script>
    <script src="/js/weather.js" defer></script>
    <script src="/js/localize.js"></script>
</head>
<body>

    <div class="wrapper">
        <div class="logo-container">
            <img src="assets/images/air-logo.png" alt="">
            <div class="top-text">Prof Dux</div>
        </div>
    
        <div class="outer-container">
    
            <div class="bubble-message-container">Wrong Credentials</div>
    
            <form class="form-container login-container">
                <p class="title-tag"><text>dux login</text></p>
                <span class="text-box">
                    <!-- <p class="hint-text">You can log in with your email or </p> -->
                    <input type="text" id="username-field" required class="bordered bordered-dark" placeholder="Email / Student Number">
                </span>
                <span class="text-box">
                    <input type="password" id="password-field" required class="bordered bordered-dark" placeholder="password">
                </span>
                <div class="button background-dark" onclick="login()">login</div>
        
                <p class="link" onclick="showSignup()"><text>Don't have an account? Signup</text></p>
            </form>
        
            <form class="form-container signup-container">
                <p class="title-tag">dux signup</p>
        
                <div class="tab-buttons">
                    <div class="tab-button student-tab-button" data-active="true" onclick="showStudentForm()">student</div>
                    <div class="tab-button teacher-tab-button" data-active="false" onclick="showTeacherForm()">teacher</div>
                </div>
        
                <label for="signupImageInput" class="profile-picture-container">
                    <img id="chosenPhoto" src="" alt="User Photo">
                    <input type="file" id="signupImageInput" accept="image/*" onchange="loadImage(event, '#chosenPhoto')">
                    <span>Click to select a profile image</span>
                </label>
        
                <div class="two-column-grid student-form">
                    <span class="text-box">
                        <input type="text" id="name"required class="bordered bordered-dark" placeholder="Name">
                    </span>
                    <span class="text-box">
                        <input type="text" id="stdnumber" required class="bordered bordered-dark" placeholder="Student Number">
                    </span>
            
                    <span class="text-box">
                        <input type="text" id="department" required class="bordered bordered-dark" placeholder="Department">
                    </span>
            
                    <span class="text-box">
                        <input type="text" id="email" required class="bordered bordered-dark" placeholder="Email">
                    </span>
            
                    <span class="text-box stretch-x">
                        <input type="text" id="address" required class="bordered bordered-dark" placeholder="Address">
                    </span>
            
                    <span class="text-box">
                        <input type="text" id="phone" required class="bordered bordered-dark" placeholder="Phone Number">
                    </span>
                    <span class="text-box">
                        <input type="password" id="password" required class="bordered bordered-dark" placeholder="Password">
                    </span>
                </div>
        
                <div class="two-column-grid teacher-form">
                    <span class="text-box">
                        <input type="text" id="t-name" required class="bordered bordered-dark" placeholder="Name">
                    </span>
                    <span class="text-box">
                        <input type="text" id="t-department" required class="bordered bordered-dark" placeholder="Department">
                    </span>
            
                    <span class="text-box stretch-x">
                        <input type="text" id="t-email" required class="bordered bordered-dark" placeholder="Email">
                    </span>
            
                    <span class="text-box stretch-x">
                        <input type="text" id="t-address" required class="bordered bordered-dark" placeholder="Address">
                    </span>
            
                    <span class="text-box">
                        <input type="text" id="t-phone" required class="bordered bordered-dark" placeholder="Phone Number">
                    </span>
                    <span class="text-box">
                        <input type="password" id="t-password" required class="bordered bordered-dark" placeholder="Password">
                    </span>
                </div>
        
                <div class="button background-dark" onclick="signup()">Signup</div>
        
                <p class="link" onclick="showLogin()">Have an account? Login</p>
            </form>
        </div>
    </div>

    <div class="weather-container">
        <div class="weather"></div>
    </div>

    <script>

        let studentName = document.querySelector("#name");
        let studentNumber = document.querySelector("#stdnumber");
        let studentDepartment = document.querySelector("#department");
        let studentEmail = document.querySelector("#email");
        let studentAddress = document.querySelector("#address");
        let studentPhone = document.querySelector("#phone");
        let studentPassword = document.querySelector("#password");

        const randomstring = Math.random().toString(36).slice(-8);

        studentNumber.addEventListener("input", () => {
            studentEmail.value = `${studentNumber.value}@profdux.aiiot.website`;
            studentAddress.value = "Unset";
            studentPhone.value = "Unset";
            studentPassword.setAttribute("type", "text");

            studentPassword.value = randomstring;
        });

        localizeTextElements();

    </script>

    <div style="position:absolute;" class="gtranslate_wrapper"></div>
    <script>window.gtranslateSettings = {"default_language": "en", "languages": ["en", "tr"], "wrapper_selector": ".gtranslate_wrapper", "switcher_horizontal_position": "left", "switcher_vertical_position": "bottom", "float_switcher_open_direction": "bottom", "flag_style": "3d" }</script>
    <script src="https://cdn.gtranslate.net/widgets/latest/float.js" defer></script>

</body>
</html>