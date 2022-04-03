import './vendors/bootstrap/css/bootstrap.min.css';
import './vendors/bootstrap/bootstrap.min.css';
import './vendors/fontawesome/css/all.min.css';
import './App.css';
import NavigationBar from "./components/navigation-bar";
import AlertsBar from "./components/alerts-bar";
import LoginForm from "./components/login";
import RegisterForm from "./components/register";

function App() {
  return (

      <div className='container row mt-2'>
          <div className='col-2'>
            <NavigationBar/>
          </div>
          <div className='col-7'>
              <LoginForm/>
              <RegisterForm/>
          </div>
          <div className='col-3'>
              <AlertsBar/>
          </div>
      </div>

  );
}

export default App;