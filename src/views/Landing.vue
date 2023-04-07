
  
  <template>
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
  </template>
  
  <style>
  .images {
    height: 100vh;
    display: flex;
    justify-content: center;
  }
  .logo { 
    height: 25%;
    width: 25%;

  }
  .logo-container {
  position: absolute;
 
}

  
  .img-container {
    height: 80%;
    width: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .img-container img {
    object-fit: contain;
    max-height: 100%;
    max-width: 100%;
  }
  
  .landing {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    margin-top: -300px;
  }
  
  .button-container {
    display: flex;
    gap: 20px;
    
  }
  
  button {
    background-color: blue;
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
  </style>
  
  