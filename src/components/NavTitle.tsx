import React from 'react'
import styles from './NavTitle.module.less'
import { useLocation } from 'react-router-dom'

export default function NavTitle({title}:any) {
  return (
    <div className={styles.wrap}>
      {title}
    </div>
  )
}
