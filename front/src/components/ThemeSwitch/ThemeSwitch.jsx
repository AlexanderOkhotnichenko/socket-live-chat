import React, { useContext } from "react";
import { ThemeContext } from "../../context/themeContext";
import styles from "./theme_switch.module.scss"

export function ThemeSwitch() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  {/* <div className={styles.theme_switch}>
    <input type="checkbox" id="theme" className={styles.checkbox} checked={theme === "dark"} onChange={(event) => toggleTheme(event.target.checked)}
       />
    <label className={styles.button} htmlFor="theme">
      <span className={styles.points}></span>
    </label>
  </div> */}
  return (
    <div>
      <input type="checkbox" id="theme" className={styles.input} checked={theme === "dark"} onChange={(event) => toggleTheme(event.target.checked)} />
      <label htmlFor="theme" className={styles.label}></label>
    </div>
  );
}
