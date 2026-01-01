const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { Products } = require("../modles/porductSchema");
const Payment = require("../modles/paymentSchema");
const Response = require("../middlerwares/Response");
const AppError = require("../utils/AppError");
const checkoutSession = require("../modles/TempCheckoutSession");
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
        const priceCents = Math.round(Number(product.price) * 100);
        if (!Number.isFinite(priceCents)) {
          throw new AppError("Invalid product price", 400);
        }
        return {
          price_data: {
            currency: "usd",
            unit_amount: priceCents,
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
    const temp = await checkoutSession.create({
      user: req.user._id,
      products: req.user.Cart.map((el) => {
        return { productID: el.productID, quantity: el.quantity };
      }),
      status: "pending",
    });
    console.log(temp._id);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `https://organicfood-client.vercel.app/`,
      cancel_url: `https://organicfood-client.vercel.app/`,
      client_reference_id: temp._id.toString(),
      customer_email: req.user.email,
      line_items: cart,
      mode: "payment",
    });
    temp.stripeSessionId = session.id;
    await temp.save();
    return Response(res, 200, session.url);
  } catch (err) {
    next(err);
  }
};
exports.Webhook_checkout = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // 1️⃣ Load temp checkout session
    const tempSession = await checkoutSession.findById(
      session.client_reference_id
    );

    if (!tempSession) {
      // already deleted / expired → ignore safely
      return res.status(200).json({ received: true });
    }

    // 2️⃣ Idempotency protection
    if (tempSession.status === "paid") {
      return res.status(200).json({ received: true });
    }

    // 3️⃣ Load user
    const user = await User.findById(tempSession.user).select(
      "_id Cart purchase_history"
    );

    if (!user) {
      console.error("User not found for checkout session");
      return res.status(200).json({ received: true });
    }

    // 4️⃣ Create Payment (Stripe is the authority)
    const payment = await Payment.create({
      products: tempSession.products,
      user: user._id,
      total: session.amount_total / 100,
      currency: session.currency,
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent,
    });

    // 5️⃣ Deduct inventory
    for (const item of tempSession.products) {
      const product = await Products.findById(item.productID);

      if (product) {
        product.quantity = Math.max(
          product.quantity - Number(item.quantity),
          0
        );
        await product.save();
      }
    }

    // 6️⃣ Update user
    user.purchase_history.push(payment._id);
    user.Cart = [];
    await user.save();

    // 7️⃣ Mark temp checkout as paid
    tempSession.status = "paid";
    await tempSession.save();
  }

  res.status(200).json({ received: true });
};
