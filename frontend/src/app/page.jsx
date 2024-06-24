export default function Home() {
  return (
    <div>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">All your finances in one place</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
              exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
            </p>
            <a className="btn btn-primary" href="/portfolio">
              Get Started
            </a>
          </div>
        </div>
      </div>

      <h1>All your finances in one place</h1>
      <div>
        view portfolio:
        <a href="/portfolio">portfolios</a>
      </div>
    </div>
    // <RootLayout>

    // <div>hello world</div>
    // </RootLayout>
  )
}
