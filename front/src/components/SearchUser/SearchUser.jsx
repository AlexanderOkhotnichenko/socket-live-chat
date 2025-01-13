import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { MainContext } from "../../context/rootContext";
import { Loading } from "../Loading/Loading";
import { UserSearchCard } from "../UserSearchCard/UserSearchCard";
import { Search } from "../Search";
import { toastMessage } from "../../helpers/toastMessage";
import styles from "./search_user.module.scss";

export const SearchUser = React.memo(function SearchUser({ user }) {
  const { isOpenSearchUser, setIsOpenSearchUser } = useContext(MainContext);
  const [searchUsers, setSearchUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const userActive = useSelector((state) => state?.user);

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { delay: 0.3, duration: 0.3 } },
    exit: { opacity: 0 },
  };

  const filterUsers = (users, activeUser) => {
    return users.filter((user) => user?._id !== activeUser?._id);
  };

  const handleSearchUsers = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/search-user`;

    try {
      setLoading(true);
      const response = await axios.post(url, {
        search: search,
      });

      setLoading(false);
      setSearchUsers(response?.data?.data);
    } catch (error) {
      toastMessage("error", error.response?.data?.message);
    }
  };

  useEffect(() => {
    handleSearchUsers();
  }, [search]);
  
  return (
    <AnimatePresence>
      {isOpenSearchUser && (
        <motion.div
          className={styles.overlay}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={() => setIsOpenSearchUser(false)}
        >
          <motion.div
            className={styles.content}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(event) => event.stopPropagation()}
          >
            <Search
              background={"#f1f5f9"}
              height={"3.5rem"}
              iconSize={25}
              placeholder={"Search user by name, email..."}
              onChange={(event) => setSearch(event.target.value)}
              value={search}
            />
            <div className={styles.list}>
              {!loading && searchUsers.length === 0 && (
                <p className="text-center text-lg text-slate-600">No user found!</p>
              )}
              {loading && <Loading size={2.5} />}
              {!loading && searchUsers.length > 0 &&
                filterUsers(searchUsers, userActive).map((user) => (
                  <UserSearchCard user={user} key={user._id} onClose={() => setIsOpenSearchUser(false)} />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
