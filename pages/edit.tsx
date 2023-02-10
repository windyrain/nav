import type { InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import React, { useEffect } from 'react';
import CascadeDropDown from './views/components/CascadeDropDown';
import styles from './style.module.css';
import { server } from '../constants';
import { NavData } from '../types';
import ConfigBtn from './views/components/ConfigBtn';
import useServerStore from '../store';
import NavForm from './views/components/NavForm';
import Category from './views/components/Category';

export const getServerSideProps = async () => {
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

const Home = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const { navData, department, isServer, isShowForm, setNavData } = useServerStore(
        ({ navData, department, isServer, isShowForm, setNavData }) => ({
            navData,
            department,
            isServer,
            isShowForm,
            setNavData,
        }),
    );
    const keys = Object.keys(navData);

    useEffect(() => {
        setNavData(data);
    }, [data, setNavData]);

    if (!navData || keys.length === 0) return null;

    return (
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
                    <ConfigBtn />
                    <CascadeDropDown departmentData={keys} />
                </div>
                {!isServer &&
                    navData[department || '前端'].map((item, i) => {
                        return (
                            <Category
                                key={`category_${department}_${i}_${Date.now()}`}
                                categoryIndex={i}
                                {...item}
                                isEdit
                            />
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
            {isShowForm !== false && <NavForm />}
        </div>
    );
};

export default Home;
