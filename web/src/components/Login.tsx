import { useAuth } from "../context/AuthProvider";
import { GoogleIcon } from "../icons";

const Login = () => {
  const { signInWithGoogle } = useAuth()!;

  return (
    <div className="login">
      <h1>Lofi Radio</h1>
      <p>
        Lofi Radio 是一個即時的多人音樂播放軟體，使用者可以透過 Google
        帳號登入與其他人共享音樂，但只有擁有管理員權限者才擁有掌控音樂控制權。
      </p>
      <button onClick={() => signInWithGoogle()}>
        <GoogleIcon />
        透過 Google 登入
      </button>
    </div>
  );
};

export default Login;
