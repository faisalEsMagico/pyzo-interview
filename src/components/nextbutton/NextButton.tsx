import React from 'react'
import { FaArrowRight } from "react-icons/fa";
import styles from "./index.module.css"

const NextButton = ({name = "Next" , handleActiveTab,disabled=false} : {name? : string,disabled?:boolean , handleActiveTab : (value? : number) => void}) => {
  return (
   <button className={styles.nextButton} disabled={disabled} onClick={() => {
    handleActiveTab()
   }}>{name} <FaArrowRight/></button>
  )
}

export default NextButton