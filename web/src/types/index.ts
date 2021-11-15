export type SongType = {
  id: string;
  artist: string;
  audio: string;
  cover: string;
  name: string;
};

export type SongInfoType = {
  currentTime: number;
  duration: number;
  animationPercentage: number;
};

export type UserType =
  | {
      uid: string;
      email: string;
      name: string;
      photoUrl: string;
      host?: boolean;
      token?: string;
    }
  | false;
