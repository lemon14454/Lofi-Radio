import { usePlayer } from "../context/PlayerProvider";
import Library from "./Library";
import OnlineUser from "./OnlineUser";
import Song from "./Song";

const Dashboard = () => {
  const { audioRef, activeSong, timeUpdateHandler, nextSongHandler } =
    usePlayer()!;

  return (
    <div className="dashboard">
      {activeSong && (
        <audio
          ref={audioRef}
          src={activeSong.audio}
          onLoadedMetadata={timeUpdateHandler}
          onTimeUpdate={timeUpdateHandler}
          onEnded={nextSongHandler}
          muted
        />
      )}
      <Song />
      <Library />
      <OnlineUser />
    </div>
  );
};

export default Dashboard;
