import Image from 'next/image';
import { useState } from 'react';
import { Center, Space, Text } from '@mantine/core';
import { IconTrash, IconEdit } from '@tabler/icons';
import { customImageLoader } from '../../../loader';
import styles from './NavItem.module.css';
import { openConfirmModal } from '@mantine/modals';
import { useClientStore } from '../../../store';

interface Props {
    categoryName?: string;
    url: string;
    name: string;
    urls?: Array<{
        env: string;
        url: string;
    }>;
    isEdit?: boolean;
}

const NavItem = ({ categoryName, url, name, urls, isEdit }: Props) => {
    const [isShowItems, setIsShowItem] = useState<boolean>(false);
    const { department, deleteNavData, fetchNavData } = useClientStore(
        ({ department, deleteNavData, fetchNavData }) => ({
            department,
            deleteNavData,
            fetchNavData,
        }),
    );

    return (
        <div
            className={isShowItems ? styles.cardHover : styles.card}
            key={name}
            onClick={() => {
                setIsShowItem(false);
                window.open(url, '_blank');
            }}
            onMouseEnter={() => setIsShowItem(true)}
            onMouseLeave={() => setIsShowItem(false)}
        >
            <div className={styles.selectContainer}>
                <h2>{name}</h2>
                {urls && urls.length > 0 && (
                    <Image
                        src="/next-assets/dropdown.svg"
                        alt="下拉"
                        width={20}
                        height={20}
                        loader={customImageLoader}
                    />
                )}
            </div>
            {isShowItems && !isEdit && urls && urls.length > 0 && (
                <div className={styles.selectItemsContainer}>
                    {urls.map(({ env, url }, i) => {
                        return (
                            <a
                                className={styles.selectItem}
                                key={`${env}_${i}`}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setIsShowItem(false)}
                            >
                                {env}
                            </a>
                        );
                    })}
                </div>
            )}
            {isShowItems && isEdit && (
                <Center mt="md">
                    <IconTrash
                        size={18}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openConfirmModal({
                                title: '删除导航',
                                centered: true,
                                children: <Text size="sm">确认删除这个导航吗？</Text>,
                                labels: { confirm: '确认', cancel: '饶他一命' },
                                confirmProps: { color: 'red' },
                                onConfirm: async () => {
                                    const result = await deleteNavData({
                                        departmentName: department,
                                        categoryName: categoryName,
                                        navName: name,
                                    });

                                    if (result) fetchNavData();
                                },
                            });
                        }}
                    />
                    <Space w="md" />
                    <IconEdit
                        size={18}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            useClientStore.setState({
                                isShowForm: 'update',
                                formData: {
                                    department,
                                    category: categoryName,
                                    name,
                                    url,
                                },
                            });
                        }}
                    />
                </Center>
            )}
        </div>
    );
};

export default NavItem;
