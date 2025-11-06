const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const file = require("../modles/porductSchema");
const Products = file.Products;
const Payment = require("../modles/paymentSchema");
const Response = require("../middlerwares/Response");
const User = require("../modles/userSchema");
exports.checkout = async (req, res, next) => {
  try {
    const cart = await Promise.all(
      req.user.Cart.map(async (el) => {
        const product = await Products.findById(el.productID).select(
          "_id name description images price"
        );
        return {
          price_data: {
            currency: "usd",
            unit_amount: product.price * 100,
            product_data: {
              name: product.name,
              images: product.images,
              description: product.description,
            },
          },
          quantity: el.quantity,
          product_id: product._id,
        };
      })
    );
    const products_data = cart.map((el) => {
      return { id: el.product_id, quantity: Number(el.quantity) };
    });
    // const success_products = req.user.Cart.map((el) => {
    //   return el.productID;
    // }).join(",");
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `https://organicfood-client.vercel.app/`,
      cancel_url: `https://organicfood-client.vercel.app/`,
      customer_email: req.user.email,
      line_items: cart,
      mode: "payment",
      metadata: { products_data: JSON.stringify(products_data) },
    });
    return Response(res, 200, session.url);
  } catch (err) {
    next(err);
  }
};

const AddPayment = async (session) => {
  const user = await User.findOne({ email: session.customer_email }).select(
    "_id"
  );
  const product_data = JSON.parse(session.metadata.products_data);
  // const editing = session.metadata.products_quantity;
  // const products = session.metadata.success_products.split(",");
  await Payment.create({
    products: product_data.map((el) => {
      return el.id;
    }),
    user: user._id,
    price: session.amount_total / 100,
  });
  // editing the products so by minimizing the quantity
  for (const i of product_data) {
    const product = await Products.findById(i.id);
    if (product) {
      product.quantity = Math.max(product.quantity - i.quantity, 0);
      await product.save();
    }
  }
};

exports.Webhook_checkout = async (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`webhook error: ${error.message}`);
  }
  if (event.type === "checkout.session.completed") {
    console.log(
      `Payment Done Successfuly for: ${event.data.object.customer_email}`
    );
    await AddPayment(event.data.object);
  }

  res.status(200).json({ recieved: true });
};

// exports.AddPayment = async (req, res, next) => {
//   try {
//     if (!req.user && !req.query.products && !req.query.amount_total) {
//       next();
//     }
//     console.log(req.user, req.query.products, req.query.amount_total);
//     await Payment.create({
//       prodcts: [req.query.products.split(",")],
//       user: req.user._id,
//       price: req.query.amount_total,
//     });
//     next();
//   } catch (err) {
//     next(err);
//   }
// };
