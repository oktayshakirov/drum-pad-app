import {NativeModules} from 'react-native';

interface AudioAssetLoaderInterface {
  loadAudioAsset(assetPath: string): Promise<{
    base64: string;
    size: number;
    path: string;
  }>;

  loadAudioAssetAsArrayBuffer(assetPath: string): Promise<number[]>;

  /** Copies APK asset to cache; returns file:// URI for fetch() (avoids huge bridge payloads). */
  copyAudioAssetToCache(assetPath: string): Promise<string>;

  assetExists(assetPath: string): Promise<boolean>;

  listAssets(directory: string): Promise<string[]>;
}

const {AudioAssetLoader} = NativeModules;

export default AudioAssetLoader as AudioAssetLoaderInterface;
