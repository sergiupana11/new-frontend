import CarCard from "../components/CarCard";
import CarCardList from "../components/CarCardList";
import {NavbarSimple} from "../components/Navbar";

export default function Home() {

    const token = localStorage.getItem('jwt')

    const car = {
        id: '1234',
        brand: 'Porsche',
        model: '911 GT3RS',
        price: 1000,
        image: 'https://images.unsplash.com/photo-1526069824293-406685e85766?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }

    return (
        <div>
            <NavbarSimple />
        <CarCardList token={token}/>
        </div>
    )
}