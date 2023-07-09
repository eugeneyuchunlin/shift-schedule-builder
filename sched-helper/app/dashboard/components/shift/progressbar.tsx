import React, { useEffect, useState } from 'react';
import styles from './progrssbar.module.css';

export default function ProgressBar({ totalDuration, completed }: { totalDuration: number, completed: number }) {
  const [progress, setProgress] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const delta = completed - progress;

    const startAnimation = (timestamp: number) => {
      const elapsedTime = timestamp - startTime;
      const animated_progress = (elapsedTime / totalDuration) * delta + progress;
      setAnimatedProgress(animated_progress);

      if (elapsedTime < totalDuration) {
        animationFrameId = requestAnimationFrame(startAnimation);
      }
    };

    const startTime = performance.now();
    animationFrameId = requestAnimationFrame(startAnimation);

    return () => {
      cancelAnimationFrame(animationFrameId);
      setProgress(completed);
    };
  }, [totalDuration, completed, progress]);

  return (
    <div className={styles.progress_container}>
      <div className={styles.progress_bar} style={{ width: `${animatedProgress}%` }}><p>{completed}%</p></div>
    </div>
  );
}
