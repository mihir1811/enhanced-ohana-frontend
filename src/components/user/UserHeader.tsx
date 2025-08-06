import React from "react";
import { Avatar, Badge, Button, Dropdown, MenuProps, Space } from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  UserOutlined,
  DownOutlined,
  SettingOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import styles from "./UserHeader.module.css";
import Image from "next/image";

const tabs = [
  "Auctions",
  "Natural",
  "Lab Grown",
  "Gemstones",
  "Jewelry",
  "Bullion",
  "Experience",
];

const menuItems: MenuProps['items'] = [
  {
    key: 'profile',
    label: 'Profile',
    icon: <UserOutlined />,
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: <SettingOutlined />,
  },
  {
    key: 'help',
    label: 'Help',
    icon: <QuestionCircleOutlined />,
  },
  {
    type: 'divider',
  },
  {
    key: 'logout',
    label: 'Logout',
    icon: <LogoutOutlined />,
    danger: true,
  },
];


const UserHeader = () => {
  const [activeTab, setActiveTab] = React.useState(tabs[0]);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <Image src="/logo.svg" alt="Logo" width={40} height={40} className={styles.logo} />
          <span className={styles.platformName}>Diamond & Jewelry</span>
        </div>
        <nav className={styles.nav}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              <span className={styles.tabHighlight} />
            </button>
          ))}
        </nav>
        <div className={styles.rightSection}>
          <Space size="middle">
            <Badge count={2}>
              <Button shape="circle" icon={<ShoppingCartOutlined />} />
            </Badge>
            <Badge count={3}>
              <Button shape="circle" icon={<HeartOutlined />} />
            </Badge>
            <Dropdown menu={{ items: menuItems }} trigger={['click']}>
              <a onClick={(e) => e.preventDefault()} className={styles.userDropdownLink}>
                <Space>
                  <Avatar icon={<UserOutlined />} />
                  <span className={styles.userName}>John Doe</span>
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </Space>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
