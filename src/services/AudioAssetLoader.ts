import {NativeModules} from 'react-native';

interface AudioAssetLoaderInterface {
  loadAudioAsset(assetPath: string): Promise<{
    base64: string;
    size: number;
    path: string;
  }>;

  loadAudioAssetAsArrayBuffer(assetPath: string): Promise<number[]>;

  assetExists(assetPath: string): Promise<boolean>;

  listAssets(directory: string): Promise<string[]>;
}

const {AudioAssetLoader} = NativeModules;

export default AudioAssetLoader as AudioAssetLoaderInterface;
