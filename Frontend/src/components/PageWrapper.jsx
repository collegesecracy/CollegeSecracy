import React, { useState, useEffect } from "react";
import Loader from "./Loaders/Loader";

const PageWrapper = ({ children, delay = 700 }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return loading ? <Loader /> : <>{children}</>;
};

export default PageWrapper;
