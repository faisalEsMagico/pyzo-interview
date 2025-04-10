import React, { useState } from 'react'
import EsmagicoLogo from '../../assets/images/esmagicoLogo.png'
import Image from 'next/image'
import styles from './index.module.css'
import LanguagePopup from './LanguagePopup'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div
            className={styles.container}
        >
            <div>
                <LanguagePopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
                <div className={styles.menuContainer}>
                </div>
                <div className={styles.navbarHeading}>
                    <Image src={EsmagicoLogo.src} height={30} width={150} alt='logo' />
                </div>
                <div onClick={() => setIsOpen(true)} style={{ cursor: 'pointer' }}>
                </div>
            </div>
        </div>
    )
}

export default Navbar