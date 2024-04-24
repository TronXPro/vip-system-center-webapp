import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from '../pages/Home'
import SaleRecord from "../pages/SaleRecord";
import TokenList from '../pages/TokenList'
import Help from "../pages/Help";
import Recharge from '../pages/Recharge'
import Login from "../pages/Login";
import ToolKit from "../pages/ToolKit";
import RechargeRecord from "../pages/RechargeRecord";

const routerList = [
  {
    path: '/',
    element: <MainLayout/>,
    children: [
      {
        path: 'home',
        element: <Home/> 
      },{
        path: 'sale-record',
        element: <SaleRecord/> 
      },{
        path: 'recharge-record',
        element: <RechargeRecord/> 
      },{
        path: 'token-list',
        element: <TokenList/> 
      },{
        path: 'help',
        element: <Help/> 
      },{
        path: 'recharge',
        element: <Recharge/> 
      },{
        path: 'toolKit',
        element: <ToolKit/> 
      }
    ]
  },{
    path: '/login',
    element: <Login/> 
  }
]
const router = createBrowserRouter(routerList)

export default router;