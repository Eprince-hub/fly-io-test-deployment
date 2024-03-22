import React from 'react';
import { logout } from './actions';
import styles from './LogoutButton.module.scss';

export default function LogoutButton() {
  return (
    <form>
      <button className={styles.logoutButton} formAction={logout}>
        Logout
      </button>
    </form>
  );
}
