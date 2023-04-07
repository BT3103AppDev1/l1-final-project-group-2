
  
  <template>
    <div class="container">
      <div class="logo-container">
        <img class="logo" src="../photos/logo.png">
      </div>
      <section class="images">
        <div class="img-container">
          <img src="../photos/landing.png">
        </div>
      </section>
      <div class="landing">
        <h1>Empowering Teams, Streamlining Workflows </h1>
        <div class="button-container">
          <router-link to="/login">
            <button>Login</button>
          </router-link>
          <router-link to="/register">
            <button>Register</button>
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <style>
  body {
  overflow-x: hidden;
}

.container {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.images {
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-container {
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  height: auto;
  width: 50%;
  max-width: 200px;
}

.img-container {
  height: 80%;
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -250px;
}

.img-container img {
  height: auto;
  width: 80%;
  min-height: 80%;
  min-width: 80%;
}

.landing {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  margin-top: -200px;
  margin-bottom: -10px;
}

.button-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

button {
  background-color: rgb(12, 26, 182);;
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.2rem;
}

h1 {
  margin-bottom: 20px;
}

/* For screens up to 768px wide */
@media screen and (max-width: 768px) {
  .logo {
    width: 30%;
  }

  .img-container {
    margin-top: -150px;
  }

  .img-container img {
    width: 100%;
    min-height: 100%;
  }

  .landing {
    margin-top: -100px;
  }

  .button-container {
    flex-direction: column;
    align-items: center;
  }

  button {
    margin-bottom: 10px;
  }
}

/* For screens larger than 768px wide */
@media screen and (min-width: 769px) {
  .logo {
    width: 50%;
  }

  .img-container {
    margin-top: -250px;
  }

  .img-container img {
    width: 80%;
    min-height: 80%;
  }

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
  