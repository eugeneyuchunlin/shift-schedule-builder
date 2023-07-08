import { useState } from 'react';
import styles from './element.module.css';

type ElementProps = {
    name: string;
    val: string;
    col: number;
    onChangeElement: (name:string, col: number, val: string) => void
    className?: string;
}

export default function Element({name, val, col, onChangeElement, className }: ElementProps) {
  const [inputValue, setInputValue] = useState(val);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChangeElement(name, col, e.target.value);
  };

  return (
    <td className={className}>
      <input
        className={styles.element}
        type="text"
        value={inputValue}
        onChange={handleChange}
      />
    </td>
  );
}
