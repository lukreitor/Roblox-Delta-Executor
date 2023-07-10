import { createContext, useState } from "react";

export const OrderContext = createContext();

export const OrderContextProvider = ({children}) => {
    const [order, setOrder] = useState([]);
    const [total, setTotal] = useState(0);

    return(
        <OrderContext.Provider value={{order, setOrder, total, setTotal}}>
            {children}
        </OrderContext.Provider>
    )
}