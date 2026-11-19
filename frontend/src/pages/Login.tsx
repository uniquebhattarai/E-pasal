import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { openAuthModal } from "../slices/AuthSlice";
import { useAppDispatch } from "../hooks/useRedux";

function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(openAuthModal("login"));
    navigate("/", { replace: true });
  }, [dispatch, navigate]);

  return null;
}

export default Login;
