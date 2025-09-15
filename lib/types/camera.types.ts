export type CameraProps = {
  onReady?: (video: HTMLVideoElement) => void;
  onStill?: (dataUrl: string) => void;
  preferRearCamera?: boolean;
};
