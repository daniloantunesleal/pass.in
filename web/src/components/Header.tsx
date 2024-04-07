import nlwUniteIcon from "../assets/nlw-unite-icon.svg"
import { NavLink } from "./NavLink"

export function Header() {
    return (
        <div className="flex items-center gap-5 py-2">
            <img src={nlwUniteIcon} alt="nlw-unite-icon" />

            <nav className="flex items-center gap-5">
                <NavLink href="/eventos">Participantes</ NavLink>
                <NavLink href="/participantes">Eventos</ NavLink>
            </nav>
        </div>
    )
}