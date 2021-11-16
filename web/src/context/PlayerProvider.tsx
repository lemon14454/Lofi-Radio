import { getAllSongs } from "../lib/db";
import {
  ChangeEvent,
  createContext,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { SongInfoType, SongType } from "../types";
import { useAuth } from "./AuthProvider";
import { useSocket } from "./SocketProvider";

interface SocketRequestProps {
  activeSongIO?: SongType;
  isPlayingIO?: boolean;
  songInfoIO?: SongInfoType;
}

interface ContextInterface {
  songs: SongType[];
  audioRef: MutableRefObject<HTMLAudioElement | null>;
  playAndPauseMusicHandler: () => void;
  timeUpdateHandler: () => void;
  switchSongHandler: (switchedSong: SongType) => void;
  nextSongHandler: () => void;
  prevSongHandler: () => void;
  dragHandler: (e: ChangeEvent<HTMLInputElement>) => void;
  songInfo: SongInfoType;
  activeSong: SongType;
  isPlaying: boolean;
}

interface ProviderProps {
  children?: React.ReactNode;
}

const PlayerContext = createContext<ContextInterface | null>(null);

export function usePlayer() {
  return useContext(PlayerContext);
}

export function PlayerProvider({ children }: ProviderProps) {
  const [songs, setSongs] = useState<SongType[]>([]);
  const [activeSong, setActiveSong] = useState<SongType>(songs[0]);
  const [songInfo, setSongInfo] = useState<SongInfoType>({
    currentTime: 0,
    animationPercentage: 0,
    duration: 0,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const { socket } = useSocket()!;
  const { user, isHostOnline } = useAuth()!;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchSongs = async () => {
    const { songsData } = await getAllSongs();
    audioRef.current.src = songsData[0].audio;
    setSongs(songsData);
    setActiveSong(songsData[0]);
  };

  // 獲取歌曲資料，每次登入只需執行一次
  useEffect(() => {
    if (user && audioRef.current) {
      fetchSongs();
    }
  }, [user]);

  // Socket Request
  const socketRequest = (Props: SocketRequestProps) => {
    // 是 host 才能控制音樂面板
    if (user && user.host) {
      socket!.emit("player", Props);
    }
  };

  // 播放 暫停
  const playAndPauseMusicHandler = () => {
    socketRequest({
      isPlayingIO: !isPlaying,
    });
  };

  // 指定歌曲
  const switchSongHandler = (switchedSong: SongType) => {
    if (activeSong !== switchedSong) {
      socketRequest({
        activeSongIO: switchedSong,
        isPlayingIO: false,
        songInfoIO: songInfo,
      });

      setTimeout(
        () =>
          socketRequest({
            isPlayingIO: true,
          }),
        300
      );
    }
  };

  // 下一首
  const nextSongHandler = () => {
    const nextSongIndex =
      (songs.findIndex((song) => song.id === activeSong.id) + 1) % songs.length;
    switchSongHandler(songs[nextSongIndex]);
  };

  // 上一首
  const prevSongHandler = () => {
    const prevSongIndex =
      (songs.findIndex((song) => song.id === activeSong.id) -
        1 +
        songs.length) %
      songs.length;
    switchSongHandler(songs[prevSongIndex]);
  };

  // 時間軸拖動
  const dragHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newSongInfo = {
      currentTime: Number(e.target.value),
      duration: songInfo.duration,
      animationPercentage: songInfo.animationPercentage,
      drag: true,
    };
    socketRequest({
      songInfoIO: newSongInfo,
    });
  };

  // 時間軸更新
  const timeUpdateHandler = () => {
    const current = audioRef.current!.currentTime;
    const duration = audioRef.current!.duration;
    const newSongInfo = {
      currentTime: current,
      duration,
      animationPercentage: Math.round(
        (Math.round(current) / Math.round(duration)) * 100
      ),
    };
    socketRequest({
      songInfoIO: newSongInfo,
    });
  };

  useEffect(() => {
    if (!isHostOnline && audioRef.current) {
      setTimeout(() => {
        audioRef.current.pause();
      }, 150);
    }
  }, [isHostOnline]);

  // 接收歌曲狀態及資訊
  useEffect(() => {
    if (socket) {
      socket.on("player", ({ activeSongIO, isPlayingIO, songInfoIO }) => {
        if (isPlayingIO !== undefined) {
          if (isPlayingIO) {
            audioRef.current.play();
          } else {
            audioRef.current.pause();
          }
          setIsPlaying(isPlayingIO);
        }

        if (activeSongIO) {
          setActiveSong(activeSongIO);
          audioRef.current.src = activeSongIO.audio;
        }

        if (songInfoIO) setSongInfo(songInfoIO);

        // 進行時間軸控制時觸發
        if (songInfoIO && songInfoIO.drag) {
          audioRef.current.currentTime = songInfoIO.currentTime;
        }
      });
    } else {
      return;
    }
    return () => {
      socket.off("player");
    };
  }, [socket]);

  const value = {
    songs,
    audioRef,
    playAndPauseMusicHandler,
    timeUpdateHandler,
    switchSongHandler,
    nextSongHandler,
    prevSongHandler,
    dragHandler,
    songInfo,
    activeSong,
    isPlaying,
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}
