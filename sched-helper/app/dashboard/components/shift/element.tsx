import { useEffect, useState } from 'react';
import styles from './element.module.css';
import { set } from 'zod';

type ElementProps = {
  name: string;
  val: string;
  col: number;
  reset: boolean;
  brushMode: boolean;
  onChangeElement: (name: string, col: number, val: string) => void;
  className?: string;
};

export default function Element({ name, val, col, reset, brushMode, onChangeElement, className }: ElementProps) {
  const [inputValue, setInputValue] = useState(val);
  const [ reservedClassName, setReservedClassName ] = useState(""); 
  const [ reserved, setReserved ] = useState(false);

  useEffect(() => {
    if (reset){
      setReserved(false)
      setReservedClassName("")
      setInputValue(val);
    }
  }, [reset, val]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChangeElement(name, col, newValue);
  };

  const handleReservedRest = () => {
    if(brushMode){
      console.log("reserved", reserved)
      if(reserved){
        setReserved(false)
        setReservedClassName("")
      }else{
        setReserved(true)
        console.log(Number(inputValue) === 0)
        if(Number(inputValue) === 0){
          // console.log("set reserve0")
          setReservedClassName(styles.element_reserve0)
        }else{
          setReservedClassName(styles.element_reserve1)
        }
      }
    } 
  }


  return (
    <>
      {reserved ? (
        <td className={`${className}`} onClick={handleReservedRest}>
          <input
            className={`${styles.element} ${reservedClassName}`}
            type="text"
            value={inputValue}
            onChange={handleChange}
            readOnly
          /> 
        </td>
      ) : (
        <td className={`${className}`} onClick={handleReservedRest}>
          <input
            className={`${styles.element} ${styles.elemenet_not_brush_mode}`}
            type="text"
            value={inputValue}
            onChange={handleChange}
          /> 
        </td>
      )}
    </>
  );
  
}
