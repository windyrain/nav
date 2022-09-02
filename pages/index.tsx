import type { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import React, { useCallback, useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import emitter from '../emitter';
import CascadeDropDown from './views/components/CascadeDropDown';
import NavItem from './views/components/NavItem';
import styles from './style.module.css';
import { server } from '../constants';
import { sortNavData } from '../libs/sortNavData';
import { NavData } from '../types';

const getItemStyle = (_isDragging: boolean, draggableStyle?: React.CSSProperties) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none' as any,
    // styles we need to apply on draggables
    ...draggableStyle,
});

export const getStaticProps = async () => {
    const res = await fetch(`${server}/api/navData/query`);

    let data = {};

    try {
        const result = await res.json();
        data = result.data;
    } catch (e) {
        console.log('请求出错');
    }

    return {
        props: { data: data as NavData }, // will be passed to the page component as props
    };
};

const Home = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
    const [navData, setNavData] = useState<NavData>(props.data);
    const keys = Object.keys(navData);
    const [department, setDepartment] = useState<string>('');

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`${server}/api/navData/query`);

            let data = {};

            try {
                const result = await res.json();
                data = result.data;

                setNavData(data);

                const func = (department: string) => {
                    if (Object.keys(data).includes(department)) {
                        setDepartment(department);
                    } else {
                        setDepartment('前端');
                    }
                };

                const text = localStorage.getItem('@nav/deprtment') || '请选择';
                func(text);

                emitter.on('departmentChange', (department: string) => {
                    func(department);
                });
            } catch (e) {
                console.log('请求出错');
            }
        }
        fetchData();
    }, []);

    const handleDragEnd = useCallback(
        (result: any) => {
            const { source, destination } = result;
            console.log(source, destination);
            sortNavData(navData);
        },
        [navData],
    );

    if (!navData || keys.length === 0) return null;

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className={styles.container}>
                <Head>
                    <title>凯叔 - 导航</title>
                    <meta name="description" content="让工作更高效" />
                    <link rel="icon" href="/next-assets/favicon.ico" />
                </Head>
                <main className={styles.main}>
                    <div className={styles.topContainer}>
                        <h1 className={styles.title}>凯叔导航</h1>
                        <p className={styles.description}>让工作更高效</p>
                        <CascadeDropDown departmentData={keys} />
                    </div>
                    {department !== '' &&
                        navData[department].map((item, i) => {
                            return (
                                <div key={`category_${i}`}>
                                    <p className={styles.category}>{item.name}</p>
                                    <Droppable
                                        key={`${item.name}_${i}`}
                                        droppableId={`${item.name}_${i}`}
                                        direction="horizontal"
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                className={styles.grid}
                                                key={item.name}
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                            >
                                                {item.infos.map((subItem, j) => {
                                                    return (
                                                        <Draggable
                                                            key={`${subItem.name}_${i}`}
                                                            draggableId={`${subItem.name}_${i}`}
                                                            index={j}
                                                        >
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    style={getItemStyle(
                                                                        snapshot.isDragging,
                                                                        provided.draggableProps.style,
                                                                    )}
                                                                >
                                                                    <NavItem
                                                                        key={`${item.name}_${i}_${j}`}
                                                                        {...subItem}
                                                                    />
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    );
                                                })}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            );
                        })}
                </main>

                <footer className={styles.footer}>
                    <a
                        href="https://kaishu.feishu.cn/wiki/wikcnCfgjJ0NyIz3cebDXzb1qjc"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        凯叔前端出品 - <span className={styles.know}>了解我们</span>
                    </a>
                </footer>
            </div>
        </DragDropContext>
    );
};

export default Home;
