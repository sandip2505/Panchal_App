// import React, {createContext, useState} from 'react';

// import {AuthContext} from '../Contexts/auth';

// export const AppContext = createContext({});

// export const OrdersProvider = props => {
//   const [parentsData, setParentsData] = useState(null);
//   const [childData, setChildData] = useState([]);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   {console.log("isLoggedIn in context = = = = =>", isLoggedIn)}

//   const value = {
//     parentsData,
//     setParentsData,
//     childData,
//     setChildData,
//     isLoggedIn,
//     setIsLoggedIn,
//   };

//   return (
//     <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
//   );
// };
