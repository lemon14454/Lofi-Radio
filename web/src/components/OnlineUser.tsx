import { useAuth } from "../context/AuthProvider";
import { TiArrowBack } from "react-icons/ti";

const OnlineUser = () => {
  const { onlineUser, modalOpen, setModalOpen } = useAuth()!;

  return (
    <div className={`modal ${modalOpen ? "opened" : ""}`}>
      <div className="online-user">
        {onlineUser && (
          <>
            <div className="back" onClick={() => setModalOpen(false)}>
              <TiArrowBack size={24} />
            </div>
            <h2>在線用戶</h2>
            <div className="users">
              {onlineUser.map(
                (user) =>
                  user && (
                    <div className="user-info" key={user.uid}>
                      <img
                        src={user.photoUrl}
                        alt={user.name}
                        width={60}
                        height={60}
                      />
                      <div className="user-detail">
                        <h3>
                          {user.name}
                          {user.host && <span>( 管理員 )</span>}
                        </h3>
                        <h4>@{user.email}</h4>
                      </div>
                    </div>
                  )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OnlineUser;
