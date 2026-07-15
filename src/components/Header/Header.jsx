import React from "react";
import { motion } from "framer-motion";
import Logo from "../Logo";
import { MENU } from "../../utils/constants";
import { NavLink } from "react-router-dom";
import Socials from "../Socials/Socials";

const menuItemVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

const Header = () => {
  return (
    <section className="header">
      <div className="container">
        <header>
          <Logo />
          <nav>
            {MENU.map(({ link, name }, i) => (
              <motion.div
                key={link}
                className="menu-item"
                custom={i}
                initial="hidden"
                animate="visible"
                variants={menuItemVariants}
              >
                <NavLink to={`/${link}`}>{name}</NavLink>
              </motion.div>
            ))}
          </nav>
          <Socials />
        </header>
      </div>
    </section>
  );
};

export default Header;
