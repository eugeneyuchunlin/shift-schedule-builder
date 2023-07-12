import { useEffect, useState, useContext } from 'react';
import styles from './element.module.css';
import { set } from 'zod';
import { ShiftContext } from '../contexts/shfit_context'

type ElementProps = {
  name: string;
  val: string;
  row: number;
  col: number;
  reset: boolean;
  brushMode: boolean;
  onChangeElement: (name: string, col: number, val: string) => void;
  className?: string;
};

export default function Element({ name, val, row, col, reset, brushMode, onChangeElement, className }: ElementProps) {
  const [inputValue, setInputValue] = useState(val);
  const [ reservedClassName, setReservedClassName ] = useState(""); 
  const [ reserved, setReserved ] = useState(false);

  const { reservedLeave, updateReservedFlag } = useContext(ShiftContext)

  useEffect(() => {
    if (reset){
      // console.log("element is reset")
      setReserved(false)
      setReservedClassName("")
      setInputValue(val);
    }
  }, [reset, val]);

  useEffect(()=>{
      if(Object.keys(reservedLeave).length > 0){
        if(row in reservedLeave){
          if(reservedLeave[row].includes(col)){
            setReserved(true)
            setReservedClassName(styles.element_reserve0)
          }
        }
      }
  }, [updateReservedFlag])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChangeElement(name, col, newValue);
  };

  const handleReservedRest = () => {
    if(brushMode){
      // console.log("reserved", reserved)
      if(reserved){
        setReserved(false)
        setReservedClassName("")
      }else{
        setReserved(true)
        // console.log(Number(inputValue) === 0)
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
            readOnly={brushMode}
          /> 
        </td>
      ) : (
        <td className={`${className}`} onClick={handleReservedRest}>
          <input
            className={`${styles.element} ${styles.elemenet_not_brush_mode}`}
            type="text"
            value={inputValue}
            onChange={handleChange}
            readOnly={brushMode}
          /> 
        </td>
      )}
    </>
  );
  
}
