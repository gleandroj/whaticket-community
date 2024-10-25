import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TextMaskCustom from "../TextMaskCustom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  multFieldLine: {
    display: "flex",
    flexDirection: "column",
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
  const [company, setCompany] = useState(initialState);

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
      toast.success(i18n.t("companies.toasts.success"));
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
        maxWidth="xs"
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
                    InputProps={{
                      inputComponent: TextMaskCustom,
                    }}
                    inputProps={{
                      mask: "##.###.###/####-##",
                    }}
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
