import regeneratorRuntime from 'regenerator-runtime';
import '../scss/index.scss';

const socket = io();

const myVideo = document.querySelector('#myVideo');
const getMedia = async () => {
  try {
    const myStream = await window.navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    console.log(myStream);
    myVideo.srcObject = myStream;
  } catch (error) {
    console.log(error);
  }
};

getMedia();
