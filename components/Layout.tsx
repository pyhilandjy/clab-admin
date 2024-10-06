import { ReactNode } from 'react';

import { Link } from '@chakra-ui/next-js';

import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.container}>
      <nav className={styles.sidebar}>
        <div className={styles.adminHeader}>Admin</div>
        <ul>
          <li>
            <Link href='/'>대시보드</Link>
          </li>
          <li>
            <Link href='/report'>리포트</Link>
          </li>
          <li>
            <Link href='/stt-edit'>STT수정</Link>
          </li>
          <li>
            <Link href='/plan'>패키지관리</Link>
          </li>
          <li>
            <Link href='/new-stt-edit'>작업중</Link>
          </li>
        </ul>
      </nav>
      <main className={styles.content}>{children}</main>
    </div>
  );
};

export default Layout;
