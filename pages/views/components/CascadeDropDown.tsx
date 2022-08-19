import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import styles from './CascadeDropDown.module.css';
import Image from 'next/image';
import emitter from '../../../emitter';

const CascadeDropDown = (props: { departmentData: string[] }) => {
    const [isShowItems, setIsShowItem] = useState<boolean>(false);
    const [department, setDepartment] = useState<string>('');

    useEffect(() => {
        const text = localStorage.getItem('@nav/deprtment') || '请选择';
        setDepartment(text);
    }, []);

    const handleDepartmentClick = useCallback((e: SyntheticEvent<HTMLDivElement>) => {
        const text = e.currentTarget.innerHTML;
        setDepartment(text);
        localStorage.setItem('@nav/deprtment', text);
        emitter.emit('departmentChange', text);
        setIsShowItem(false);
    }, []);

    return (
        <div
            className={styles.cddContainer}
            onTouchStart={() => setIsShowItem(true)}
            onMouseEnter={() => setIsShowItem(true)}
            onMouseLeave={() => setIsShowItem(false)}
        >
            <div className={styles.selectContainer}>
                {department}
                <Image src="/dropdown.svg" alt="下拉" width={20} height={20} />
            </div>
            {isShowItems && (
                <div className={styles.selectItemsContainer}>
                    {props.departmentData.map((name) => {
                        return (
                            <div className={styles.selectItem} key={name} onClick={handleDepartmentClick}>
                                {name}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CascadeDropDown;
