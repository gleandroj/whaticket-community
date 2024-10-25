import {
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import { Visibility, VisibilityOff, Delete } from "@material-ui/icons";
import { Field, Form, Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { AuthContext } from "../../context/Auth/AuthContext";
import toastError from "../../errors/toastError";
import useCompanies from "../../hooks/useCompanies";
import useWhatsApps from "../../hooks/useWhatsApps";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import { Can } from "../Can";
import QueueSelect from "../QueueSelect";

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

const UserSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  password: Yup.string().min(5, "Too Short!").max(50, "Too Long!"),
  email: Yup.string().email("Invalid email").required("Required"),
});

const UserModal = ({ open, onClose, userId }) => {
  const classes = useStyles();

  const initialState = {
    name: "",
    email: "",
    password: "",
    profile: "user",
  };

  const { user: loggedInUser } = useContext(AuthContext);

  const [user, setUser] = useState(initialState);
  const [selectedQueueIds, setSelectedQueueIds] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [whatsappId, setWhatsappId] = useState(false);
  const [companiesIds, setCompaniesId] = useState([]);
  const { loading: isWhatsappLoading, whatsApps } = useWhatsApps();
  const { loading: isCompaniesLoading, companies } = useCompanies();
  const loading = isWhatsappLoading || isCompaniesLoading;

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const { data } = await api.get(`/users/${userId}`);
        setUser((prevState) => {
          return { ...prevState, ...data };
        });
        const userQueueIds = data.queues?.map((queue) => queue.id);
        setSelectedQueueIds(userQueueIds);
        setWhatsappId(data.whatsappId ? data.whatsappId : "");
        setCompaniesId(data.companies ? data.companies.map((c) => c.id) : []);
      } catch (err) {
        toastError(err);
      }
    };
    fetchUser();
  }, [userId, open]);

  const handleClose = () => {
    onClose();
    setUser(initialState);
  };

  const handleSaveUser = async (values) => {
    const userData = {
      ...values,
      whatsappId,
      queueIds: selectedQueueIds,
      companiesIds,
    };
    try {
      if (userId) {
        await api.put(`/users/${userId}`, userData);
      } else {
        await api.post("/users", userData);
      }
      toast.success(i18n.t("userModal.success"));
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
          {userId
            ? `${i18n.t("userModal.title.edit")}`
            : `${i18n.t("userModal.title.add")}`}
        </DialogTitle>
        <Formik
          initialValues={{
            name: user.name,
            email: user.email,
            password: user.password,
            profile: user.profile,
          }}
          enableReinitialize={true}
          validationSchema={UserSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveUser(values);
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
                    label={i18n.t("userModal.form.name")}
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
                    name="password"
                    variant="outlined"
                    margin="dense"
                    label={i18n.t("userModal.form.password")}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword((e) => !e)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                  />
                </div>
                <div className={classes.multFieldLine}>
                  <Field
                    as={TextField}
                    label={i18n.t("userModal.form.email")}
                    name="email"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />

                  <Can
                    role={loggedInUser.profile}
                    perform="user-modal:editCompany"
                    yes={() =>
                      !loading && (
                        <FormControl
                          variant="outlined"
                          margin="dense"
                          className={classes.maxWidth}
                          fullWidth
                        >
                          <InputLabel>
                            {i18n.t("userModal.form.company")}
                          </InputLabel>
                          <Field
                            as={Select}
                            value={companiesIds}
                            multiple
                            renderValue={(selected) => (
                              <div className={classes.chips}>
                                {selected?.length > 0 &&
                                  selected.map((id) => {
                                    const company = companies.find(
                                      (q) => q.id === id
                                    );
                                    return company ? (
                                      <Chip
                                        key={id}
                                        variant="outlined"
                                        label={company.name}
                                      />
                                    ) : null;
                                  })}
                              </div>
                            )}
                            onChange={(e) => {
                              setCompaniesId(e.target.value);
                            }}
                            label={i18n.t("userModal.form.company")}
                          >
                            {companies.map((company) => (
                              <MenuItem key={company.id} value={company.id}>
                                <Checkbox
                                  checked={companiesIds.includes(company.id)}
                                />
                                <ListItemText primary={company.name} />
                              </MenuItem>
                            ))}
                          </Field>
                        </FormControl>
                      )
                    }
                  />

                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                    margin="dense"
                  >
                    <Can
                      role={loggedInUser.profile}
                      perform="user-modal:editProfile"
                      yes={() => (
                        <>
                          <InputLabel id="profile-selection-input-label">
                            {i18n.t("userModal.form.profile")}
                          </InputLabel>

                          <Field
                            as={Select}
                            label={i18n.t("userModal.form.profile")}
                            name="profile"
                            labelId="profile-selection-label"
                            id="profile-selection"
                            required
                          >
                            <MenuItem value="superAdmin">Super Admin</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="user">User</MenuItem>
                          </Field>
                        </>
                      )}
                    />
                  </FormControl>
                </div>
                <Can
                  role={loggedInUser.profile}
                  perform="user-modal:editQueues"
                  yes={() => (
                    <QueueSelect
                      selectedQueueIds={selectedQueueIds}
                      onChange={(values) => setSelectedQueueIds(values)}
                    />
                  )}
                />
                <Can
                  role={loggedInUser.profile}
                  perform="user-modal:editQueues"
                  yes={() =>
                    !loading && (
                      <FormControl
                        variant="outlined"
                        margin="dense"
                        className={classes.maxWidth}
                        fullWidth
                      >
                        <InputLabel>
                          {i18n.t("userModal.form.whatsapp")}
                        </InputLabel>
                        <Field
                          as={Select}
                          value={whatsappId}
                          onChange={(e) => setWhatsappId(e.target.value)}
                          label={i18n.t("userModal.form.whatsapp")}
                        >
                          {whatsApps.map((whatsapp) => (
                            <MenuItem key={whatsapp.id} value={whatsapp.id}>
                              {whatsapp.name}
                            </MenuItem>
                          ))}
                        </Field>
                      </FormControl>
                    )
                  }
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  color="secondary"
                  disabled={isSubmitting}
                  variant="outlined"
                >
                  {i18n.t("userModal.buttons.cancel")}
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isSubmitting}
                  variant="contained"
                  className={classes.btnWrapper}
                >
                  {userId
                    ? `${i18n.t("userModal.buttons.okEdit")}`
                    : `${i18n.t("userModal.buttons.okAdd")}`}
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

export default UserModal;
