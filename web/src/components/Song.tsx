import { usePlayer } from "../context/PlayerProvider";
import ControlPanel from "./ControlPanel";
import { SpinIcon } from "../icons";

// 歌曲圖片 作者 播放鍵
const Song = () => {
  const { activeSong } = usePlayer()!;

  return (
    <div className="song">
      {activeSong ? (
        <>
          <img
            src={activeSong.cover}
            alt={activeSong.id}
            width={250}
            height={250}
          />
          <div className="detail">
            <h2>{activeSong.name}</h2>
            <h3>{activeSong.artist}</h3>
            <ControlPanel />
          </div>
        </>
      ) : (
        <div className="loading-songpage">
          <SpinIcon />
          <h3>
            讀取資料中請稍候
            <span>...</span>
          </h3>
        </div>
      )}
    </div>
  );
};

export default Song;
