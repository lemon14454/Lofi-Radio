import { usePlayer } from "../context/PlayerProvider";
import Library from "./Library";
import OnlineUser from "./OnlineUser";
import Song from "./Song";

const Dashboard = () => {
  const { audioRef, timeUpdateHandler, nextSongHandler } = usePlayer()!;

  return (
    <div className="dashboard">
      <audio
        ref={audioRef}
        onLoadedMetadata={timeUpdateHandler}
        onTimeUpdate={timeUpdateHandler}
        onEnded={nextSongHandler}
        muted
      />
      <Song />
      <Library />
      <OnlineUser />
    </div>
  );
};

export default Dashboard;
