import { Button, Menu, MenuItem } from "@material-ui/core";
import BusinessIcon from "@material-ui/icons/Business";
import ExpandMore from "@material-ui/icons/ExpandMore";
import React, { useState } from "react";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";

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

  const disableCompaniesSwitch = companies.length <= 1;

  return (
    <div>
      <Button
        aria-label="companies of current user"
        aria-controls="menu-company"
        aria-haspopup="true"
        variant={disableCompaniesSwitch ? "text" : "contained"}
        color="primary"
        disableRipple
        disableElevation
        onClick={disableCompaniesSwitch ? null : handleMenu}
        endIcon={!disableCompaniesSwitch ? <ExpandMore /> : null}
        startIcon={<BusinessIcon />}
        style={disableCompaniesSwitch ? { cursor: "default" } : {}}
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
        {disableCompaniesSwitch && (
          <MenuItem disabled>
            {i18n.t("userCompanySwitch.noCompanies")}
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default UserCompanySwitch;
