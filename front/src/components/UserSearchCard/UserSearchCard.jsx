import React from "react";
import { Link } from "react-router-dom";
import { Avatar } from "../Avatar";
import styles from "./user_search_card.module.scss";

export function UserSearchCard({ user, onClose }) {
  return (
    <Link to={"/" + user?._id} id={user?._id} className={styles.card} title={user?.firstName} onClick={onClose}>
      <div className="relative">
        <Avatar imageUrl={user?.profile_pic} imageName={user?.firstName} userId={user?._id} className={styles.avatar} />
      </div>
      <div>
        <h5 className={styles.name}>{user?.firstName}</h5>
        <p className={styles.text}>{user?.email}</p>
      </div>
    </Link>
  );
}
