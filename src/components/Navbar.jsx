import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav>
      <h2>CIAE</h2>
      <ul>
        <li>
          <Link to="/">Inicio</Link>
        </li>
        <li>
          <Link to="/contact">Contacto</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
