package com.shapebeats.audio

import android.content.Context
import android.util.Base64
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.IOException
import java.io.InputStream

class AudioAssetLoaderModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "AudioAssetLoader"
    }

    @ReactMethod
    fun loadAudioAsset(assetPath: String, promise: Promise) {
        try {
            val context = reactApplicationContext
            val inputStream: InputStream = context.assets.open(assetPath)
            
            val bytes = inputStream.readBytes()
            inputStream.close()
            
            val base64 = Base64.encodeToString(bytes, Base64.NO_WRAP)
            
            val result = Arguments.createMap().apply {
                putString("base64", base64)
                putInt("size", bytes.size)
                putString("path", assetPath)
            }
            
            promise.resolve(result)
            
        } catch (e: IOException) {
            promise.reject("ASSET_LOAD_ERROR", "Failed to load asset: $assetPath", e)
        } catch (e: Exception) {
            promise.reject("UNKNOWN_ERROR", "Unknown error loading asset: $assetPath", e)
        }
    }

    @ReactMethod
    fun loadAudioAssetAsArrayBuffer(assetPath: String, promise: Promise) {
        try {
            val context = reactApplicationContext
            val inputStream: InputStream = context.assets.open(assetPath)
            
            val bytes = inputStream.readBytes()
            inputStream.close()
            
            val array = Arguments.createArray()
            for (byte in bytes) {
                array.pushInt(byte.toInt() and 0xFF)
            }
            
            promise.resolve(array)
            
        } catch (e: IOException) {
            promise.reject("ASSET_LOAD_ERROR", "Failed to load asset: $assetPath", e)
                } catch (e: Exception) {
            promise.reject("UNKNOWN_ERROR", "Unknown error loading asset: $assetPath", e)
        }
    }

    @ReactMethod
    fun assetExists(assetPath: String, promise: Promise) {
        try {
            val context = reactApplicationContext
            val exists = try {
                context.assets.open(assetPath).close()
                true
            } catch (e: IOException) {
                false
            }
            
            promise.resolve(exists)
            
        } catch (e: Exception) {
            promise.reject("UNKNOWN_ERROR", "Unknown error checking asset: $assetPath", e)
        }
    }

    @ReactMethod
    fun listAssets(directory: String, promise: Promise) {
        try {
            val context = reactApplicationContext
            val assets = context.assets.list(directory) ?: emptyArray()
            
            val array = Arguments.createArray()
            for (asset in assets) {
                array.pushString(asset)
            }
            
            promise.resolve(array)
            
        } catch (e: Exception) {
            promise.reject("UNKNOWN_ERROR", "Unknown error listing assets in: $directory", e)
        }
    }
}
