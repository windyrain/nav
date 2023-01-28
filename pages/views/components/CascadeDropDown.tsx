import React, { SyntheticEvent, useCallback, useState } from 'react';
import styles from './CascadeDropDown.module.css';
import Image from 'next/image';
import { customImageLoader } from '../../../loader';
import useServerStore from '../../../store';

const CascadeDropDown = (props: { departmentData: string[] }) => {
    const [isShowItems, setIsShowItem] = useState<boolean>(false);
    const { department, isServer, changeDepartment } = useServerStore(({ department, isServer, changeDepartment }) => ({
        department,
        isServer,
        changeDepartment,
    }));

    const handleDepartmentClick = useCallback(
        (e: SyntheticEvent<HTMLDivElement>) => {
            const text = e.currentTarget.innerHTML;
            changeDepartment(text);
            setIsShowItem(false);
        },
        [changeDepartment],
    );

    if (isServer) return null;

    return (
        <div
            className={styles.cddContainer}
            onTouchStart={() => setIsShowItem(true)}
            onMouseEnter={() => setIsShowItem(true)}
            onMouseLeave={() => setIsShowItem(false)}
        >
            <div className={styles.selectContainer}>
                {department || '请选择'}
                <Image src="/next-assets/dropdown.svg" alt="下拉" width={20} height={20} loader={customImageLoader} />
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
