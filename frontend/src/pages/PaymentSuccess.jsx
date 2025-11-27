import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      if (!sessionId) return;

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/payment/verify-payment`,
          { sessionId }
        );

        if (data.success) {
          toast.success("Payment Successful 🎉");
        } else {
          toast.error("Payment verification failed ❌");
        }

        // Redirect after short delay for better UX
        setTimeout(() => navigate("/my-appointments"), 2000);
      } catch (error) {
        console.error("Error verifying payment:", error);
        toast.error("Error verifying payment ❌");
        navigate("/my-appointments");
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        Payment Successful 🎉
      </h2>
      <p className="text-gray-600 mb-6">
        Redirecting you to your appointments...
      </p>
    </div>
  );
};

export default PaymentSuccess;
