import { useAuth } from "../context/AuthProvider";
import { usePlayer } from "../context/PlayerProvider";
import { FaPlay, FaForward, FaBackward, FaPause, FaUser } from "react-icons/fa";
import { HiStatusOffline, HiStatusOnline } from "react-icons/hi";
import { GoMute, GoUnmute } from "react-icons/go";
import { FiLogOut } from "react-icons/fi";

// 播放鍵 上下一首 使用者管理權限認證
const ControlPanel = () => {
  const {
    playAndPauseMusicHandler,
    nextSongHandler,
    prevSongHandler,
    dragHandler,
    songInfo,
    isPlaying,
    audioRef,
  } = usePlayer()!;

  const { isHostOnline, user, signout, setModalOpen } = useAuth()!;

  const getTime = (time: number) => {
    return (
      Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
    );
  };

  const trackAnim = {
    transform: `translateX(${songInfo.animationPercentage}%)`,
  };

  return (
    <div className="control-panel">
      {user && user.host && (
        <div className="play-control">
          <FaBackward onClick={prevSongHandler} size={20} />
          {isPlaying ? (
            <FaPause onClickCapture={playAndPauseMusicHandler} size={28} />
          ) : (
            <FaPlay onClickCapture={playAndPauseMusicHandler} size={28} />
          )}
          <FaForward onClick={nextSongHandler} size={20} />
        </div>
      )}

      {user && !user.host && (
        <>
          {isHostOnline ? (
            <div className="host-online">
              <HiStatusOnline size={24} />
              <h3>主持人在線中</h3>
            </div>
          ) : (
            <div className="host-offline">
              <HiStatusOffline size={24} />
              <h3>主持人離線中</h3>
            </div>
          )}
        </>
      )}

      <div className="tools">
        <div onClick={() => (audioRef.current.muted = !audioRef.current.muted)}>
          {audioRef.current && audioRef.current.muted ? (
            <div className="mute">
              <GoMute size={24} />
              <h6>您目前為靜音</h6>
            </div>
          ) : (
            <GoUnmute size={24} />
          )}
        </div>

        <div onClick={() => signout()}>
          <FiLogOut size={24} />
        </div>

        <div onClick={() => setModalOpen(true)}>
          <FaUser size={20} />
        </div>
      </div>

      <div className="track">
        {user && user.host ? (
          <input
            min={0}
            max={songInfo.duration || 0}
            onChange={dragHandler}
            type="range"
          />
        ) : (
          <input
            min={0}
            max={songInfo.duration || 0}
            readOnly
            disabled
            type="range"
          />
        )}
        <div className="animate-track" style={trackAnim} />
      </div>

      <div className="time-control">
        <p>{getTime(songInfo.currentTime)}</p>
        <p>{getTime(songInfo.duration)}</p>
      </div>
    </div>
  );
};

export default ControlPanel;
