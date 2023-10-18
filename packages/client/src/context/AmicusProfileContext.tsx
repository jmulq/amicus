import { ReactNode, createContext, useContext, useState } from "react";
import { zeroAddress } from "viem";

const AmicusProfileContext = createContext<{
  profile: `0x${string}`;
  setProfile: React.Dispatch<React.SetStateAction<`0x${string}`>>;
} | null>(null);

export const AmicusProfileProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [profile, setProfile] = useState<`0x${string}`>(zeroAddress);

  return (
    <AmicusProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </AmicusProfileContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAmicusProfile = () => {
  const context = useContext(AmicusProfileContext);
  if (!context) {
    throw new Error(
      "useAmicusProfile must be used within a AmicusProfileProvider"
    );
  }
  return context;
};
