import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with ❤️ for karaoke lovers
          </p>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <Link to="/" className="hover:underline">
            About
          </Link>
          <Link to="/" className="hover:underline">
            Privacy
          </Link>
          <Link to="/" className="hover:underline">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  )
}

