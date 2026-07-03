import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import FeaturedWork from './components/FeaturedWork.jsx'
import Services from './components/Services.jsx'
import About from './components/About.jsx'
import ContactCTA from './components/ContactCTA.jsx'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedWork />
        <Services />
        <About />
        <ContactCTA />
      </main>
      <footer className="footer">
        <div className="container footer__inner">
          <p>&copy; {new Date().getFullYear()} Preston Gray &middot; Denver, CO</p>
          <p className="footer__note">Designed &amp; built by Preston Gray</p>
        </div>
      </footer>
    </>
  )
}

export default App
