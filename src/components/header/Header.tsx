import "../../styles/header.scss";
const Header: React.FC = () => {
  return (
    <div className="header-container-wrap">
      <div className="left-menu">
        <div>HOME</div>
      </div>

      <div className="right-menu">
        <div>메뉴1</div>
        <div>메뉴2</div>
        <div>메뉴3</div>
      </div>
    </div>
  );
};

export default Header;
