import React from "react";
import Logo from "../Logo";
import { MENU } from "../../utils/constants";
import ScrollAnimation from "react-animate-on-scroll";
import { NavLink } from "react-router-dom";
import Socials from "../Socials/Socials";

const Header = () => {
  return (
    <section className="header">
      <div className="container">
        <header>
          <Logo />
          <nav>
            {MENU.map(({ link, name }, i) => (
              <ScrollAnimation
                key={link}
                className="menu-item"
                animateIn="fadeInDown"
                offset={0}
                dalay={i * 100}
              >
                <NavLink to={`/${link}`}>{name}</NavLink>
              </ScrollAnimation>
            ))}
          </nav>
          <Socials />
        </header>
      </div>
    </section>
  );
};

export default Header;
