import { useEffect, useState, useContext } from 'react';
import styles from './element.module.css';
import { set } from 'zod';
import { ShiftContext } from '../contexts/shfit_context'
import { ElementContext } from '../contexts/element_context'

type ElementProps = {
  name: string;
  val: string;
  row: number;
  col: number;
  brushMode: boolean;
  className?: string;
};

export default function Element(
  { 
    name, 
    val, 
    row, 
    col, 
    brushMode, 
    className 
  }: ElementProps
  ) {
  const [inputValue, setInputValue] = useState(val);
  const [ reservedClassName, setReservedClassName ] = useState(""); 
  const [ reserved, setReserved ] = useState(false);

  const { reservedLeave, updateReservedFlag } = useContext(ShiftContext)
  const { reset, updateShiftContentElement, addReservedLeave, removeReservedLeave }  = useContext(ElementContext)

  useEffect(() => {
    if (reset){
      setReserved(false)
      setReservedClassName("")
      setInputValue(val);
    }
  }, [reset, val]);

  useEffect(()=>{
      if(Object.keys(reservedLeave).length > 0){
        const str_row = row.toString()
        if(str_row in reservedLeave){
          if(reservedLeave[str_row].includes(col)){
            setReserved(true)
            setReservedClassName(styles.element_reserve0)
          }
        }
      }
  }, [updateReservedFlag])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    updateShiftContentElement(name, col, newValue);
  };

  const handleReservedRest = () => {
    if(brushMode){
      // console.log("reserved", reserved)
      if(reserved){
        setReserved(false)
        setReservedClassName("")
        if(Number(inputValue) === 0){
          removeReservedLeave(row, col)
        }else{
          // removeReservedWD(row, col)
        }
      }else{
        setReserved(true)
        // console.log(Number(inputValue) === 0)
        if(Number(inputValue) === 0){
          // console.log("set reserve0")
          setReservedClassName(styles.element_reserve0)
          addReservedLeave(row, col)
        }else{
          setReservedClassName(styles.element_reserve1)
          // addReservedWD(row, col)
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
