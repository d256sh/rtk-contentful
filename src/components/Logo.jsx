import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <div className="logo">
      <Link to={"/"}>
        <img width={30} height={30} src={`${process.env.PUBLIC_URL}/favicon.png`} alt="logo" />
      </Link>
    </div>
  );
};

export default Logo;
