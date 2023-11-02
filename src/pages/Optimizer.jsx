import React, { useContext, useEffect, useState } from "react"
import styles from "./Optimizer.module.css"
import { ViewMode, ViewContext } from "../context/ViewContext"
import { SceneContext } from "../context/SceneContext"
import CustomButton from "../components/custom-button"
import { LanguageContext } from "../context/LanguageContext"
import { SoundContext } from "../context/SoundContext"
import { AudioContext } from "../context/AudioContext"
import FileDropComponent from "../components/FileDropComponent"
import { getFileNameWithoutExtension } from "../library/utils"
import { loadVRM, addVRMToScene } from "../library/load-utils"
import { downloadVRM } from "../library/download-utils"

function Optimizer({
  animationManager,
}) {
  const { isLoading, setViewMode } = React.useContext(ViewContext)
  const {
    model,
  } = React.useContext(SceneContext)
  
  const [currentVRM, setCurrentVRM] = useState(null);
  const [nameVRM, setNameVRM] = useState("");

  const { playSound } = React.useContext(SoundContext)
  const { isMute } = React.useContext(AudioContext)

  const back = () => {
    !isMute && playSound('backNextButton');
    setViewMode(ViewMode.LANDING)
  }

  const download = () => {
    const vrmData = currentVRM.userData.vrm
    downloadVRM(model, vrmData,nameVRM + "_merged",null,4096,1,true, null, true)
  }

  // const debugMode = () =>{
  //   console.log("debug")
  // }

  // Translate hook
  const { t } = useContext(LanguageContext)

  const handleAnimationDrop = async (file) => {
    const animName = getFileNameWithoutExtension(file.name);
    const path = URL.createObjectURL(file);

    await animationManager.loadAnimation(path, true, "", animName);
  }

  const handleVRMDrop = async (file) =>{
    const path = URL.createObjectURL(file);
    const vrm = await loadVRM(path);
    const name = getFileNameWithoutExtension(file.name);

    setNameVRM(name);
    setCurrentVRM(vrm);
    

    addVRMToScene(vrm, model)
    //setUploadVRMURL(path);
  }

  const handleFilesDrop = async(files) => {
    const file = files[0];
    // Check if the file has the .fbx extension
    if (file && file.name.toLowerCase().endsWith('.fbx')) {
      handleAnimationDrop(file);
    } 
    if (file && file.name.toLowerCase().endsWith('.vrm')) {
      handleVRMDrop(file);
    } 
  };

  return (
    <div className={styles.container}>
      <div className={`loadingIndicator ${isLoading ? "active" : ""}`}>
        <img className={"rotate"} src="ui/loading.svg" />
      </div>
      <div className={"sectionTitle"}>Optimize your character</div>
      <FileDropComponent 
         onFilesDrop={handleFilesDrop}
      />
      <div className={styles.buttonContainer}>
        <CustomButton
          theme="light"
          text={t('callToAction.back')}
          size={14}
          className={styles.buttonLeft}
          onClick={back}
        />
        {/* <CustomButton
          theme="light"
          text={"debug"}
          size={14}
          className={styles.buttonCenter}
          onClick={debugMode}
        /> */}
          <CustomButton
          theme="light"
          text="Download"
          size={14}
          className={styles.buttonRight}
          onClick={download}
        />
      </div>
    </div>
  )
}

export default Optimizer