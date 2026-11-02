import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { openAuthModal } from "../slices/AuthSlice";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(openAuthModal("signup"));
    navigate("/", { replace: true });
  }, [dispatch, navigate]);

  return null;
}

export default Signup;
