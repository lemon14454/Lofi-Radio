import * as ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthProvider";
import { PlayerProvider } from "./context/PlayerProvider";
import { SocketProvider } from "./context/SocketProvider";

ReactDOM.render(
  <SocketProvider>
    <AuthProvider>
      <PlayerProvider>
        <App />
      </PlayerProvider>
    </AuthProvider>
  </SocketProvider>,
  document.getElementById("root")
);
