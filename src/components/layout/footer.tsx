import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full border-t mt-12 bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground">
        <div>
          <h4 className="font-semibold text-foreground mb-2">AudenFX</h4>
          <p>SaaS Trading Journal untuk Forex, Crypto & Saham.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">Menu</h4>
          <ul className="space-y-1">
            <li><Link href="/pricing" className="hover:underline">Pricing</Link></li>
            <li><Link href="/about" className="hover:underline">About</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            <li><Link href="/terms" className="hover:underline">Terms</Link></li>
          </ul>
        </div>
        <div className="text-right md:text-left">
          <h4 className="font-semibold text-foreground mb-2">Social</h4>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">Instagram</a></li>
            <li><a href="#" className="hover:underline">Twitter</a></li>
            <li><a href="#" className="hover:underline">Telegram</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t text-center text-xs py-4 text-muted-foreground">
        © {new Date().getFullYear()} AudenFX. Built with ❤️ for traders.
      </div>
    </footer>
  )
}
