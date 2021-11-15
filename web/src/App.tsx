import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { useAuth } from "./context/AuthProvider";

import "./styles/app.scss";

const App = () => {
  const auth = useAuth();

  return (
    <div>
      <main className="container">
        {auth!.user ? <Dashboard /> : <Login />}
      </main>
    </div>
  );
};

export default App;
