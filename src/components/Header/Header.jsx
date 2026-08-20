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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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
                <NavLink to={`/${link}`} end={!link}>
                  {name}
                </NavLink>
              </motion.div>
            ))}
          </nav>
          <Socials />

          <div className="menu-mobile">
            <div className="menu-mobile__button" onClick={toggleMobileMenu}>
              <svg className="icon" viewBox="0 0 24 24">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
              </svg>
            </div>

            <div className={`menu-mobile__list ${isMobileMenuOpen ? "opened" : ""}`}>
              <div className="icon" onClick={closeMobileMenu}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="#ffffff">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </div>
              <div className="logo">
                <Logo />
              </div>
              <div className="menu-mobile__items">
                {MENU.map(({ link, name }) => (
                  <div key={link} className="menu-mobile__item">
                    <NavLink to={`/${link}`} end={!link} onClick={closeMobileMenu}>
                      {name}
                    </NavLink>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>
      </div>
    </section>
  );
};

export default Header;
