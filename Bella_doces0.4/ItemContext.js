import React, { createContext, useState } from 'react';

export const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  const [itens, setItens] = useState([]);

  const atualizarStatus = (id, novoStatus) => {
    setItens((prevItens) =>
      prevItens.map((item) =>
        item.id === id ? {...item, status: novoStatus } : item
      )
    );
  };

  const atualizarQuantidade = (id, novaQuantidade) => {
    setItens((prevItens) =>
      prevItens.map((item) =>
        item.id === id ? {...item, quantidade: novaQuantidade } : item
      )
    );
  };

  return (
    <ItemContext.Provider value={{ itens, setItens, atualizarStatus, atualizarQuantidade }}>
      {children}
    </ItemContext.Provider>
  );
};
