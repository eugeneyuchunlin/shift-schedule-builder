'use client'
import styles from './shift_block.module.css';
import { Form, Row, Col } from '@/app/components/bootstrap';
import Image from 'next/image';
import { useState } from 'react';
// import delete_svg from '@app/public/delete.svg'

export default function ShiftBlock({name }: {name: string}) {
  const [isEdit, setIsEdit] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [inputValue, setInputValue] = useState(name);
  const [isDelete, setIsDelete] = useState(false);

  const edit = () => {
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
    setIsEdit(false);

    // TODO: save to database
  }

  const deleteShift = () =>{
    console.log("delete");
    setIsDelete(true); 
  }

  if (isDelete) {
    return <></>;
  }

  return (
    <Row className={styles.history_shift}>
      <Form>
        <Row>
          <Col sm={8}>
              <input
                type="text"
                value={inputValue}
                className={styles.shift_block_input}
                onChange={handleChange}
                onClick={edit}
                onBlur={noedit}
              />
          </Col>
          <Col sm={2}>
            {isEdit || isEdited ? (
              <Image src="/save.svg" width={30} height={30} alt="edit" onClick={save} className={styles.icon}/>
            ) : (
              <></>
            )}
          </Col>
          <Col sm={2}>
            <Image src="/delete.svg" width={20} height={20} alt="delete" onClick={deleteShift} className={styles.icon}/>
          </Col>
        </Row>
      </Form>
    </Row>
  );
}
