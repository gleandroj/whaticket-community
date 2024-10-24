import React, { useState, useEffect, useContext } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  TextField,
  InputAdornment,
  IconButton,
} from "@material-ui/core";

import { Visibility, VisibilityOff } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  multFieldLine: {
    display: "flex",
    "& > *:not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  },
  btnWrapper: {
    position: "relative",
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const CompanySchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  cnpj: Yup.string()
    .min(14, "Invalid CNPJ")
    .max(18, "Invalid CNPJ")
    .required("Required"),
  email: Yup.string().required("Required"),
});

const CompanyModal = ({ open, onClose, companyId }) => {
  const classes = useStyles();

  const initialState = {
    name: "",
    cnpj: "",
    email: "",
  };

  const { user: loggedInUser } = useContext(AuthContext);
  const [company, setCompany] = useState(initialState);
  const [showCnpj, setShowCnpj] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!companyId) return;
      try {
        const { data } = await api.get(`/companies/${companyId}`);
        setCompany(data);
      } catch (err) {
        toastError(err);
      }
    };

    fetchCompany();
  }, [companyId, open]);

  const handleClose = () => {
    onClose();
    setCompany(initialState);
  };

  const handleSaveCompany = async (values) => {
    try {
      if (companyId) {
        await api.put(`/companies/${companyId}`, values);
      } else {
        await api.post("/companies", values);
      }
      toast.success(i18n.t("companyModal.success"));
    } catch (err) {
      toastError(err);
    }
    handleClose();
  };

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle id="form-dialog-title">
          {companyId
            ? `${i18n.t("Editar empresa")}`
            : `${i18n.t("Adicionar empresa")}`}
        </DialogTitle>
        <Formik
          initialValues={company}
          enableReinitialize={true}
          validationSchema={CompanySchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveCompany(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting }) => (
            <Form>
              <DialogContent dividers>
                <div className={classes.multFieldLine}>
                  <Field
                    as={TextField}
                    label={i18n.t("Nome")}
                    autoFocus
                    name="name"
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                  <Field
                    as={TextField}
                    label={i18n.t("CNPJ")}
                    name="cnpj"
                    error={touched.cnpj && Boolean(errors.cnpj)}
                    helperText={touched.cnpj && errors.cnpj}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />

                  <Field
                    as={TextField}
                    label={i18n.t("Email")}
                    name="email"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  color="secondary"
                  disabled={isSubmitting}
                  variant="outlined"
                >
                  {i18n.t("Cancelar")}
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isSubmitting}
                  variant="contained"
                  className={classes.btnWrapper}
                >
                  {companyId ? `${i18n.t("Editar")}` : `${i18n.t("adicionar")}`}
                  {isSubmitting && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default CompanyModal;
