import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import styles from './ColorThemeCascadeDropDown.module.css';
import Image from 'next/image';
import { customImageLoader } from '../../../loader';
import useServerStore, { useClientStore } from '../../../store';

const themeMap: Record<string, string> = {
    me: '人工设计',
    chatGPT: '专业风格',
    chatGPT1: '专业风格',
    chatGPT2: '俏皮风格',
    chatGPT3: '高对比度风格',
    chatGPT4: '赛博朋克',
};

const ColorThemeCascadeDropDown = () => {
    const [isShowItems, setIsShowItem] = useState<boolean>(false);
    const { colorTheme, changeColorTheme } = useClientStore(({ colorTheme, changeColorTheme }) => ({
        colorTheme,
        changeColorTheme,
    }));

    useEffect(() => {
        document.body.setAttribute('data-theme', colorTheme);
    }, [colorTheme]);

    const handleColorThemeClick = useCallback(
        (e: SyntheticEvent<HTMLDivElement>) => {
            const text = e.currentTarget.dataset.theme || 'me';

            changeColorTheme(text);
            setIsShowItem(false);
        },
        [changeColorTheme],
    );

    return (
        <div
            className={styles.cddContainer}
            onTouchStart={() => setIsShowItem(true)}
            onMouseEnter={() => setIsShowItem(true)}
            onMouseLeave={() => setIsShowItem(false)}
        >
            <div className={styles.selectContainer}>
                主题风格：{colorTheme}
                <Image src="/next-assets/dropdown.svg" alt="下拉" width={20} height={20} loader={customImageLoader} />
            </div>
            {isShowItems && (
                <div className={styles.selectItemsContainer}>
                    {['me', 'chatGPT', 'chatGPT1', 'chatGPT2', 'chatGPT3', 'chatGPT4'].map((name) => {
                        return (
                            <div
                                className={styles.selectItem}
                                key={name}
                                data-theme={name}
                                onClick={handleColorThemeClick}
                            >
                                {name}({themeMap[name]})
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ColorThemeCascadeDropDown;
