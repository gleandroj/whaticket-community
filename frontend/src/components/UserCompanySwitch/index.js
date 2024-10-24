import React, { useState, useContext, useEffect } from "react";
import {
  makeStyles,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  MenuItem,
  Button,
  Menu,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import BusinessIcon from "@material-ui/icons/Business";
import ExpandMore from "@material-ui/icons/ExpandMore";
import api from "../../services/api";
import toastError from "../../errors/toastError";

const UserCompanySwitch = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  React.useEffect(() => {
    const fetchUserCompanies = async () => {
      try {
        const { data } = await api.get("/users-companies");
        const activeCompany = data.find((c) => c.isActive);
        setCompanies(data);
        setSelectedCompany(activeCompany);
      } catch (err) {
        toastError(err);
      }
    };
    fetchUserCompanies();
  }, []);

  const handleSwitchCompany = React.useCallback(async (companyId) => {
    try {
      const { data } = await api.get(`/users-companies/${companyId}/switch`);
      window.location.reload();
    } catch (err) {
      toastError(err);
    }
  }, []);

  return (
    <div>
      <Button
        aria-label="companies of current user"
        aria-controls="menu-company"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        disableElevation
        onClick={handleMenu}
        endIcon={<ExpandMore />}
        startIcon={<BusinessIcon />}
      >
        {selectedCompany?.name || "Loading"}
      </Button>
      <Menu
        id="menu-company"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={menuOpen}
        onClose={handleCloseMenu}
      >
        {companies
          .filter((c) => !c.isActive)
          .map((company) => (
            <MenuItem
              key={company.id}
              onClick={() => handleSwitchCompany(company.id)}
            >
              {company.name}
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
};

export default UserCompanySwitch;
