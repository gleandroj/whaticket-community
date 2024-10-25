import { useEffect, useReducer, useState } from "react";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { useSocketIO } from "../../context/SocketIO";

const reducer = (state, action) => {
  if (action.type === "LOAD_WHATSAPPS") {
    const whatsApps = action.payload;

    return [...whatsApps];
  }

  if (action.type === "UPDATE_WHATSAPPS") {
    const whatsApp = action.payload;
    const whatsAppIndex = state.findIndex((s) => s.id === whatsApp.id);

    if (whatsAppIndex !== -1) {
      state[whatsAppIndex] = whatsApp;
      return [...state];
    } else {
      return [whatsApp, ...state];
    }
  }

  if (action.type === "UPDATE_SESSION") {
    const whatsApp = action.payload;
    const whatsAppIndex = state.findIndex((s) => s.id === whatsApp.id);

    if (whatsAppIndex !== -1) {
      state[whatsAppIndex].status = whatsApp.status;
      state[whatsAppIndex].updatedAt = whatsApp.updatedAt;
      state[whatsAppIndex].qrcode = whatsApp.qrcode;
      state[whatsAppIndex].retries = whatsApp.retries;
      return [...state];
    } else {
      return [...state];
    }
  }

  if (action.type === "DELETE_WHATSAPPS") {
    const whatsAppId = action.payload;

    const whatsAppIndex = state.findIndex((s) => s.id === whatsAppId);
    if (whatsAppIndex !== -1) {
      state.splice(whatsAppIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const useWhatsApps = () => {
  const [whatsApps, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(true);
  const { connectToSocket } = useSocketIO();

  useEffect(() => {
    setLoading(true);
    const fetchSession = async () => {
      try {
        const { data } = await api.get("/whatsapp/");
        dispatch({ type: "LOAD_WHATSAPPS", payload: data });
        setLoading(false);
      } catch (err) {
        setLoading(false);
        toastError(err);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const socket = connectToSocket();

    const onWhatsapp = (data) => {
      if (data.action === "update") {
        dispatch({ type: "UPDATE_WHATSAPPS", payload: data.whatsapp });
      }
      if (data.action === "delete") {
        dispatch({ type: "DELETE_WHATSAPPS", payload: data.whatsappId });
      }
    };
    const onWhatsappSession = (data) => {
      if (data.action === "update") {
        dispatch({ type: "UPDATE_SESSION", payload: data.session });
      }
    };

    socket.on("whatsapp", onWhatsapp);
    socket.on("whatsappSession", onWhatsappSession);

    return () => {
      socket.off("whatsapp", onWhatsapp);
      socket.off("whatsappSession", onWhatsappSession);
    };
  }, []);

  return { whatsApps, loading };
};

export default useWhatsApps;
