export default function Home() {
  return (
    <div>
      <div className="hero min-h-screen bg-white text-black">
        <div className="hero-content text-center rounded-3xl p-20">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">All your finances in one place</h1>
            <p className="py-6">
              AppName is currently in beta, new features will be coming soon, such as direct integration with crypto wallets, exchanges, and stock brokerages. 
            </p>
            <a className="btn btn-primary text-white" href="/portfolio">
              Get Started
            </a>
          </div>
        </div>
      </div>

      {/* <div className="gradient-bg w-100px h-100px rounded-3xl">

      </div> */}
    </div>
  )
}
