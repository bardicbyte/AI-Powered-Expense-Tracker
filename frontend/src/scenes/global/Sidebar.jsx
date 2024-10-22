import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import DescriptionIcon from "@mui/icons-material/Description";
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
  const [selected, setSelected] = useState("Log Expense");

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
          height: "calc(100% - 100px)",
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
                  AI Invoice App
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* PROFILE SECTION */}
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
                  variant="h5"
                  color={colors.grey[100]}
                  sx={{ m: "10px 0 0 0" }}
                >
                  Made by
                </Typography>
                <Typography
                  variant="h4"
                  color={colors.greenAccent[500]}
                  fontWeight="bold"
                >
                  Alvee Mir
                </Typography>
              </Box>
            </Box>
          )}

          {/* MENU ITEMS */}
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
              title="Log Expense"
              to="/"
              icon={<ReceiptLongIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="AI Receipt Scanner"
              to="/aiReceiptScanner"
              icon={<DocumentScannerIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Invoice"
              to="/invoices"
              icon={<DescriptionIcon />}
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