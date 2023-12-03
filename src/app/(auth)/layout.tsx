import { FC, ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="bg-slate-800 p-10 m-10 rounded-md flex justify-center  items-center">
      {children}
    </div>
  );
};

export default AuthLayout;
