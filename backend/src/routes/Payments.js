require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

class Payments {
  static async donateMoney(req, res) {
    const donateItems = new Map([
      [5, { price: 500, name: "$5 Donation" }],
      [10, { price: 1000, name: "$10 Donation" }],
      [20, { price: 2000, name: "$20 Donation" }],
      [50, { price: 5000, name: "$50 Donation" }],
      [100, { price: 10000, name: "$100 Donation" }],
    ])
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: req.body.items.map((item) => {
          const storeItem = donateItems.get(item)
          return {
            price_data: {
              currency: "cad",
              product_data: {
                name: storeItem.name,
              },
              unit_amount: storeItem.price,
            },
            quantity: 1,
          }
        }),
        success_url: `${process.env.CLIENT_URL}/payment/success`,
        cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      })
      // console.log(session)
      res.status(200).json({ url: session.url })
    } catch (e) {
      console.log(e)
      console.log(500)
      res.status(500).json({ error: e.message })
    }
  }
}

module.exports = Payments
