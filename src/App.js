import logo from './assets/bedreflyt-logo.webp';
import './App.css';
import CustomNavbar from './components/ui/navbar.tsx';

function App() {
  return (
    <div className="App">
      <CustomNavbar />
      <header className="App-header">
        <img src={logo} className="AppLogo" width="300" height="300" alt="logo" />
        <p className="text-3xl font-bold underline">
          Welcome to the BedreFlyt app!
        </p>
      </header>
    </div>
  );
}

export default App;
