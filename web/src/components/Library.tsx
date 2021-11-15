import { useAuth } from "../context/AuthProvider";
import { usePlayer } from "../context/PlayerProvider";
import { SongType } from "../types";

// 播放清單 播放中的歌曲要是亮的
const LibrarySong = (song: SongType) => {
  const { activeSong, switchSongHandler } = usePlayer()!;
  const { user } = useAuth()!;

  const songSelectHandler = () => {
    if (!user || !user.host) return;
    switchSongHandler(song);
  };

  return (
    <>
      {activeSong ? (
        <div
          onClick={songSelectHandler}
          className={`library-song ${
            activeSong.id === song.id ? "selected" : ""
          }`}
        >
          <img src={song.cover} alt={song.id} width={50} height={50} />
          <div className="song-description">
            <h3>{song.name}</h3>
            <h4>{song.artist}</h4>
          </div>
        </div>
      ) : (
        <div className="loading-song">
          <div className="loading-image" />
          <div className="loading-descrip">
            <h3></h3>
            <h4></h4>
          </div>
        </div>
      )}
    </>
  );
};

const LoadingSong = () => {
  return (
    <div className="loading-song">
      <div className="loading-image" />
      <div className="loading-descrip">
        <h3></h3>
        <h4></h4>
      </div>
    </div>
  );
};

const Library = () => {
  const { songs } = usePlayer()!;
  const { user } = useAuth()!;

  return (
    <div className="library">
      <h2>
        歌曲清單
        <span>{user && !user.host && "( 僅有管理員能控制音樂 )"}</span>
      </h2>
      <div className="library-songs">
        {songs
          ? songs.map((song) => <LibrarySong {...song} key={song.id} />)
          : [...Array(5).keys()].map((x) => <LoadingSong key={x} />)}
      </div>
    </div>
  );
};

export default Library;
