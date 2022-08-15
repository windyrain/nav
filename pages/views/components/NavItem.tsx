import Image from 'next/image';
import { useState } from 'react';
import styles from './NavItem.module.css';

interface Props {
    url: string;
    name: string;
    urls?: Array<{
        env: string;
        url: string;
    }>;
}

const NavItem = ({ url, name, urls }: Props) => {
    const [isShowItems, setIsShowItem] = useState<boolean>(false);

    return (
        <a
            href={url}
            className={styles.card}
            key={name}
            onTouchStart={() => setIsShowItem(true)}
            onMouseEnter={() => setIsShowItem(true)}
            onMouseLeave={() => setIsShowItem(false)}
            target="_blank"
            rel="noreferrer"
        >
            <div className={styles.selectContainer}>
                <h2>{name}</h2>
                {urls && urls.length > 0 && <Image src="/dropdown.svg" alt="下拉" width={20} height={20} />}
            </div>
            {isShowItems && urls && urls.length > 0 && (
                <div className={styles.selectItemsContainer}>
                    {urls.map(({ env, url }, i) => {
                        return (
                            <a
                                className={styles.selectItem}
                                key={`${env}_${i}`}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {env}
                            </a>
                        );
                    })}
                </div>
            )}
        </a>
    );
};

export default NavItem;
