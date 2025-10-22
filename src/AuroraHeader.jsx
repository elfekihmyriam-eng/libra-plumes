import { Link } from "react-router-dom"
// AuroraHeader.jsx
export default function AuroraHeader() {
  return (
    <header className="bg-blue-900 text-white py-6 shadow-lg">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">Aurora Éditions</h1>
        <nav className="space-x-6">
        <nav className="space-x-6">
  <Link to="/" className="hover:text-blue-600 transition">Accueil</Link>
  <Link to="/collections" className="hover:text-blue-600 transition">Collections</Link>
  <Link to="/auteurs" className="hover:text-blue-600 transition">Auteurs</Link>
  <Link to="/contact" className="hover:text-blue-600 transition">Contact</Link>
</nav>

        </nav>
      </div>
    </header>
  )
}
