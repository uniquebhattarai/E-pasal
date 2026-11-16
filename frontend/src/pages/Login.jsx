import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { openAuthModal } from "../slices/AuthSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(openAuthModal("login"));
    navigate("/", { replace: true });
  }, [dispatch, navigate]);

  return null;
}

export default Login;
