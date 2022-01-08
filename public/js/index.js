import regeneratorRuntime from 'regenerator-runtime';
import '../scss/index.scss';

const roomWrapper = document.querySelector('#roomWrapper');
const roomForm = roomWrapper.querySelector('#roomForm');
const roomInput = roomForm.querySelector('#roomInput');
const videoWrapper = document.querySelector('#videoWrapper');
const myVideo = document.querySelector('#myVideo');
const audioBtn = document.querySelector('#audioBtn');
const videoBtn = document.querySelector('#videoBtn');
const cameraSelect = document.querySelector('#cameraSelect');
const socket = io();

let myStream;
let audioOff = false;
let videoOff = false;
let currentRoom = '';

const getDevices = async () => {
  try {
    const devices = await window.navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => {
      return device.kind === 'videoinput';
    });
    cameras.forEach((camera) => {
      const cameraOption = document.createElement('option');
      cameraOption.value = cameraOption.deviceId;
      cameraOption.innerHTML = camera.label;
      cameraSelect.append(cameraOption);
    });
  } catch (error) {
    console.log(error);
  }
};

const getMedia = async (selectedCamera) => {
  const initDevice = {
    audio: true,
    video: { facingMode: 'user' ? 'user' : true },
  };
  const newDevice = {
    audio: true,
    video: { deviceId: selectedCamera },
  };
  try {
    myStream = await window.navigator.mediaDevices.getUserMedia(
      selectedCamera ? newDevice : initDevice
    );
    myVideo.srcObject = myStream;
  } catch (error) {
    console.log(error);
  }
};

audioBtn.addEventListener('click', (e) => {
  myStream.getAudioTracks().forEach((track) => {
    if (audioOff === false) {
      audioBtn.innerHTML = 'Audio Off';
      audioOff = true;
      track.enabled = false;
    } else {
      audioBtn.innerHTML = 'Audio On';
      audioOff = false;
      track.enabled = true;
    }
  });
});

videoBtn.addEventListener('click', (e) => {
  myStream.getVideoTracks().forEach((track) => {
    if (videoOff === false) {
      videoBtn.innerHTML = 'Video Off';
      videoOff = true;
      track.enabled = false;
    } else {
      videoBtn.innerHTML = 'Video On';
      videoOff = false;
      track.enabled = true;
    }
  });
});

cameraSelect.addEventListener('change', (e) => {
  const selectedCamera = cameraSelect.value;
  getMedia(selectedCamera);
  audioOff = false;
  videoOff = false;
  audioBtn.innerHTML = 'Audio Off';
  videoBtn.innerHTML = 'Video Off';
});

const cameraStart = async () => {
  roomWrapper.hidden = true;
  await getDevices();
  await getMedia();
  videoWrapper.hidden = false;
};

socket.on('welcomeRoom', () => {
  console.log('someone joined');
});

roomForm.addEventListener('submit', (e) => {
  e.preventDefault();
  try {
    socket.emit('joinRoom', roomInput.value, cameraStart);
    currentRoom = roomInput.value;
  } catch (error) {
    console.log(error);
  }
});

const init = () => {
  videoWrapper.hidden = true;
};
init();
