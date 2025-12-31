const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const file = require("../modles/porductSchema");
const Products = file.Products;
const Payment = require("../modles/paymentSchema");
const Response = require("../middlerwares/Response");
const User = require("../modles/userSchema");
exports.checkout = async (req, res, next) => {
  try {
    if (req.user.Cart.length <= 0) {
      return Response(res, 400, "Your cart is empty.");
    }
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
        };
      })
    );
    const products_data = req.user.Cart.map((el) => {
      return {
        id: el.productID.toString(),
        quantity: Number(el.quantity),
      };
    });
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
  try {
    const user = await User.findOne({ email: session.customer_email }).select(
      "_id purchase_history Cart"
    );
    if (!user) {
      console.error(`User not found for email ${session.customer_email}`);
      return;
    }

    const product_data = JSON.parse(session.metadata.products_data || "[]");

    const payment = await Payment.create({
      products: product_data.map((el) => ({
        productID: el.id,
        quantity: Number(el.quantity) || 0,
      })),
      user: user._id,
      total: session.amount_total / 100,
    });

    for (const i of product_data) {
      const product = await Products.findById(i.id);
      if (product) {
        product.quantity = Math.max(
          product.quantity - Number(i.quantity || 0),
          0
        );
        await product.save();
      }
    }

    user.purchase_history.push(payment._id);
    user.Cart = [];
    await user.save();
  } catch (error) {
    console.error(error);
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
