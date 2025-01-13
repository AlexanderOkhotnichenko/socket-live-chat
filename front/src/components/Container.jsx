import React from "react";
import styles from "../index.module.scss";

export function Container({ children, ...props }) {
  return <div className={styles.container} {...props}>{children}</div>;
}
