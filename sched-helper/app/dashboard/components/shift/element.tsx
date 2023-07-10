import { useEffect, useState } from 'react';
import styles from './element.module.css';
import { set } from 'zod';

type ElementProps = {
  name: string;
  val: string;
  col: number;
  reset: boolean;
  onChangeElement: (name: string, col: number, val: string) => void;
  className?: string;
};

export default function Element({ name, val, col, reset, onChangeElement, className }: ElementProps) {
  const [inputValue, setInputValue] = useState(val);
  const [ preRest, setPreRest ] = useState(false); // customize leave

  useEffect(() => {
    if (reset){
      setInputValue(val);
      setPreRest(false);
    }
  }, [reset, val]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChangeElement(name, col, newValue);

    if (newValue === '0'){
      console.log("edit to 0")
      setPreRest(true);
    }
  };


  return (
    <td className={className}>
    { preRest ? 
      <input
      className={`${styles.element} ${styles.element_prerest}`}
      type="text"
      value={inputValue}
      onChange={handleChange}
      /> 
    : 
    <input
      className={styles.element}
      type="text"
      value={inputValue}
      onChange={handleChange}
    />
  }
      
    </td>
  );
}
