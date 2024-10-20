import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import StorefrontIcon from "@mui/icons-material/Storefront";
import HandshakeIcon from '@mui/icons-material/Handshake';
import WalletIcon from '@mui/icons-material/Wallet';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        "& .pro-sidebar": {
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: isCollapsed ? '80px' : '250px',
        },
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
          height: "100%",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        "& .pro-menu": {
          height: "calc(100% - 100px)", // Adjust this value based on your header height
          overflowY: "auto",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  P2P Energy
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Alvee Mir
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  Prosumer
                </Typography>
              </Box>
            </Box>
          )}

          <Box
            paddingLeft={isCollapsed ? undefined : "10%"}
            sx={{
              '& > * + *': {
                marginTop: '25px', 
              },
              '.MuiTypography-root': {
                fontSize: '1.2rem',
              },
              '.MuiListItem-root': {
                padding: '12px 20px', 
              },
              '.MuiSvgIcon-root': {
                fontSize: '24px', 
              },
            }}
          >
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />} 
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Marketplace"
              to="/team"
              icon={<StorefrontIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="My Trades"
              to="/contacts"
              icon={<HandshakeIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Wallet"
              to="/invoices"
              icon={<WalletIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Energy Consumption"
              to="/form"
              icon={<EnergySavingsLeafIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Settings"
              to="/form"
              icon={<SettingsIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Help & Support"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;