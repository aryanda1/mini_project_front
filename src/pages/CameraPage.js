import React, { useEffect, useRef, useState } from "react";
import "./CameraPage.css";
import Sidenav from "./Sidenav";
import { Backdrop } from "@mui/material";
import { CircularProgress } from "@mui/material";
import artist from "../assests/Artists";
import AudioWaveform from "../components/AudioWave";
import { bufferToWav, cropBuffer, urlToBuffer } from "../assests/assist";
function CameraPage() {
  const [theme, setTheme] = useState([]);
  const [option, setOption] = useState("0");
  const [option1, setOption1] = useState("");
  const [upscale, setUpscale] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioInputRef = useRef(null);

  const handleThemeClick = (selectedTheme) => {
    if (theme.includes(selectedTheme))
      setTheme(theme.filter((theme) => theme !== selectedTheme));
    else setTheme((prev) => [...prev, selectedTheme]);
  };
  const handleradioButton = (option) => {
    setOption1(option);
  };

  const handleOptionSelect = (event) => {
    const selectedOption = event.target.value;
    setOption(selectedOption);
  };

  const handleUpscaleCheckbox = (event) => {
    const checked = event.target.checked;
    setUpscale(checked);
  };

  var myArray = artist;

  //audio recorder function
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  // const [cropURL, setCroppedURL] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingButtonClass, setRecordingButtonClass] =
    useState("recording-button");
  const [time, setTime] = useState([0, 0]);

  const chunks = [];
  const startRecording = () => {
    setAudioURL(null);
    setRecordingButtonClass("recording-btn recording");
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        recorder.start();
        setRecording(true);
        setMediaRecorder(recorder);

        recorder.addEventListener("dataavailable", (event) => {
          chunks.push(event.data);
        });

        recorder.addEventListener("stop", () => {
          const blob = new Blob(chunks);
          const file = new File([blob], "recording.wav", { type: "audio/wav" });
          // audioInputRef.current.files = [file];
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);

          const fileList = dataTransfer.files;
          audioInputRef.current.files = fileList;
          const url = URL.createObjectURL(blob);
          setAudioURL(url);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
    mediaRecorder.stop();
    setRecordingButtonClass("recording-btn");
  };

  const downloadAudio = () => {
    const link = document.createElement("a");
    link.href = audioURL;
    link.download = "recording.wav";
    document.body.appendChild(link);
    link.click();
  };

  const handleAudioUpload = (event) => {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    setAudioURL(url);
  };
  console.log(time);
  const base_url = process.env.REACT_APP_API_URL;

  // const handleSubmit = async (event) => {
  // event.preventDefault(); // prevent the default form submission behavior
  // const formData = new FormData(event.target); // get the form data
  // const url = `${base_url}/submit_form`; // replace this with your URL
  // formData.delete("audio");
  // try {
  //   const buffer = await urlToBuffer(audioURL);
  //   const croppedBuffer = cropBuffer(buffer, time[0], time[1]);
  //   const wavBytes = bufferToWav(croppedBuffer);
  //   const wav = new Blob([wavBytes], { type: "audio/wav" });
  //   const audioTemp = new File([wav], "my-audio-file.wav", {
  //     type: "audio/wav",
  //   });
  //   console.log(audioTemp);
  //   formData.append("audio", audioTemp, "temp.wav");
  //   setLoading(true);
  //   const response = await fetch(url, {
  //     method: "POST",
  //     body: formData,
  //   });
  //     const task = await response.json();
  //     console.log(task);
  //     const id = task.id;
  //     console.log(id);
  //     var refreshId = setInterval(async function () {
  //       const url = `${base_url}/get_video/${id}`;
  //       try {
  //         const response = await fetch(url, { method: "POST" });
  //         console.log(response);
  //         for (var pair of response.headers.entries()) {
  //           console.log(pair[0] + ": " + pair[1]);
  //           if (pair[1] === "video/mp4") {
  //             // key I'm looking for in this instance
  //             clearInterval(refreshId);
  //             console.log("k");
  //             const filename = "temp.mp4";
  //             const file = await response.blob();
  //             const url = URL.createObjectURL(file);
  //             const a = document.createElement("a");
  //             a.href = url;
  //             a.download = filename;
  //             document.body.appendChild(a);
  //             a.click();
  //             document.body.removeChild(a);
  //             setLoading(false);
  //           }
  //         }
  //         // if (response.headers.get("content-disposition")) {
  //         //   console.log("hi");
  //         // }
  //         console.log("Night");
  //       } catch (error) {
  //         clearInterval(refreshId);
  //         setLoading(false);
  //         console.log(error);
  //       }
  //     }, 60000);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const [sampleImages, setSampleImages] = useState([
    { url: "https://placekitten.com/200/200", alt: "Sample Image 1" },
    { url: "https://placekitten.com/201/200", alt: "Sample Image 2" },
    { url: "https://placekitten.com/202/200", alt: "Sample Image 3" },
    // Add more dummy images as needed
  ]);

  const [videoURL, setVideoURL] = useState(null);
  const [generateOption, setGenerateOption] = useState(null);
  const [sampleImageInterval, setSampleImageInterval] = useState(null);
  const [videoCheckInterval, setVideoCheckInterval] = useState(null);
  const [gid, setGid] = useState("");

  const checkSampleImages = async () => {
    try {
      const response = await fetch(`${base_url}/get_samples/${gid}`);
      if (response.ok) {
        const images = await response.json();
        setSampleImages(images);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkVideo = async () => {
    try {
      const response = await fetch(`${base_url}/get_video/${gid}`);
      if (response.ok) {
        for (var pair of response.headers.entries()) {
          if (pair[1] === "video/mp4") {
            const filename = "temp.mp4";
            const file = await response.blob();
            const url = URL.createObjectURL(file);
            setVideoURL(url);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setLoading(false);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const imageRouteCalls = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${base_url}/gen_samples/${gid}`);
      console.log(response.message);
    } catch (error) {
      console.log(error);
    }
    var sampleImageInterval = setInterval(() => {
      checkSampleImages(gid);
    }, 60000);

    const checkSampleInterval = setInterval(() => {
      if (sampleImages) {
        setLoading(false);
        clearInterval(sampleImageInterval);
        clearInterval(checkSampleInterval);
      }
    }, 1000);
  };
  const videoRouteCalls = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${base_url}/gen_video/${gid}`);
      console.log(response.message);
    } catch (error) {
      console.log(error);
    }
    var VideoInterval = setInterval(() => {
      checkVideo(gid);
    }, 60000);

    const checkVideoInterval = setInterval(() => {
      if (videoURL) {
        setLoading(false);
        clearInterval(VideoInterval);
        clearInterval(checkVideoInterval);
      }
    }, 1000);
  };
  const handleSubmit = async (event) => {
    event.preventDefault(); // prevent the default form submission behavior
    const formData = new FormData(event.target); // get the form data
    const url = `${base_url}/submit_form`; // replace this with your URL
    formData.delete("audio");
    try {
      const buffer = await urlToBuffer(audioURL);
      const croppedBuffer = cropBuffer(buffer, time[0], time[1]);
      const wavBytes = bufferToWav(croppedBuffer);
      const wav = new Blob([wavBytes], { type: "audio/wav" });
      const audioTemp = new File([wav], "my-audio-file.wav", {
        type: "audio/wav",
      });
      console.log(audioTemp);
      formData.append("audio", audioTemp, "temp.wav");
      setLoading(true);
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const task = await response.json();
      const id = task.id;
      setGid(id);
      imageRouteCalls();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  console.log(loading);
  const handleGenerateButtonClick = (action) => {
    console.log("action:", action);
    if (action === "regenerate") {
      setSampleImages([]);

      imageRouteCalls();
    } else if (action === "continue") {
      videoRouteCalls();
    }
  };
  useEffect(() => {
    return () => {
      if (sampleImageInterval) {
        clearInterval(sampleImageInterval);
      }
      if (videoCheckInterval) {
        clearInterval(videoCheckInterval);
      }
    };
  }, []);
  return (
    <>
      <Sidenav />
      <div className="Form">
        <Backdrop open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <div className="heading">Create your own video</div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="Form-group">
            <label>Record or Upload Audio:</label>
            <div>
              <div className="optionsgg">
                <input
                  type="radio"
                  name="audioOption"
                  value="record"
                  onClick={() => handleradioButton("record")}
                />{" "}
                Record
                <input
                  type="radio"
                  name="audioOption"
                  value="upload"
                  onClick={() => handleradioButton("upload")}
                />{" "}
                Upload
              </div>
              {option1 === "record" && (
                <div>
                  {" "}
                  <div>
                    <label htmlFor="record">Record Audio:</label>
                    <input
                      type="file"
                      id="audio"
                      name="audio"
                      accept="audio/*"
                      style={{ display: "none" }}
                      ref={audioInputRef}
                    />
                    {audioURL && (
                      <div style={{ height: 0 }}>
                        <button
                          onClick={downloadAudio}
                          className="download-button"
                          type="button"
                        >
                          Download Audio
                        </button>
                      </div>
                    )}

                    {recording ? (
                      <div>
                        Recording...
                        <div className="Stop">
                          <button
                            type="button"
                            className={recordingButtonClass}
                            onClick={stopRecording}
                          >
                            Stop Recording
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="recording-btn"
                        onClick={startRecording}
                        type="button"
                      >
                        Start Recording
                      </button>
                    )}
                    {!recording && (
                      <button
                        type="button"
                        onClick={() => setAudioURL(null)}
                        className="recording-btn"
                      >
                        Record Another
                      </button>
                    )}
                  </div>
                </div>
              )}
              {option1 === "upload" && (
                <div>
                  <label className="choose-file-button" htmlFor="audio">
                    Choose file
                  </label>
                  <input
                    type="file"
                    id="audio"
                    name="audio"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    style={{ display: "none" }}
                  />
                </div>
              )}
            </div>
            {audioURL && <AudioWaveform fileUrl={audioURL} setTime={setTime} />}
          </div>
          <div className="Form-group">
            <div className="inline-flex">
              <label>Artist:</label>{" "}
              <input
                type="text"
                readOnly
                value={theme.map((th) => myArray[th - 1].name).join(", ")}
                style={{ pointerEvents: "none" }}
                name="artist"
              />
            </div>
            <div className="Themes">
              {myArray.map((item) => (
                <div
                  key={item.id}
                  className={theme.includes(item.id) ? "gg" : ""}
                >
                  <div
                    // key={item.id}
                    className="box"
                    onClick={() => handleThemeClick(item.id)}
                  >
                    <img src={item.link} alt={item.name} />
                    <div className="titlet">Artist Name: {item.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="Form-group">
            <label>Option:</label>
            <div className="optionsgg">
              <input
                type="radio"
                name="option"
                value="0"
                checked={option === "0"}
                onChange={handleOptionSelect}
              />{" "}
              Music
              <input
                type="radio"
                name="option"
                value="1"
                checked={option === "1"}
                onChange={handleOptionSelect}
              />{" "}
              Music + Theme
              <input
                type="radio"
                name="option"
                value="2"
                checked={option === "2"}
                onChange={handleOptionSelect}
              />{" "}
              Theme
            </div>
          </div>
          <div className="Form-group inline-flex">
            <label>Theme:</label>
            <input
              style={{ verticalAlign: "middle" }}
              type="text"
              name="theme"
            />
          </div>
          <div className="Form-group">
            <label className="inline-label">Upscale:</label>
            {"   "}
            <input
              style={{ verticalAlign: "middle" }}
              type="checkbox"
              checked={upscale}
              onChange={handleUpscaleCheckbox}
              name="upscale"
            />
          </div>
          <button type="submit" className="recording-btn">
            Create Video
          </button>
        </form>
      </div>
      {sampleImages.length > 0 && (
        <div>
          <div className="SampleImages">
            <h3>Sample Images:</h3>
            <div className="ImageContainer">
              {sampleImages.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Sample Image ${index}`}
                />
              ))}
            </div>
          </div>
          <div className="RegenerateContinueButtons">
            <button
              className="recording-btn"
              onClick={() => handleGenerateButtonClick("regenerate")}
            >
              Regenerate
            </button>
            <button
              className="recording-btn"
              onClick={() => handleGenerateButtonClick("continue")}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CameraPage;
