'use client'
import styles from './shift_block.module.css';
import { Form, Row, Col } from '@/app/components/bootstrap';
import Image from 'next/image';
import { useState } from 'react';
// import delete_svg from '@app/public/delete.svg'

export default function ShiftBlock({name, shift_id, onSelectShift}: {name: string, shift_id: string, onSelectShift: (shift_name: string, shift_id: string)=>void}) {
  const [isEdit, setIsEdit] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [inputValue, setInputValue] = useState(name);
  const [isDelete, setIsDelete] = useState(false);

  const edit = () => {
    console.log("Edit")
    setIsEdit(true);
  };

  const noedit = () => {
    setIsEdit(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsEdited(true);
  };

  const save = () => {
    // console.log("Save")
    setIsEdit(false);

    // TODO: save to database
  }

  const deleteShift = () =>{
    // console.log("delete");
    setIsDelete(true); 
  }

  const handleChooseShift = () => {
    onSelectShift(name, shift_id);
  }

  if (isDelete) {
    return <></>;
  }

  return (
    <Row className={styles.history_shift} onClick={handleChooseShift}>
      <Form>
        <Row>
          <Col sm={8}>
              <input
                type="text"
                value={inputValue}
                className={styles.shift_block_input}
                onChange={handleChange}
                // onBlur={noedit}
                readOnly={!isEdit}
              />
          </Col>
          <Col sm={2}>
            {isEdit? (
              <Image src="/save.svg" width={30} height={30} alt="edit" onClick={save} className={styles.icon}/>
            ) : (
              <Image src="/edit.svg" width={30} height={30} alt="edit" onClick={edit} className={styles.icon}/>
            )}
          </Col>
          <Col sm={2}>
            <Image src="/delete.svg" width={30} height={30} alt="delete" onClick={deleteShift} className={styles.icon}/>
          </Col>
        </Row>
      </Form>
    </Row>
  );
}
