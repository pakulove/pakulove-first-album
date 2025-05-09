export type TPicturesAtTime = {
  second: number;
  name: string;
};

export type TTrack = {
  url: string;
  title: string;
  picturesAtTime: TPicturesAtTime[];
  productBy: string;
  coverURL: string;
};
