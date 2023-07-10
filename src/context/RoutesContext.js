import { createContext } from "react";

export const RoutesContext = createContext();

export const RoutesContextProvider = ({children}) => {
    const urlGeral = 'https://whispering-brook-75313.herokuapp.com/http://fomev10-env.eba-sq3qqxd7.sa-east-1.elasticbeanstalk.com';

    const urls = {
        geral: 'https://whispering-brook-75313.herokuapp.com/http://fomev10-env.eba-sq3qqxd7.sa-east-1.elasticbeanstalk.com',
        product: `${urlGeral}/product/`,
        user: `${urlGeral}/user/`,
        order: `${urlGeral}/order/`,
        table: `${urlGeral}/table/`,
        category: `${urlGeral}/category/`,
        payOrder: `${urlGeral}/table/payorder/`,
        genPass: `${urlGeral}/table/gen-password/`,
        finishOrder: `${urlGeral}/table/finish-order/`,
        makeOrder: `${urlGeral}/order/make-order/`
    }
    return(
        <RoutesContext.Provider value={{urls}}>
            {children}
        </RoutesContext.Provider>
    )
}