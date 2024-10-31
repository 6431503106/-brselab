import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import App from './App.jsx'
import './index.css';
import HomeScreen from './screens/HomeScreen.jsx'
import ProductScreen from './screens/ProductScreen.jsx'
import store from './store.js'
import SearchScreen from './components/SearchScreen';
import CartScreen from './screens/CartScreen.jsx'
import ContactUsScreen from './screens/ContactUsScreen.jsx'
import ManageMessages from './screens/admin/ManageMessages.jsx'
import LoginScreen from './screens/LoginScreen.jsx'
import ResetPassword from './screens/ResetPassword.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import OrderScreen from './screens/OrderScreen.jsx'
import ProfileScreen from './screens/ProfileScreen.jsx'
import ProfileScreen2 from './screens/ProfileScreen2.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import UserListScreen from './screens/admin/UserListScreen.jsx'
import ProductListScreen from './screens/admin/ProductListScreen.jsx'
import ProductCreateScreen from './screens/admin/ProductCreateScreen.jsx'
import OrderListScreen from './screens/admin/OrderListScreen.jsx'
import ConfirmScreen from './screens/admin/ConfirmScreen.jsx'
import ReturnScreen from './screens/admin/ReturnScreen.jsx'
import NonScreen from './screens/admin/NonScreen.jsx'
import BorrowingScreen from './screens/admin/BorrowingScreen.jsx'
import CancelScreen from './screens/admin/CancelScreen.jsx'
import ProductEditScreen from './screens/admin/ProductEditScreen.jsx'
import UserEditScreen from './screens/admin/UserEditScreen.jsx'
import AddScreen from './screens/admin/AddScreen.jsx';
import CategoryProductsScreen from './screens/CategoryProductsScreen.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={< App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/search/:keyword' element={<HomeScreen />} />
      <Route path="/search" element={<SearchScreen />} />
      <Route path='/product/:id' element={<ProductScreen />} />
      <Route path='/cart' element={<CartScreen />} />
      <Route path='/contactUs' element={<ContactUsScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/reset-password/:resetToken' element={<ResetPassword />} />
      <Route path='/category/:categoryId' element={<CategoryProductsScreen />} />
      {/*Private Routes*/}
      <Route path="" element={<PrivateRoute />} >
        <Route path='/order/:id' element={<OrderScreen />} />
        <Route path='/profile' element={<ProfileScreen />} />
        <Route path='/profile2' element={<ProfileScreen2 />} />
      </Route>
      {/*Admin Routes*/}
      <Route path='/' element={<AdminRoute />}>
        <Route path='/admin/users' element={<UserListScreen />} />
        <Route path='/admin/users/:id/edit' element={<UserEditScreen />} />
        <Route path='/admin/product/create' element={<ProductCreateScreen />} />
        <Route path='/admin/products' element={<ProductListScreen />} />
        <Route path='/admin/orders' element={<OrderListScreen />} />
        <Route path='/admin/confirm' element={<ConfirmScreen />} />
        <Route path='/admin/borrowing' element={<BorrowingScreen />} />
        <Route path='/admin/return' element={<ReturnScreen />} />
        <Route path='/admin/cancel' element={<CancelScreen />} />
        <Route path='/admin/non' element={<NonScreen />} />
        <Route path='/admin/manageMessages' element={<ManageMessages/>} />
        <Route path='/admin/product/:id/edit' element={<ProductEditScreen />} />
        <Route path='/admin/add' element={<AddScreen />} />
      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider >
)