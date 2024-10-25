import { useEffect, useReducer, useState } from "react";
import toastError from "../../errors/toastError";
import { connectToSocket } from "../../services/socket-io";

import api from "../../services/api";

const reducer = (state, action) => {
  if (action.type === "LOAD_COMPANIES") {
    const companies = action.payload;
    return [...companies];
  }

  if (action.type === "UPDATE_COMPANIES") {
    const company = action.payload;
    const index = state.findIndex((s) => s.id === company.id);

    if (index !== -1) {
      state[index] = company;
      return [...state];
    } else {
      return [company, ...state];
    }
  }

  if (action.type === "DELETE_COMPANIES") {
    const companyId = action.payload;
    const index = state.findIndex((s) => s.id === companyId);
    if (index !== -1) {
      state.splice(index, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const useCompanies = () => {
  const [companies, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchSession = async () => {
      try {
        const { data } = await api.get("/companies/");
        dispatch({ type: "LOAD_COMPANIES", payload: data.companies });
        setLoading(false);
      } catch (err) {
        setLoading(false);
        toastError(err);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const socket = { connectToSocket }();

    socket.on("company", (data) => {
      if (data.action === "update") {
        dispatch({ type: "UPDATE_COMPANIES", payload: data.company });
      }
    });

    socket.on("company", (data) => {
      if (data.action === "delete") {
        dispatch({ type: "DELETE_COMPANIES", payload: data.companyId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { companies, loading };
};

export default useCompanies;
