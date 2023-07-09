import { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

import styles from './alert.module.css';

function AlertBlock({ show, handleClose}: { show: boolean, handleClose: () => void }) {


  if (show) {
    return (
      <Alert variant="danger" className={styles.alert_box} onClose={handleClose} dismissible>
        <Alert.Heading>Oh no! You got an error!</Alert.Heading>
        <p>You must provide days, number of workers, computation time, and at least one constraint.</p>
      </Alert>
    );
  }

  return null;
}

export default AlertBlock;
