import { useState } from 'react';
import styles from './element.module.css';

type ElementProps = {
    val: string;
    className?: string;
}

export default function Element({ val, className }: ElementProps) {
  const [inputValue, setInputValue] = useState(val);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
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
