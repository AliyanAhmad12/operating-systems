import { Platform } from 'react-native';
import * as ExpoAudio from 'expo-audio';
import { Audio as ExpoAVAudio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';

const ALARM_ASSET = require('../../assets/alarm.mp3');

class AlertAudioService {
  constructor() {
    this.primaryPlayer = null;
    this.fallbackSound = null;
    this.isPlaying = false;
    this.volume = 1.0;
    this.isLooping = true;
    this.engineUsed = null; // 'expo-audio' or 'expo-av'
    this.statusListeners = new Set();
    this.timer = null;
    this.playbackSeconds = 0;
  }

  subscribe(listener) {
    this.statusListeners.add(listener);
    // emit current state immediately
    listener(this.getStatus());
    return () => this.statusListeners.delete(listener);
  }

  notifyListeners() {
    const status = this.getStatus();
    this.statusListeners.forEach((listener) => {
      try {
        listener(status);
      } catch (err) {
        console.warn('Audio listener error:', err);
      }
    });
  }

  getStatus() {
    return {
      isPlaying: this.isPlaying,
      volume: this.volume,
      isLooping: this.isLooping,
      playbackSeconds: this.playbackSeconds,
      engine: this.engineUsed,
      platform: Platform.OS,
      maxSystemGain: 1.0,
      backgroundCapable: true,
    };
  }

  async configureAudioMode() {
    // Configure expo-audio background mode
    try {
      if (ExpoAudio && typeof ExpoAudio.setAudioModeAsync === 'function') {
        await ExpoAudio.setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: true,
          interruptionMode: 'doNotMix',
        });
      }
    } catch (e) {
      console.warn('expo-audio setAudioModeAsync warning:', e);
    }

    // Configure expo-av mode as fallback
    try {
      if (ExpoAVAudio && typeof ExpoAVAudio.setAudioModeAsync === 'function') {
        await ExpoAVAudio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: false,
          interruptionModeIOS: InterruptionModeIOS ? InterruptionModeIOS.DoNotMix : 1,
          interruptionModeAndroid: InterruptionModeAndroid ? InterruptionModeAndroid.DoNotMix : 1,
          playThroughEarpieceAndroid: false,
        });
      }
    } catch (e) {
      console.warn('expo-av setAudioModeAsync warning:', e);
    }
  }

  async startAlert() {
    if (this.isPlaying) return;

    await this.configureAudioMode();
    this.playbackSeconds = 0;

    let started = false;

    // Strategy 1: Attempt modern expo-audio engine
    try {
      if (ExpoAudio && typeof ExpoAudio.createAudioPlayer === 'function') {
        if (!this.primaryPlayer) {
          this.primaryPlayer = ExpoAudio.createAudioPlayer(ALARM_ASSET, {
            updateInterval: 500,
          });
        }
        if (this.primaryPlayer) {
          this.primaryPlayer.loop = true;
          this.primaryPlayer.volume = 1.0;
          if (typeof this.primaryPlayer.setActiveForLockScreen === 'function') {
            try {
              this.primaryPlayer.setActiveForLockScreen(true, {
                showSeekForward: false,
                showSeekBackward: false,
              });
            } catch (lockErr) {
              console.log('Lockscreen controls note:', lockErr);
            }
          }
          this.primaryPlayer.play();
          this.engineUsed = 'expo-audio (Modern Core)';
          started = true;
        }
      }
    } catch (err) {
      console.warn('Primary expo-audio engine attempt failed, switching to fallback:', err);
    }

    // Strategy 2: If expo-audio not available/threw, fallback to expo-av
    if (!started) {
      try {
        if (!this.fallbackSound) {
          const { sound } = await ExpoAVAudio.Sound.createAsync(
            ALARM_ASSET,
            {
              shouldPlay: true,
              isLooping: true,
              volume: 1.0,
            }
          );
          this.fallbackSound = sound;
        } else {
          await this.fallbackSound.setIsLoopingAsync(true);
          await this.fallbackSound.setVolumeAsync(1.0);
          await this.fallbackSound.playAsync();
        }
        this.engineUsed = 'expo-av (Legacy Engine)';
        started = true;
      } catch (fallbackErr) {
        console.error('Both audio engines encountered errors:', fallbackErr);
        throw fallbackErr;
      }
    }

    this.isPlaying = true;
    this.volume = 1.0;
    this.isLooping = true;

    // Start timer for duration tracking
    this.startTimer();
    this.notifyListeners();
  }

  async stopAlert() {
    this.stopTimer();
    this.playbackSeconds = 0;
    this.isPlaying = false;

    if (this.primaryPlayer) {
      try {
        this.primaryPlayer.pause();
        if (typeof this.primaryPlayer.seekTo === 'function') {
          await this.primaryPlayer.seekTo(0);
        }
        if (typeof this.primaryPlayer.setActiveForLockScreen === 'function') {
          this.primaryPlayer.setActiveForLockScreen(false);
        }
      } catch (err) {
        console.warn('Error pausing primary player:', err);
      }
    }

    if (this.fallbackSound) {
      try {
        await this.fallbackSound.stopAsync();
        await this.fallbackSound.setPositionAsync(0);
      } catch (err) {
        console.warn('Error stopping fallback sound:', err);
      }
    }

    this.notifyListeners();
  }

  async setVolume(newVolume) {
    const clamped = Math.max(0, Math.min(1.0, newVolume));
    this.volume = clamped;

    if (this.primaryPlayer) {
      try {
        this.primaryPlayer.volume = clamped;
      } catch (e) {}
    }

    if (this.fallbackSound) {
      try {
        await this.fallbackSound.setVolumeAsync(clamped);
      } catch (e) {}
    }

    this.notifyListeners();
  }

  startTimer() {
    this.stopTimer();
    this.timer = setInterval(() => {
      this.playbackSeconds += 1;
      this.notifyListeners();
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  async destroy() {
    await this.stopAlert();
    if (this.primaryPlayer && typeof this.primaryPlayer.release === 'function') {
      try {
        this.primaryPlayer.release();
      } catch (e) {}
      this.primaryPlayer = null;
    }
    if (this.fallbackSound) {
      try {
        await this.fallbackSound.unloadAsync();
      } catch (e) {}
      this.fallbackSound = null;
    }
    this.statusListeners.clear();
  }
}

export const AudioService = new AlertAudioService();
