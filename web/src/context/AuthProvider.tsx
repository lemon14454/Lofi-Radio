import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { createUser } from "../lib/db";
import { UserType } from "../types";
import { useSocket } from "./SocketProvider";

interface ContextInterface {
  user: UserType;
  loading: boolean;
  signInWithGoogle: () => Promise<UserType>;
  signout: () => Promise<UserType>;
  isHostOnline: boolean;
  onlineUser: UserType[];
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

const HOST_EMAIL = "lemon14454@gmail.com";

const AuthContext = createContext<ContextInterface | null>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType>(false);
  const [isHostOnline, setIsHostOnline] = useState(false);
  const [onlineUser, setOnlineUser] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { socket } = useSocket()!;

  const handleUser: (_: any) => UserType = useCallback(
    (rawUser) => {
      if (rawUser) {
        // 使用者登入，重新建立使用者物件
        const user: UserType = formatUser(rawUser);
        const { token, ...userWithoutToken } = user;
        createUser(user.uid, userWithoutToken);
        setUser(user);
        setLoading(false);

        if (socket) {
          socket.emit("online", user);
        }

        return user;
      } else {
        // 登出
        setUser(false);
        setLoading(false);
        return false;
      }
    },
    [socket]
  );

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, new GoogleAuthProvider()).then((response) =>
      handleUser(response.user)
    );
  };

  const signout = () => {
    return signOut(auth).then(() => handleUser(false));
  };

  // 偵測使用者是否登入或登出
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleUser);
    return () => unsubscribe();
  }, [handleUser]);

  // 接收 Socket 訊號
  useEffect(() => {
    if (socket) {
      socket.on("online", (onlineUsers) => {
        setOnlineUser(onlineUsers);
        // 檢查主持人是否在線上
        const checkHost =
          onlineUsers.filter(
            (onlineUser: UserType) => onlineUser && onlineUser.host
          ).length > 0;
        setIsHostOnline(checkHost);
      });
    } else {
      return;
    }
  }, [socket]);

  const value = {
    user,
    loading,
    signInWithGoogle,
    signout,
    isHostOnline,
    onlineUser,
    modalOpen,
    setModalOpen,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const formatUser = (user: any) => {
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    photoUrl: user.photoURL,
    token: user.accessToken,
    host: user.email === HOST_EMAIL,
  };
};
