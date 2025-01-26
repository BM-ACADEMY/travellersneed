const Payment = require("../Models/paymentModel");

// 1. Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const { bookingId, userId, price, upiTransactionId, paymentMethod,status } = req.body;

    // Create a new payment
    const newPayment = new Payment({
      bookingId,
      userId,
      price,
      upiTransactionId,
      status,
      paymentMethod,
      
    });

    await newPayment.save();
    res.status(201).json({ message: "Payment created successfully", payment: newPayment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Get all payments
// exports.getAllPayments = async (req, res) => {
//   try {
//     const payments = await Payment.find()
//       .populate("bookingId", "orderId price")
//       .populate("userId", "name email");
//     res.json({ message: "All payments retrieved", payments });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, filter = "all" } = req.query;

    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfLastWeek = new Date(new Date().setDate(today.getDate() - 7));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Define the date filter based on the query parameter
    let dateFilter = {};
    if (filter === "today") {
      dateFilter = { createdAt: { $gte: startOfToday } };
    } else if (filter === "lastWeek") {
      dateFilter = { createdAt: { $gte: startOfLastWeek } };
    } else if (filter === "month") {
      dateFilter = { createdAt: { $gte: startOfMonth } };
    }

    // Get filtered payment data with pagination
    const payments = await Payment.find(dateFilter)
      .populate("bookingId", "orderId price")
      .populate("userId", "username email")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    // Calculate counts and stats
    const totalPayments = await Payment.countDocuments(); // Total payments
    const filteredPaymentsCount = await Payment.countDocuments(dateFilter); // Payments matching the filter
    const todayPaymentsCount = await Payment.countDocuments({
      createdAt: { $gte: startOfToday },
    });
    const totalFailedPayments = await Payment.countDocuments({
      status: "Failed",
    });
    const totalConfirmedPayments = await Payment.countDocuments({
      status: "Completed",
    });

    // Create the stats object in the desired format
    const stats = [
      { title: "Total Payments", count: totalPayments },
      { title: "Today's Payments", count: todayPaymentsCount },
      { title: "Filtered Payments", count: filteredPaymentsCount },
      { title: "Failed Payments", count: totalFailedPayments },
      { title: "Confirmed Payments", count: totalConfirmedPayments },
    ];

    // Send response
    res.status(201).json({
      message: "All payments retrieved successfully",
      stats,
      payments,
      pagination: {
        currentPage: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(filteredPaymentsCount / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// 3. Get a payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId)
      .populate("bookingId", "orderId price")
      .populate("userId", "name email");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(201).json({ message: "Payment retrieved successfully", payment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Update payment status by ID
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body;

    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { status },
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(201).json({ message: "Payment status updated successfully", payment: updatedPayment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Delete a payment by ID
exports.deletePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const deletedPayment = await Payment.findByIdAndDelete(paymentId);

    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(201).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
