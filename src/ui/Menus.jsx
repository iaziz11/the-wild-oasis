import { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

function calculateMenuPosition(rect) {
  return {
    x: window.innerWidth - rect.width - rect.x,
    y: rect.y + rect.height + 8,
  };
}

const MenusContext = createContext();

function Menus({ children }) {
  const [openId, setOpenId] = useState("");
  const [openPosition, setOpenPosition] = useState({});
  const [openedButton, setOpenedButton] = useState(null);

  useEffect(() => {
    function handleScroll() {
      if (!openedButton) return;
      const rect = openedButton.getBoundingClientRect();
      setOpenPosition(calculateMenuPosition(rect));
    }

    function handleResize() {
      setOpenId("");
      setOpenPosition({});
      setOpenedButton(null);
    }

    document.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [openedButton, setOpenPosition]);

  const close = () => setOpenId("");
  const open = setOpenId;
  const setPosition = setOpenPosition;

  return (
    <MenusContext.Provider
      value={{
        openId,
        close,
        open,
        setPosition,
        openPosition,
        setOpenedButton,
      }}
    >
      {children}
    </MenusContext.Provider>
  );
}

function Toggle({ id }) {
  const { open, close, openId, setPosition, setOpenedButton } =
    useContext(MenusContext);

  const handleClick = (e) => {
    e.stopPropagation();
    const rect = e.target.closest("button").getBoundingClientRect();
    setOpenedButton(e.target.closest("button"));
    if (openId === id) {
      close();
    } else {
      setPosition(calculateMenuPosition(rect));
      open(id);
    }
  };
  return (
    <StyledToggle id={id} onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

function List({ children, id }) {
  const { openId, openPosition, close } = useContext(MenusContext);
  const ref = useOutsideClick(close, false);

  if (openId !== id) {
    return null;
  }
  return createPortal(
    <StyledList position={openPosition} ref={ref}>
      {children}
    </StyledList>,
    document.body
  );
}

function Button({ children, icon, onClick }) {
  const { close } = useContext(MenusContext);
  function handleClick() {
    onClick?.();
    close();
  }
  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon} <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
