import { useSession } from 'next-auth/react';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type DocumentCounts = {
  received: number;
  dispatch: number;
  intransit: number;
  completed: number;
  total: number;
};


interface CountContextType {
  tab:keyof DocumentCounts|undefined;
  updateCount: (tab: keyof DocumentCounts, count: number) => void;
  notify: (tab: keyof DocumentCounts) => void;
  getInitialCount: () => DocumentCounts;
}

const CountContext = createContext<CountContextType | undefined>(undefined);

export const useCount = (): CountContextType => {
  const context = useContext(CountContext);
  if (!context) {
    throw new Error('useCount must be used within a CountProvider');
  }
  return context;
};

interface CountProviderProps {
  children: ReactNode;
}

export const CountProvider: React.FC<CountProviderProps> = ({ children }) => {
  const [tab, setTab] = useState<keyof DocumentCounts>();
  const {data:session} = useSession();

  const updateCount = (tab: keyof DocumentCounts, count: number) => {
    if(!session?.user.id) return;
    const storedCounts = localStorage.getItem(session?.user.id);
    if (storedCounts) {
      const _counts = JSON.parse(storedCounts) as DocumentCounts;
      _counts[tab] = count;
      localStorage.setItem(session?.user.id, JSON.stringify(_counts));
    } else {
      const _counts: DocumentCounts = {
        received: 0,
        dispatch: 0,
        intransit: 0,
        completed: 0,
        total: 0,
      };
      _counts[tab] = count;
      localStorage.setItem(session?.user.id, JSON.stringify(_counts));
      
    }
  };

  const notify = (tab:keyof DocumentCounts)=>{
    setTab(tab);
  }

  const getInitialCount = () => {
    if(!session?.user.id) return;
    const storedCounts =  localStorage.getItem(session?.user.id);
    return storedCounts ? JSON.parse(storedCounts) : {
      received: 0,
      dispatch: 0,
      intransit: 0,
      completed: 0,
      total: 0,
    };
  };

  return (
    <CountContext.Provider value={{ tab, notify, updateCount, getInitialCount }}>
      {children}
    </CountContext.Provider>
  );
};
