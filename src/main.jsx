import "./Style.css"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Register from './pages/Register'
import { Route,Routes,BrowserRouter } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import AddCategory from './pages/admin/AddCategory'
import AddProduct from './pages/admin/AddProduct'
import CategoryDetails from './pages/CategoryDetails'
import ProductPage from './pages/ProductPage'
import Categories from './pages/Categories'
import AdminPanel from './pages/admin/AdminPanel'
import { Navigate } from "react-router-dom"
import ManageCategories from './pages/admin/ManageCategories'
import ManageProducts from './pages/admin/ManageProducts'
import EditCategory from './pages/admin/EditCategory'
import EditProduct from './pages/admin/EditProduct'
import ManageBanners from './pages/admin/ManageBanners'
import TempPage from './pages/TempPage'
import Cart from './pages/Cart'
import OrderSuccess from './pages/OrderSuccess'
import Checkout from './pages/Checkout'
import ScrollToTop from './components/ScrollToTop'
import ManageOrders from './pages/admin/ManageOrders'
import Orders from './pages/Orders'
import Wishlist from './pages/Wishlist'
import Profile from './pages/Profile'
import { Toaster } from "react-hot-toast"

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"))
  const isAdmin = user?.role === "admin"
  return isAdmin ? children : <Navigate to="/" />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
<BrowserRouter>

  <ScrollToTop />
  <Toaster position="top-right" />

<Routes>

  <Route path='/register' element={<Register/>}/>
  <Route path='/login' element={<Login/>}/>
  <Route path='/' element={<Home/>}/>
  <Route path='/categories' element={<Categories/>}/>
  <Route path='/CategoryDetails/:id' element={<CategoryDetails/>}/>
  <Route path='/ProductPage/:id' element={<ProductPage/>}/>
  <Route path="/about" element={<TempPage/>}/>
  <Route path="/contact" element={<TempPage/>}/>
  <Route path="/cart" element={<Cart/>}/>
  <Route path="/success" element={<OrderSuccess/>}/>
  <Route path="/checkout" element={<Checkout/>}/>
  <Route path="/orders" element={<Orders/>}/>
  <Route path="/wishlist" element={<Wishlist/>}/>
  <Route path="/profile" element={<Profile/>}/>


  <Route path='/admin' element={<AdminRoute><AdminPanel /></AdminRoute>}>
    <Route index element={<Navigate to="add-category" />} />
    <Route path='add-category' element={<AddCategory/>}/>
    <Route path='manage-categories' element={<ManageCategories/>}/>
    <Route path='add-product' element={<AddProduct/>}/>
    <Route path='manage-products' element={<ManageProducts/>}/>
    <Route path='manage-banners' element={<ManageBanners/>}/>
    <Route path='manage-orders' element={<ManageOrders/>}/>

    <Route path='edit-category/:id' element={<EditCategory/>} />
    <Route path='edit-product/:id' element={<EditProduct/>} />
  </Route>

</Routes>
</BrowserRouter>
  </StrictMode>,
)