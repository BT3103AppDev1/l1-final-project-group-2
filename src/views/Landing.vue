<template>
  <div class="container">
    <!-- Logo container with the project logo -->
    <div class="logo-container">
      <img class="logo" src="../photos/logo.png">
    </div>

    <!-- Section for the landing page image -->
    <section class="images">
      <div class="img-container">
        <img src="../photos/landing.png">
      </div>
    </section>

    <!-- Landing page content -->
    <div class="landing">
      <h1>Empowering Teams, Streamlining Workflows </h1>
      <div class="button-container">
        <!-- Router link for the login page -->
        <router-link to="/login">
          <button>Login</button>
        </router-link>
        <!-- Router link for the registration page -->
        <router-link to="/register">
          <button>Register</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style>
  /* Styles for the body element */
  body {
    overflow-x: hidden;
    padding-bottom: 50px;
  }

  /* Styles for the main container */
  .container {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}


  /* Styles for the landing page image section */
  .images {
    height: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Styles for the logo container */
  .logo-container {
    height: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -15px;
  }

  /* Styles for the project logo */
  .logo {
    height: auto;
    width: 50%;
    max-width: 200px;
  }

  /* Styles for the image container */
  .img-container {
    height: 80%;
    width: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -250px;
  }

  /* Styles for the landing page image */
  .img-container img {
    height: auto;
    width: 80%;
    min-height: 80%;
    min-width: 80%;
  }

  /* Styles for the landing page content */
  .landing {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    margin-top: -200px;
    margin-bottom: -10px;
  }

  /* Styles for the button container */
  .button-container {
    display: flex;
    gap: 20px;
    margin-bottom: 35px;
  }

  /* Styles for the button element */
  button {
    background-color: #7784ee;
    color: white;
    padding: 15px 30px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1.2rem;
  }

  /* Styles for the landing page heading */
  h1 {
    margin-bottom: 20px;
  }

  /* Media query for screens up to 768px wide */
  @media screen and (max-width: 768px) {
    /* Styles for the project logo */
    .logo {
      width: 30%;
    }

    /* Styles for the image container */
    .img-container {
      margin-top: -150px;
    }

    /* Styles for the landing page image 
    .img-container img {
      width: 100%;
      min-height: 100%;
    }

    /* Styles for the landing page content*/

  .landing {
    margin-top: -200px;
  }

  .button-container {
    flex-direction: row;
    align-items: center;
  }

  button {
    margin-bottom: 0;
  }
}


  </style>
  