import { useLocation } from "react-router-dom"
import Navbar from '../components/Navbar'

function TempPage() {

const location = useLocation()

  return (
<>

<Navbar/>

    {
        location.pathname === "/about"
        ? <h1 className="flex justify-center items-center h-screen font-bold text-2xl">Ithu oru prasthaanam aan!!</h1>
        : <h1 className="flex justify-center items-center h-screen font-bold text-2xl">Nink Vilichittu nthakaana??</h1>
    }
</>
  )
}

export default TempPage