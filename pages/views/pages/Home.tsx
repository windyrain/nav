import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import navData from '../../../data/nav';
import emitter from '../../../emitter';
import CascadeDropDown from '../components/CascadeDropDown';
import NavItem from '../components/NavItem';
import styles from './Home.module.css';

type Department = keyof typeof navData | '';

const keys = Object.keys(navData);

const Home: NextPage = () => {
    const [department, setDepartment] = useState<Department>('');

    useEffect(() => {
        const func = (department: string) => {
            if (keys.includes(department)) {
                setDepartment(department as Department);
            } else {
                setDepartment('前端');
            }
        };

        const text = localStorage.getItem('@nav/deprtment') || '请选择';
        func(text);

        emitter.on('departmentChange', (department: string) => {
            func(department);
        });
    }, []);

    return (
        <div className={styles.container}>
            <Head>
                <title>凯叔 - 导航</title>
                <meta name="description" content="开启一天的愉快工作" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div className={styles.topContainer}>
                    <h1 className={styles.title}>凯叔导航</h1>
                    <p className={styles.description}>开启一天的愉快工作</p>
                    <CascadeDropDown />
                </div>
                {department !== '' &&
                    navData[department].map((item, i) => {
                        return (
                            <div key={`${item.name}_i`}>
                                <p className={styles.category}>{item.name}</p>
                                <div className={styles.grid} key={item.name}>
                                    {item.infos.map((subItem, j) => {
                                        return <NavItem key={`${item.name}_${i}_${j}`} {...subItem} />;
                                    })}
                                </div>
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
    );
};

export default Home;
