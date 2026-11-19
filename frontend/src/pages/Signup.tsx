import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { openAuthModal } from "../slices/AuthSlice";
import { useAppDispatch } from "../hooks/useRedux";

function Signup() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(openAuthModal("signup"));
    navigate("/", { replace: true });
  }, [dispatch, navigate]);

  return null;
}

export default Signup;
