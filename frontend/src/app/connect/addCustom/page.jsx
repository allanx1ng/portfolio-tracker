import AddPortfolio from "./addPortfolio"

export default function () {
  const portfolios = [1, 2, 3, 4]

  return (
    <div>
      custom portfolios
      <div>
        {portfolios.map((i) => (
            <li key={i}>{i}</li>
        ))}
      </div>
      <button>add custom portfolio</button>
      <div>
        <AddPortfolio/>
      </div>
    </div>
  )
}
