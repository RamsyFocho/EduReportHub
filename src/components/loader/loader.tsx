"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './loader.module.css';

const Loader = () => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 4000); 
    return () => clearTimeout(timer);
  }, []);

  return showLoader ? (
    <div className={styles.loaderContainer}>
      <div className={styles.loaderContent}>
        <div className={styles.logoWrapper}>
          <Image
            src="/logo.png"
            alt="Teacher Report System Logo"
            width={150}
            height={150}
            className={styles.logo}
          />
          <div className={styles.pulseRing}></div>
        </div>
        <p className={styles.loadingText}>Loading EduReport Hub...</p>
      </div>
    </div>
  ) : null;
};

export default Loader;
